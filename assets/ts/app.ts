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
