// ==UserScript==
// @name         Bilibili 极简首页
// @namespace    ditto-bilibili-minimal
// @version      3.0.0
// @description  B站首页只保留一个搜索框
// @match        https://www.bilibili.com/*
// @run-at       document-start
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    'use strict';

    // 只处理 www.bilibili.com 的首页
    // 搜索页、视频页、收藏夹、UP主页均不受影响
    if (
        location.hostname !== 'www.bilibili.com' ||
        location.pathname !== '/'
    ) {
        return;
    }

    // 永久隐藏 B 站首页原有内容
    GM_addStyle(`
        html,
        body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
            overflow: hidden !important;
            background: #ffffff !important;
        }

        body > *:not(#ditto-bilibili-minimal) {
            display: none !important;
        }

        #ditto-bilibili-minimal {
            position: fixed !important;
            inset: 0 !important;

            z-index: 2147483647 !important;

            display: flex !important;
            align-items: center !important;
            justify-content: center !important;

            background: #ffffff !important;

            font-family:
                -apple-system,
                BlinkMacSystemFont,
                "Segoe UI",
                "Microsoft YaHei",
                sans-serif !important;
        }

        #ditto-bilibili-minimal form {
            width: min(620px, 80vw) !important;
            margin: 0 !important;
        }

        #ditto-bilibili-minimal input {
            width: 100% !important;
            height: 56px !important;

            padding: 0 24px !important;

            font-size: 17px !important;

            color: #222 !important;
            background: #ffffff !important;

            border: 1px solid #d8d8d8 !important;
            border-radius: 30px !important;

            outline: none !important;

            box-shadow: none !important;

            transition:
                border-color 0.15s ease,
                box-shadow 0.15s ease !important;
        }

        #ditto-bilibili-minimal input:hover {
            border-color: #aaaaaa !important;
        }

        #ditto-bilibili-minimal input:focus {
            border-color: #00aeec !important;
            box-shadow:
                0 0 0 4px rgba(0, 174, 236, 0.10) !important;
        }

        #ditto-bilibili-minimal input::placeholder {
            color: #999999 !important;
        }

        @media (prefers-color-scheme: dark) {

            html,
            body {
                background: #161616 !important;
            }

            #ditto-bilibili-minimal {
                background: #161616 !important;
            }

            #ditto-bilibili-minimal input {
                color: #eeeeee !important;
                background: #242424 !important;
                border-color: #444444 !important;
            }

            #ditto-bilibili-minimal input::placeholder {
                color: #777777 !important;
            }

            #ditto-bilibili-minimal input:focus {
                border-color: #00aeec !important;
            }
        }
    `);

    function mountMinimalPage() {

        // body 还没出现就继续等
        if (!document.body) {
            requestAnimationFrame(mountMinimalPage);
            return;
        }

        // 已经创建过就不重复创建
        if (document.getElementById('ditto-bilibili-minimal')) {
            return;
        }

        const root = document.createElement('div');

        root.id = 'ditto-bilibili-minimal';

        root.innerHTML = `
            <form
                action="https://search.bilibili.com/all"
                method="get"
            >
                <input
                    type="search"
                    name="keyword"
                    placeholder="搜索 Bilibili"
                    autocomplete="off"
                    autofocus
                >
            </form>
        `;

        document.body.appendChild(root);

        const input = root.querySelector('input');

        if (input) {
            setTimeout(() => input.focus(), 0);
        }

        document.title = 'Bilibili Search';
    }

    // 等页面 body 创建
    if (document.readyState === 'loading') {
        document.addEventListener(
            'DOMContentLoaded',
            mountMinimalPage,
            { once: true }
        );
    } else {
        mountMinimalPage();
    }

    // 防止 B站自己的前端框架把我们的页面删掉
    const observer = new MutationObserver(() => {
        if (
            document.body &&
            !document.getElementById('ditto-bilibili-minimal')
        ) {
            mountMinimalPage();
        }
    });

    observer.observe(document, {
        childList: true,
        subtree: true
    });

})();
