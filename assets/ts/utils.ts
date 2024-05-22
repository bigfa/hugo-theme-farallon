interface Helper {
    getCookie(key: string): string;
    setCookie(key: string, value: string, n: number): void;
    showNotice(message: string, type: any): void;
}

export abstract class farallonHelper implements Helper {
    getCookie(key: string) {
        if (0 < document.cookie.length) {
            var e = document.cookie.indexOf(key + "=");
            if (-1 != e) {
                e = e + key.length + 1;
                var n = document.cookie.indexOf(";", e);
                return (
                    -1 == n && (n = document.cookie.length),
                    document.cookie.substring(e, n)
                );
            }
        }
        return "";
    }

    setCookie(key: string, value: string, n: number) {
        var o = new Date();
        o.setTime(o.getTime() + 24 * n * 60 * 60 * 1e3);
        var i = "expires=" + o.toUTCString();
        document.cookie = key + "=" + value + ";" + i + ";path=/";
    }

    showNotice(message: string, type: any = "success") {
        const html = `<div class="notice--wrapper">${message}</div>`;

        document.querySelector("body")!.insertAdjacentHTML("beforeend", html);
        document.querySelector(".notice--wrapper")!.classList.add("is-active");
        setTimeout(() => {
            document.querySelector(".notice--wrapper")!.remove();
        }, 3000);
    }
}
