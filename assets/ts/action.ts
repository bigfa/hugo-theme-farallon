import { farallonHelper } from "./utils";

interface farallonActionsOptions {
    singleSelector?: string;
    likeButtonSelctor?: string;
    articleSelector?: string;
    termSelector?: string;
    viewSelector?: string;
    imageSelector?: string;
    imageLikeCountSelector?: string;
    actionDomain: string;
    text?: string;
}

class farallonActions extends farallonHelper {
    singleSelector: string = ".fArticle";
    likeButtonSelctor: string = ".like-btn";
    articleSelector: string = ".fBlock--item";
    viewSelector: string = ".article--views";
    termSelector: string = ".fTerm--header";
    imageSelector: string = ".fFigure";
    imageLikeCountSelector: string = ".image--likes";
    actionDomain: string;
    text: string = "";
    likeButton: HTMLElement | null = null;
    post_id: string;
    is_single: boolean = false;
    is_term: boolean = false;

    constructor(config: farallonActionsOptions) {
        super();
        this.singleSelector = config.singleSelector ?? this.singleSelector;
        this.likeButtonSelctor =
            config.likeButtonSelctor ?? this.likeButtonSelctor;
        this.articleSelector = config.articleSelector ?? this.articleSelector;
        this.viewSelector = config.viewSelector ?? this.viewSelector;
        this.termSelector = config.termSelector ?? this.termSelector;
        this.imageSelector = config.imageSelector ?? this.imageSelector;
        this.imageLikeCountSelector =
            config.imageLikeCountSelector ?? this.imageLikeCountSelector;
        this.actionDomain = config.actionDomain;
        this.text = config.text ?? this.text;

        this.is_single = document.querySelector(this.singleSelector)
            ? true
            : false;

        this.is_term = document.querySelector(this.termSelector) ? true : false;

        if (this.is_single) {
            const postSingle = document.querySelector(
                this.singleSelector
            ) as HTMLElement;
            this.post_id = postSingle.dataset.id ?? "";
            this.initArticleLike();
            this.initArticleView();
            this.initImageLike();
        } else {
            this.initArticlesView();
        }

        if (this.is_term) {
            this.initTermView();
        }
    }

    initTermView() {
        const term = document.querySelector(this.termSelector) as HTMLElement;
        if (!term.dataset.id) return;
        fetch(this.actionDomain + "post/" + term.dataset.id + "/view", {
            method: "post",
        });
    }

    initArticleView() {
        fetch(this.actionDomain + "post/" + this.post_id + "/view", {
            method: "post",
        }).then((res) => {
            res.json().then((data) => {
                (
                    document.querySelector(this.viewSelector) as HTMLElement
                ).innerText = data.views + this.text;
            });
        });
    }

    initArticlesView() {
        const articles: HTMLElement[] = Array.from(
            document.querySelectorAll(this.articleSelector)
        );

        if (articles.length === 0) return;

        let ids: Array<String> = [];
        articles.forEach((article: HTMLElement) => {
            return ids.push(article.dataset.id!);
        });

        const idsString = ids.join(",");

        fetch(this.actionDomain + "post/views?post_ids=" + idsString).then(
            (res) => {
                res.json().then((data) => {
                    const result = data.results;
                    articles.forEach((article: HTMLElement) => {
                        if (!article.querySelector(this.viewSelector)) return;
                        (
                            article.querySelector(
                                this.viewSelector
                            ) as HTMLElement
                        ).innerText =
                            (result.find(
                                (item: any) =>
                                    item.post_id == article.dataset.id
                            )
                                ? result.find(
                                      (item: any) =>
                                          item.post_id == article.dataset.id
                                  ).views
                                : 0) + this.text;
                    });
                });
            }
        );
    }

