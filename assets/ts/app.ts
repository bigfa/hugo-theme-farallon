//@ts-nocheck
class farallonDate {
    selector: string;
    timeFormat: any = {
        second: "second ago",
        seconds: "seconds ago",
        minute: "minute ago",
        minutes: "minutes ago",
        hour: "hour ago",
        hours: "hours ago",
        day: "day ago",
        days: "days ago",
        week: "week ago",
        weeks: "weeks ago",
        month: "month ago",
        months: "months ago",
        year: "year ago",
        years: "years ago",
    };
    doms: Array<any> = [];
    VERSION: string = "0.3.1";
    constructor(config: any) {
        this.selector = config.selector;
        if (config.timeFormat) {
            this.timeFormat = config.timeFormat;
        }
        this.init();
        setTimeout(() => {
            this.refresh();
        }, 1000 * 5);

        const copyright = `<div class="site--footer__info">
        Theme <a href="https://fatesinger.com/101971" target="_blank">farallon</a> by bigfa / version ${this.VERSION}
    </div>`;

        document
            .querySelector(".site--footer__content")!
            .insertAdjacentHTML("afterend", copyright);

        document
            .querySelector(".icon--copryrights")!
            .addEventListener("click", () => {
                document
                    .querySelector(".site--footer__info")!
                    .classList.toggle("active");
            });
    }

    init() {
        this.doms = Array.from(document.querySelectorAll(this.selector));
        this.doms.forEach((dom: any) => {
            dom.innerText = this.humanize_time_ago(
                dom.attributes["datetime"].value
            );
        });
    }

    humanize_time_ago(datetime: string) {
        const time = new Date(datetime);
        const between: number =
            Date.now() / 1000 - Number(time.getTime() / 1000);
        if (between < 3600) {
            return `${Math.ceil(between / 60)} ${
                Math.ceil(between / 60) == 1
                    ? this.timeFormat.second
                    : this.timeFormat.seconds
            }`;
        } else if (between < 86400) {
            return `${Math.ceil(between / 3600)} ${
                Math.ceil(between / 3660) == 1
                    ? this.timeFormat.hour
                    : this.timeFormat.hours
            }`;
        } else if (between < 86400 * 30) {
            return `${Math.ceil(between / 86400)} ${
                Math.ceil(between / 86400) == 1
                    ? this.timeFormat.day
                    : this.timeFormat.days
            }`;
        } else if (between < 86400 * 30 * 12) {
            return `${Math.ceil(between / (86400 * 30))} ${
                Math.ceil(between / (86400 * 30)) == 1
                    ? this.timeFormat.month
                    : this.timeFormat.months
            }`;
        } else {
            return (
                time.getFullYear() +
                "-" +
                (time.getMonth() + 1) +
                "-" +
                time.getDate()
            );
        }
    }

    refresh() {
        this.doms.forEach((dom: any) => {
            dom.innerText = this.humanize_time_ago(
                dom.attributes["datetime"].value
            );
        });
    }
}

new farallonDate({
    selector: ".humane--time",
    //@ts-ignore
    timeFormat: window.timeFormat,
});

