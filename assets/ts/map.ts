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

const getMetersPerPixel = (lat, zoom) =>
    (40007000 * Math.cos((lat * Math.PI) / 180)) / (512 * Math.pow(2, zoom));

//mapboxgl.setRTLTextPlugin(obvInit.launguagePACK);
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
        this.zoom = config.zoom || 3;
        this.minZoom = 3;
        this.maxZoom = 24;
        this.cluster = null;
        this._create();
    }

    _create() {
        this.map = new mapboxgl.Map({
            container: this.container,
            style: "mapbox://styles/mapbox/light-v9",
            center: this.center,
            cluster: this.cluster,
            minZoom: this.minZoom,
            maxZoom: this.maxZoom,
            zoom: this.zoom,
        });

        // this.map.addControl(
        //     new MapboxGeocoder({
        //         accessToken: mapboxgl.accessToken,
        //         mapboxgl: mapboxgl,
        //     })
        // );

        this.map.addControl(
            new MapboxLanguage({
                defaultLanguage: "zh",
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
            // document.querySelector('#replay').addEventListener('click', (e) => {
            //     e.preventDefault();
            //     if (e.target.classList.contains('active')) {
            //         e.target.classList.remove('active');
            //     } else {
            //         e.target.classList.add('active');
            //     }
            //     this.drawing = !this.drawing;
            // });

            // document.querySelector('.map--tools--mark').addEventListener('click', (e) => {
            //     e.preventDefault();
            //     if (e.target.classList.contains('active')) {
            //         e.target.classList.remove('active');
            //     } else {
            //         e.target.classList.add('active');
            //     }
            //     this.marking = !this.marking;
            // });

            if (this.data) {
                if (this.hasCluster) {
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
                    // this.map.fitBounds(geojsonExtent(this.clusterData), {
                    //     padding: this.map.getContainer().offsetHeight * 0.32,
                    //     maxZoom: 6,
                    // });
                } else {
                    var bounds = new mapboxgl.LngLatBounds();
                    this.data.features.forEach((item) => {
                        this.addPhotoMarker(item);
                        bounds.extend(item.geometry.coordinates);
                    });
                    this.map.fitBounds(bounds, {
                        padding: this.map.getContainer().offsetHeight * 0.32,
                        maxZoom: 6,
                        linear: true,
                    });
                }
            }
        });

        //this.map.on('loaded', function (t) {}),
        this.map.on("zoom", () => {
            if (this.hasCluster) {
                const e = Math.floor(this.map.getZoom());
                // this.mapDidZoom();
                this.clusterData = {
                    type: "FeatureCollection",
                    features: this.cluster.getClusters([-180, -90, 180, 90], e),
                };
                this.updateMarkers();
            }
        });

        if (this.hasCluster) {
            this.cluster = new Supercluster({
                radius: 26,
                maxZoom: this.maxZoom,
            });
        }
    }

    updateMarkers() {
        this.markers.forEach((m) => m.remove());
        this.markers = [];
        for (const data of this.clusterData.features) {
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
        //markerElement.addEventListener("click", e => this.markerDidClick(e, feature))
        if (feature.properties) {
            if (feature.properties.image[0])
                markerElement.style.setProperty(
                    "--photo",
                    `url("${feature.properties.image[0]}!/both/64x64"`
                );
            html =
                "<h3>" +
                feature.properties.title +
                '</h3><div class="date ">2021</div>';
            if (feature.properties.permalink) {
                html += '<div class="marker--posts">';
                for (
                    var i = feature.properties.permalink.length - 1;
                    i >= 0;
                    i--
                ) {
                    html +=
                        '<div><a target="_blank" href="' +
                        feature.properties.permalink[i] +
                        '"><img src="' +
                        feature.properties.image[i] +
                        '!/both/328x268"><div>' +
                        feature.properties.description[i] +
                        "</div></a></div>";
                }
                html += "</div>";
            } else {
                markerElement.classList.add("no-post");
                markerElement.className = "marker no-post no-hover";
                // html += '<p>该地点暂无游记。</p>';
            }
        } else {
            markerElement.className = "marker no-hover";
        }
        this.addMarkerToMap(markerElement, feature.geometry.coordinates, html);
    }

    addClusterMarker(cluster) {
        // const features = this.cluster.getLeaves(cluster1.properties.cluster_id);
        const markerElement = this.createMarker();
        markerElement.className = "marker cluster";
        markerElement.addEventListener("click", (e) =>
            this.clusterDidClick(e, cluster)
        );
        markerElement.dataset.cardinality = Math.min(
            9,
            cluster.properties.point_count
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
            .addTo(this.map);
        if (html)
            m.setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML("" + html));
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

if (null != document.querySelector(".footer-map")) {
    const maps = document.querySelectorAll(".footer-map");
    var groupBy = function (xs, key) {
        return xs.reduce(function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    };

    maps.forEach((item) => {
        fetch("/index.json").then((t) => {
            return t.json().then((t) => {
                const data = groupBy(t.data, "Location");

                const result = [];
                for (const key in data) {
                    result.push({
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates: [
                                data[key][0].longitude,
                                data[key][0].latitude,
                            ],
                        },
                        properties: {
                            title: key,
                            description: data[key].map((item) => {
                                return item.Title;
                            }),
                            permalink: data[key].map((item) => {
                                return item.RelPermalink;
                            }),
                            image: data[key].map((item) => {
                                return item.image;
                            }),
                        },
                    });
                }

                new MAP({
                    data: {
                        type: "FeatureCollection",
                        features: result,
                    },
                    container: item.id,
                    hasCluster: true,
                });
                // item.addEventListener('mousemove', (e) => {
                //     const t = item.getBoundingClientRect();
                //     item.querySelector('.markder').style.setProperty('--x', px(e.clientX - t.left));
                //     item.querySelector('.markder').style.setProperty('--y', px(e.clientY - t.top));
                //     console.log('222');
                // });
            });
        });
    });
}

// cow.on('click', '.meta--map', (e) => {
//     e.target.classList.add('active');
//     const coordinates = [e.target.dataset.longitude, e.target.dataset.latitude];
//     new MAP({
//         data: {
//             features: [
//                 {
//                     type: 'Feature',
//                     geometry: { type: 'Point', coordinates },
//                     properties: {
//                         image: 'https://static.fatesinger.com/2018/05/q3wyes7va2ehq59y.JPG!/both/64x64',
//                         nopost: true,
//                         title: '焦作',
//                         type: 'visitedWithoutPost',
//                     },
//                 },
//             ],
//         },
//         container: 'mapPop',
//         center: coordinates,
//         zoom: 6,
//         hasCluster: false,
//     });
// });
