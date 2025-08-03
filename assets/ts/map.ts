// @ts-nocheck

class MapboxGLButtonControl {
    constructor({ className = "", title = "" }) {
        this._className = className;
        this._title = title;
    }

    onAdd(map: any) {
        this._btn = document.createElement("button");
        this._btn.className = "mapboxgl-ctrl-icon" + " " + this._className;
        this._btn.type = "button";
        this._btn.title = this._title;
        this._btn.onclick = () => {
            map.flyTo({ center: [108.14, 33.87], zoom: 3 });
        };

        this._container = document.createElement("div");
        this._container.className = "mapboxgl-ctrl-group mapboxgl-ctrl";
        this._container.appendChild(this._btn);

        return this._container;
    }

    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }
}

const ctrlPolygon = new MapboxGLButtonControl({
    className: "mapbox-gl-draw_polygon",
    title: "返回",
});

mapboxgl.accessToken =
    "pk.eyJ1IjoiZmF0ZXNpbmdlciIsImEiOiJjanc4bXFocG8wMXM1NDNxanB0MG5sa2ZpIn0.HqA5Q8Y4Jp1s3_TQ-sqVoQ";

class MAP {
    constructor(config) {
        this.data = config.data;
        this.center = config.center || [108.14, 33.87];
        this.hasCluster = config.hasCluster;
        this.container = config.container || "map";
        this.clusterData = [];
        this.markers = [];
        this.map = null;
        this.lineArr = [];
        this.drawing = false;
        this.marking = false;
        this.showCursor = false;
        this.cursorRadius = 0;
        this.selectionSize = 0;
        this.marker = null;
        this.zoom = config.zoom || 2;
        this.minZoom = 1;
        this.maxZoom = 12;
        this.cluster = null;
        this.canvas = null;
        this.coordinates = document.getElementById("coordinates");
        this.geojson = {
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [0, 0],
                    },
                },
            ],
        };
        this._create();
    }

    async _fetchData() {
        await fetch("/index.json").then(async (t) => {
            return await t.json().then(async (t) => {
                const features = [];

                // group by city
                t.forEach((item) => {
                    let city = features.find(
                        (i) => i.properties.title === item.city
                    );
                    if (!city) {
                        city = {
                            type: "Feature",
                            geometry: {
                                type: "Point",
                                coordinates: [item.longitude, item.latitude],
                            },
                            properties: {
                                image: item.cover,
                                title: item.city,
                                city: item.city,
                                posts: [
                                    {
                                        permalink: item.permalink,
                                        title: item.title,
                                        cover: item.cover,
                                    },
                                ],
                            },
                        };
                        features.push(city);
                    } else {
                        city.properties.posts.push({
                            permalink: item.permalink,
                            title: item.title,
                            cover: item.cover,
                        });
                    }
                });

                const data = {
                    type: "FeatureCollection",
                    features,
                };
                this.data = data;
            });
        });
    }

    async _create() {
        console.log("create");
        await this._fetchData();
        this.map = new mapboxgl.Map({
            container: this.container,
            style: "mapbox://styles/mapbox/light-v10",
            center: this.center,
            cluster: this.cluster,
            minZoom: this.minZoom,
            maxZoom: this.maxZoom,
            zoom: this.zoom,
        });

        if (this.hasCluster) {
            this.cluster = new Supercluster({
                radius: 26,
                maxZoom: this.maxZoom,
            });
        }

        this.canvas = this.map.getCanvasContainer();

        this.map.addControl(
            new MapboxLanguage({
                defaultLanguage: "zh-Hans",
            })
        );

        this.map.addControl(
            new mapboxgl.NavigationControl({
                showCompass: false,
            })
        );

        if (this.hasCluster) {
            this.map.addControl(ctrlPolygon, "top-right");
        }

        this.map.on("load", () => {
            if (this.data) {
                if (this.hasCluster) {
                    console.log(this.data.features);

                    this.cluster.load(this.data.features);

                    this.clusterData = {
                        type: "FeatureCollection",
                        features: this.cluster.getClusters(
                            [-180, -90, 180, 90],
                            3
                        ),
                    };
                    this.updateMarkers();
                    document
                        .querySelector("#" + this.container)
                        .classList.add("is-loaded");
                    this.map.fitBounds(geojsonExtent(this.clusterData), {
                        padding: this.map.getContainer().offsetHeight * 0.32,
                    });
                } else {
                    var bounds = new mapboxgl.LngLatBounds();
                    this.data.features.forEach((item) => {
                        this.addPhotoMarker(item);
                        bounds.extend(item.geometry.coordinates);
                    });
                    this.map.fitBounds(bounds, {
                        padding: this.map.getContainer().offsetHeight * 0.2,
                        // maxZoom: 6,
                        linear: true,
                    });
                }
            }
            document
                .querySelector("#" + this.container)
                .classList.add("is-loaded");
        });

        this.map.on("zoom", () => {
            if (this.hasCluster) {
                const e = Math.floor(this.map.getZoom());
                this.clusterData = {
                    type: "FeatureCollection",
                    features: this.cluster.getClusters([-180, -90, 180, 90], e),
                };
                this.updateMarkers();
            }
        });
    }

    updateMarkers() {
        this.markers.forEach((m) => m.remove());
        this.markers = [];
        for (const data of this.clusterData.features) {
            console.log(data);
            if (data.properties.cluster) this.addClusterMarker(data);
            else this.addPhotoMarker(data);
        }
    }

    createMarker() {
        return document.createElement("div");
    }

    addPhotoMarker(feature) {
        const markerElement = this.createMarker();
        markerElement.className = "marker";
        let html = "";
        if (feature.properties.image) {
            if (feature.properties.image)
                markerElement.style.setProperty(
                    "--photo",
                    `url("${feature.properties.image}"`
                );
            html = "<h3>" + feature.properties.title + "</h3>";
            if (feature.properties.posts.length > 0) {
                html += '<div class="marker--posts">';

                feature.properties.posts.forEach((item) => {
                    html +=
                        '<a target="_blank" href="' +
                        item.permalink +
                        '" class="marker--post">' +
                        item.title +
                        "</a>";
                });

                html += "</div>";
            } else {
                markerElement.classList.add("no-post");
                markerElement.className = "marker no-post purple no-hover";
                html += "<p>该地点暂无游记。</p>";
            }
        } else {
            markerElement.className = "marker no-hover";
        }

        this.addMarkerToMap(markerElement, feature.geometry.coordinates, html);
    }

    addClusterMarker(cluster) {
        const markerElement = this.createMarker();
        markerElement.className = "marker cluster";

        markerElement.addEventListener("click", (e) =>
            this.clusterDidClick(e, cluster)
        );
        markerElement.dataset.cardinality = Math.min(
            9,
            cluster.properties.point_count_abbreviated
        ).toString();
        this.addClusterToMap(markerElement, cluster.geometry.coordinates);
    }

    addClusterToMap(marker, coordinates) {
        const m = new mapboxgl.Marker(marker)
            .setLngLat(coordinates)
            .addTo(this.map);
        this.markers.push(m);
        return m;
    }

    addMarkerToMap(marker, coordinates, html) {
        const m = new mapboxgl.Marker(marker)
            .setLngLat(coordinates)
            .setPopup(
                new mapboxgl.Popup({ offset: 25 }) // add popups
                    .setHTML("" + html)
            )
            .addTo(this.map);
        this.markers.push(m);
        return m;
    }

    clusterDidClick(event, cluster) {
        let data = {
            type: "FeatureCollection",
            features: this.cluster.getLeaves(cluster.properties.cluster_id),
        };
        this.map.fitBounds(geojsonExtent(data), {
            padding: this.map.getContainer().offsetHeight * 0.32,
        });
    }
}

export default MAP;
