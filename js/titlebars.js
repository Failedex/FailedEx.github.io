import { dwm } from "./tiling.js";

export function createTitleBar (div) {
    const bar = document.getElementsByClassName("barwrap")[0];
    const titlebar = document.createElement("div");
    const content = document.createElement("div");
    const title = div.getAttribute("label");
    while (div.childNodes.length > 0) {
        content.appendChild(div.childNodes[0]);
    }

    div.fullscreened = false;

    const actions = {
        "#42be65": ["Promote", () => {
            dwm.promote(div);
        }],
        "#82cfff": ["Fullscreen", () => {
            if (div.style.userSelect === "none") 
                return;
            if (!div.fullscreened) {
                div.style.position = "fixed";
                div.style.margin = "0px";
                div.style.top = 0;
                div.style.left = 0;
                div.style.bottom = 0;
                div.style.right = 0;
                bar.style.zIndex = 0;
                div.style.zIndex = 2;
                div.fullscreened = true;
            } else {
                div.style.position = "relative";
                div.style.zIndex = 1;
                div.style.top = "";
                div.style.left = "";
                div.style.bottom = "";
                div.style.right = "";
                div.style.margin = "10px";
                bar.style.zIndex = 999;
                div.fullscreened = false;
            }
        }],
        "#ff7eb6": ["Close", () => {
            dwm.remove(div);
            if (div.fullscreened) {
                bar.style.zIndex = 999;
            }
        }]
    }

    const left = document.createElement("div");
    const mid = document.createElement("div");
    const right = document.createElement("div");
    left.className = "sub";
    if (title) {
        left.innerHTML = title;
    }
    right.className = "sub";
    right.style.overflow = "unset";

    for (const key in actions) {
        const button = document.createElement("a");
        button.className = "actionbutton";
        button.style.backgroundColor = key;
        button.onclick = actions[key][1];
        button.title = actions[key][0];
        right.appendChild(button);
    }

    titlebar.appendChild(left);
    titlebar.appendChild(mid);
    titlebar.appendChild(right);

    titlebar.className = "titlebar";
    content.className = "content " + div.className;
    div.insertBefore(titlebar, div.firstChild);
    div.appendChild(titlebar);
    div.appendChild(content);
}

export function titlebars () {
    for (const div of document.getElementsByTagName("article")) {
        createTitleBar(div);
    }
}