class farallonBase {
    is_single: boolean = false;
    post_id: number = 0;
    is_archive: boolean = false;
    VERSION: string = "0.2.3";
    constructor() {
        const theme = localStorage.getItem("theme")
            ? localStorage.getItem("theme")
            : "auto";
        const html = `<div class="fixed--theme">
        <span class="${
            theme == "dark" ? "is-active" : ""
        }" data-action-value="dark">
            <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round"
                stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"
                style="color: currentcolor; width: 16px; height: 16px;">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
            </svg>
        </span>
        <span class="${
            theme == "light" ? "is-active" : ""
        }" data-action-value="light">
            <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round"
                stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"
                style="color: currentcolor; width: 16px; height: 16px;">
                <circle cx="12" cy="12" r="5"></circle>
                <path d="M12 1v2"></path>
                <path d="M12 21v2"></path>
                <path d="M4.22 4.22l1.42 1.42"></path>
                <path d="M18.36 18.36l1.42 1.42"></path>
                <path d="M1 12h2"></path>
                <path d="M21 12h2"></path>
                <path d="M4.22 19.78l1.42-1.42"></path>
                <path d="M18.36 5.64l1.42-1.42"></path>
            </svg>
        </span>
        <span class="${
            theme == "auto" ? "is-active" : ""
        }"  data-action-value="auto">
            <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round"
                stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"
                style="color: currentcolor; width: 16px; height: 16px;">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M8 21h8"></path>
                <path d="M12 17v4"></path>
            </svg>
        </span>
    </div>`;

        document.querySelector("body")!.insertAdjacentHTML("beforeend", html);

        document.querySelectorAll(".fixed--theme span").forEach((item) => {
            item.addEventListener("click", () => {
                if (item.classList.contains("is-active")) return;
                document
                    .querySelectorAll(".fixed--theme span")
                    .forEach((item) => {
                        item.classList.remove("is-active");
                    });
                // @ts-ignore
                if (item.dataset.actionValue == "dark") {
                    localStorage.setItem("theme", "dark");
                    document.querySelector("body")!.classList.remove("auto");
                    document.querySelector("body")!.classList.add("dark");
                    item.classList.add("is-active");
                    //this.showNotice('夜间模式已开启');
                    // @ts-ignore
                } else if (item.dataset.actionValue == "light") {
                    localStorage.setItem("theme", "light");
                    document.querySelector("body")!.classList.remove("auto");
                    document.querySelector("body")!.classList.remove("dark");
                    item.classList.add("is-active");
                    //this.showNotice('夜间模式已关闭');
                    // @ts-ignore
                } else if (item.dataset.actionValue == "auto") {
                    localStorage.setItem("theme", "auto");
                    document.querySelector("body")!.classList.remove("dark");
                    document.querySelector("body")!.classList.add("auto");
                    item.classList.add("is-active");
                    //this.showNotice('夜间模式已关闭');
                }
            });
        });

        if (document.querySelector(".backToTop")) {
            const backToTop = document.querySelector(
                ".backToTop"
            ) as HTMLElement;
            window.addEventListener("scroll", () => {
                const t = window.scrollY || window.pageYOffset;
                // console.log(t);
                // const documentHeight = document.body.clientHeight;
                //const windowHeight = window.innerHeight;
                // const percent = Math.ceil((t / (documentHeight - windowHeight)) * 100);

                t > 200
                    ? backToTop!.classList.add("is-active")
                    : backToTop!.classList.remove("is-active");
            });

            backToTop.addEventListener("click", () => {
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
        }

        document
            .querySelector('[data-action="show-search"]')!
            .addEventListener("click", () => {
                document
                    .querySelector(".site--header__center .inner")!
                    .classList.toggle("search--active");
            });
    }

    getCookie(t: any) {
        if (0 < document.cookie.length) {
            var e = document.cookie.indexOf(t + "=");
            if (-1 != e) {
                e = e + t.length + 1;
                var n = document.cookie.indexOf(";", e);
                return (
                    -1 == n && (n = document.cookie.length),
                    document.cookie.substring(e, n)
                );
            }
        }
        return "";
    }

    setCookie(t: any, e: any, n: any) {
        var o = new Date();
        o.setTime(o.getTime() + 24 * n * 60 * 60 * 1e3);
        var i = "expires=" + o.toUTCString();
        document.cookie = t + "=" + e + ";" + i + ";path=/";
    }

    showNotice(message: any, type: any = "success") {
        const html = `<div class="notice--wrapper">${message}</div>`;

        document.querySelector("body")!.insertAdjacentHTML("beforeend", html);
        document.querySelector(".notice--wrapper")!.classList.add("is-active");
        setTimeout(() => {
            document.querySelector(".notice--wrapper")!.remove();
        }, 3000);
    }
}

new farallonBase();

class farallonComment {
    loading = false;
    post_id: any;
    constructor() {
        this.post_id = document.querySelector(
            ".post--ingle__comments"
        )!.dataset.id;
        this.fetchComments();
        this.init();
    }

    fetchComments() {
        fetch(
            window.commentDomain + "/post/" + this.post_id + "/comments"
        ).then((res) => {
            res.json().then((data) => {
                const comments = data.payload.comments;
                const html = comments
                    .map((item: any) => {
                        return `<li class="comment parent" itemtype="http://schema.org/Comment" data-id="${
                            item.id
                        }" itemscope="" itemprop="comment" id="comment-${
                            item.id
                        }">
                            <div class="comment-body">
                                <div class="comment-meta">
                                    <div class="comment--avatar">
                                        ${item.avatar}
                                    </div>
                                    <div class="comment--meta">
                                        <div class="comment--author" itemprop="author">${
                                            item.comment_author
                                        }<span class="dot"></span>
                                            <div class="comment--time humane--time" itemprop="datePublished" datetime="2023-09-22T08:24:25+00:00">${
                                                item.comment_time
                                            }</div>
                                            <span class="comment-reply-link u-cursorPointer " onclick="return addComment.moveForm('comment-${
                                                item.id
                                            }', '${item.id}', 'respond', '${
                            document.querySelector(".post--ingle__comments")!
                                .dataset.id
                        }')"><svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" class=""><g><path d="M12 3.786c-4.556 0-8.25 3.694-8.25 8.25s3.694 8.25 8.25 8.25c1.595 0 3.081-.451 4.341-1.233l1.054 1.7c-1.568.972-3.418 1.534-5.395 1.534-5.661 0-10.25-4.589-10.25-10.25S6.339 1.786 12 1.786s10.25 4.589 10.25 10.25c0 .901-.21 1.77-.452 2.477-.592 1.731-2.343 2.477-3.917 2.334-1.242-.113-2.307-.74-3.013-1.647-.961 1.253-2.45 2.011-4.092 1.78-2.581-.363-4.127-2.971-3.76-5.578.366-2.606 2.571-4.688 5.152-4.325 1.019.143 1.877.637 2.519 1.342l1.803.258-.507 3.549c-.187 1.31.761 2.509 2.079 2.629.915.083 1.627-.356 1.843-.99.2-.585.345-1.224.345-1.83 0-4.556-3.694-8.25-8.25-8.25zm-.111 5.274c-1.247-.175-2.645.854-2.893 2.623-.249 1.769.811 3.143 2.058 3.319 1.247.175 2.645-.854 2.893-2.623.249-1.769-.811-3.144-2.058-3.319z"></path></g></svg></span>                            </div>
                                    </div>
                                </div>
                                <div class="comment-content" itemprop="description">
                                    ${item.comment_text}
                                </div>
                            </div>
                </li>`;
                    })
                    .join("");
                document.querySelector(".commentlist ")!.innerHTML = html;
            });
        });
    }

    private init() {
        if (document.querySelector(".comment-form")) {
            document
                .querySelector(".comment-form")
                ?.addEventListener("submit", (e) => {
                    e.preventDefault();
                    if (this.loading) return;
                    const form = document.querySelector(
                        ".comment-form"
                    ) as HTMLFormElement;
                    // @ts-ignore
                    const formData = new FormData(form);
                    // @ts-ignore
                    const formDataObj: { [index: string]: any } = {};
                    formData.forEach(
                        (value, key: any) => (formDataObj[key] = value)
                    );
                    this.loading = true;
                    // @ts-ignore
                    fetch(
                        window.commentDomain +
                            "/post/" +
                            this.post_id +
                            "/comment",
                        {
                            method: "POST",
                            body: JSON.stringify(formDataObj),
                            headers: {
                                // @ts-ignore
                                // "X-WP-Nonce": obvInit.nonce,
                                "Content-Type": "application/json",
                            },
                        }
                    )
                        .then((response) => {
                            return response.json();
                        })
                        .then((data) => {
                            this.loading = false;
                            if (data.status != 200) {
                                return; //this.showNotice(data.message, "error");
                            }
                            let a = document.getElementById(
                                    "cancel-comment-reply-link"
                                ),
                                i = document.getElementById("respond"),
                                n = document.getElementById("wp-temp-form-div");
                            const comment = data.data;
                            const html = `<li class="comment" id="comment-${comment.comment_ID}">
                        <div class="comment-body comment-body__fresh">
                            <footer class="comment-meta">
                                <div class="comment--avatar">
                                    ${comment.avatar}
                                </div>
                                <div class="comment--meta">
                                    <div class="comment--author">${comment.comment_author}<span class="dot"></span>
                                    <time>刚刚</time>
                                    </div>
                                </div>
                            </footer>
                            <div class="comment-content">
                                ${comment.comment_text}
                            </div>
                        </div>
                    </li>`; // @ts-ignore
                            const parent_id =
                                document.querySelector(
                                    "#comment_parent"
                                )?.value;
                            // @ts-ignore
                            (a.style.display = "none"), // @ts-ignore
                                (a.onclick = null), // @ts-ignore
                                (document.getElementById(
                                    "comment_parent"
                                ).value = "0"),
                                n && // @ts-ignore
                                    i && // @ts-ignore
                                    (n.parentNode.insertBefore(i, n),
                                    n.parentNode.removeChild(n));
                            if (document.querySelector(".comment-body__fresh"))
                                document
                                    .querySelector(".comment-body__fresh")
                                    ?.classList.remove("comment-body__fresh");
                            // @ts-ignore
                            document.getElementById("comment").value = "";
                            // @ts-ignore
                            if (parent_id != "0") {
                                document
                                    .querySelector(
                                        // @ts-ignore
                                        "#comment-" + parent_id
                                    )
                                    ?.insertAdjacentHTML(
                                        "beforeend",
                                        '<ol class="children">' + html + "</ol>"
                                    );
                                console.log(parent_id);
                            } else {
                                if (document.querySelector(".no--comment")) {
                                    document
                                        .querySelector(".no--comment")
                                        ?.remove();
                                }
                                document
                                    .querySelector(".commentlist")
                                    ?.insertAdjacentHTML("beforeend", html);
                            }

                            const newComment = document.querySelector(
                                `#comment-${comment.comment_ID}`
                            ) as HTMLElement;

                            if (newComment) {
                                newComment.scrollIntoView({
                                    behavior: "smooth",
                                });
                            }

                            // this.showNotice("评论成功");
                        });
                });
        }
    }
}

new farallonComment();