    initImageLike() {
        const images: HTMLElement[] = Array.from(
            document.querySelectorAll(this.imageSelector)
        );

        if (images.length === 0) return;

        let ids: Array<String> = [];
        images.forEach((image: HTMLElement) => {
            return ids.push(image.dataset.id!);
        });

        const idsString = ids.join(",");

        fetch(this.actionDomain + "post/views?post_ids=" + idsString).then(
            (res) => {
                res.json().then((data) => {
                    const result = data.results;
                    images.forEach((image: HTMLElement) => {
                        if (!image.querySelector(this.imageLikeCountSelector))
                            return;
                        (
                            image.querySelector(
                                this.imageLikeCountSelector
                            ) as HTMLElement
                        ).innerHTML =
                            (result.find(
                                (item: any) => item.post_id == image.dataset.id
                            )
                                ? result.find(
                                      (item: any) =>
                                          item.post_id == image.dataset.id
                                  ).views
                                : 0) +
                            `<svg class="fFigure--icon" viewBox="0 0 1024 1024" width="12" height="12">
                    <path d="M780.8 204.8c-83.2-44.8-179.2-19.2-243.2 44.8L512 275.2 486.4 249.6c-64-64-166.4-83.2-243.2-44.8C108.8 275.2 89.6 441.6 185.6 537.6l32 32 153.6 153.6 102.4 102.4c25.6 25.6 57.6 25.6 83.2 0l102.4-102.4 153.6-153.6 32-32C934.4 441.6 915.2 275.2 780.8 204.8z">
                    </path>
                </svg>`;
                    });
                });
            }
        );

        images.forEach((image: HTMLElement) => {
            image.addEventListener("click", () => {
                this.handleImageLike(image);
            });
        });
    }

    handleImageLike(image: HTMLElement) {
        const imageId = image.dataset.id;
        if (!imageId) return;

        fetch(this.actionDomain + "post/" + imageId + "/view", {
            method: "post",
        }).then((res) => {
            res.json().then((data) => {
                this.showNotice("Thanks for your like");
                const countElement = image.querySelector(
                    this.imageLikeCountSelector
                ) as HTMLElement;
                if (countElement) {
                    countElement.innerHTML =
                        data.views +
                        `<svg class="fFigure--icon" viewBox="0 0 1024 1024" width="12" height="12">
                    <path d="M780.8 204.8c-83.2-44.8-179.2-19.2-243.2 44.8L512 275.2 486.4 249.6c-64-64-166.4-83.2-243.2-44.8C108.8 275.2 89.6 441.6 185.6 537.6l32 32 153.6 153.6 102.4 102.4c25.6 25.6 57.6 25.6 83.2 0l102.4-102.4 153.6-153.6 32-32C934.4 441.6 915.2 275.2 780.8 204.8z">
                    </path>
                </svg>`;
                }
                this.setCookie("like_" + imageId, "1", 1);
            });
        });
        image.classList.add("is-active");
    }

    initArticleLike() {
        this.likeButton = document.querySelector(this.likeButtonSelctor);
        if (this.likeButton) {
            fetch(this.actionDomain + "post/" + this.post_id + "/like").then(
                (res) => {
                    res.json().then((data) => {
                        (
                            this.likeButton!.querySelector(
                                ".count"
                            ) as HTMLElement
                        ).innerText = data.likes;
                    });
                }
            );

            this.likeButton.addEventListener("click", () => {
                this.handleLike();
            });
            if (this.getCookie("like_" + this.post_id)) {
                this.likeButton.classList.add("is-active");
            }
        }
    }

    handleLike() {
        if (this.getCookie("like_" + this.post_id)) {
            return this.showNotice("You have already liked this post");
        }
        if (this.likeButton) {
            const url = this.actionDomain + "post/" + this.post_id + "/like";
            fetch(url, {
                method: "post",
            })
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    this.showNotice("Thanks for your like");
                    const countElement = this.likeButton?.querySelector(
                        ".count"
                    ) as HTMLElement;
                    if (countElement) {
                        countElement.innerText = data.likes;
                    }
                    this.setCookie("like_" + this.post_id, "1", 1);
                });
            this.likeButton?.classList.add("is-active");
        }
    }
}

export default farallonActions;
