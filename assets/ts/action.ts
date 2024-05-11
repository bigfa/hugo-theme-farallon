import { farallonHelper } from "./utils";
class farallonActions extends farallonHelper {
    is_single: boolean = false;
    post_id: string;
    like_btn: any;
    selctor: string = ".like-btn";
    // @ts-ignore
    actionDomain: string = window.actionDomain;
    articleSelector: string = ".post--item";
    viewSelector: string = ".article--views";
    constructor() {
        super();
        this.is_single = document.querySelector(".post--single") ? true : false;

        if (this.is_single) {
            const postSingle = document.querySelector(
                ".post--single"
            ) as HTMLElement;
            this.post_id = postSingle.dataset.id ?? "";
            this.initArticleLike();
            this.initArticleView();
        } else {
            this.initArticlesView();
        }
    }

    initArticleView() {
        fetch(this.actionDomain + "post/" + this.post_id + "/view", {
            method: "post",
        }).then((res) => {
            res.json().then((data) => {
                (
                    document.querySelector(this.viewSelector) as HTMLElement
                ).innerText = data.views;
            });
        });
    }

    initArticlesView() {
        const articles: HTMLElement[] = Array.from(
            document.querySelectorAll(this.articleSelector)
        );
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
                        (
                            article.querySelector(
                                this.viewSelector
                            ) as HTMLElement
                        ).innerText = result.find(
                            (item: any) => item.post_id == article.dataset.id
                        )
                            ? result.find(
                                  (item: any) =>
                                      item.post_id == article.dataset.id
                              ).views
                            : 0;
                    });
                });
            }
        );
    }

    initArticleLike() {
        this.like_btn = document.querySelector(this.selctor);
        if (!this.like_btn) return;
        fetch(this.actionDomain + "post/" + this.post_id + "/like").then(
            (res) => {
                res.json().then((data) => {
                    this.like_btn.querySelector(".count").innerText =
                        data.likes;
                });
            }
        );
        if (this.like_btn) {
            this.like_btn.addEventListener("click", () => {
                this.handleLike();
            });
            if (this.getCookie("like_" + this.post_id)) {
                this.like_btn.classList.add("is-active");
            }
        }
    }

    handleLike() {
        // @ts-ignore
        if (this.getCookie("like_" + this.post_id)) {
            return this.showNotice("You have already liked this post");
        }
        // @ts-ignore
        const url = this.actionDomain + "post/" + this.post_id + "/like";
        fetch(url, {
            method: "post",
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                this.showNotice("Thanks for your like");
                this.like_btn.querySelector(".count").innerText = data.likes;
                // @ts-ignore
                this.setCookie("like_" + this.post_id, "1", 1);
            });
        this.like_btn.classList.add("is-active");
    }
}

export default farallonActions;
