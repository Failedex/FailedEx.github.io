import { makefall, gravify, ungravify, gravity } from "./gravity.js";
import { makefloat, unmakefloat } from "./floatingwindows.js";
import { spawnWindow } from "./tiling.js";
import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
import { existAchievement, addAchievement } from "../achievements/achievements.js";

export const tilemsg = (head, p, timeout=4000) => {
    let cont = document.getElementById("popupnotify");
    if (!cont) {
        cont = document.createElement("div");
        cont.id = "popupnotify";
        cont.style.zIndex = 999;
        document.body.appendChild(cont);
    }
    let msg = document.createElement("div");
    msg.scrollWidth;
    msg.className = "popup notifbox gone";
    msg.innerHTML = `
    <div style="display: flex; align-item: center;">
        <h3 style="flex-basis: 0; flex-grow: 1; margin: 5px;">${head}</h3>
        <i class="material-symbols-outlined">Close</i>
    </div>
    <p>${p}</p>
    `;
    cont.appendChild(msg);
    msg.className = "popup notifbox";
    const close = () => {
        msg.className = "popup notifbox gone";
        setTimeout(() => {
            msg.remove();
        }, 600);
    }
    const clsbtn = msg.getElementsByTagName("i")[0];
    clsbtn.onclick = close;
    setTimeout(close, timeout);
}

// idea from https://github.com/Stardust-kyun/stardust-kyun.github.io/blob/main/js/main.js
export class Topbar extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const wrap = document.createElement("div");
        wrap.className = "barwrap";
        const bar = document.createElement("nav");
        bar.className = "bar";
        bar.style.height = "50px";

        const menu = document.createElement("div"); 
        menu.className = "menushow";
        const top = document.createElement("div"); 
        top.className = "subbar";
        top.style.justifyContent = "flex-start";

        const bcorners = document.createElement("div"); 
        bcorners.className = "bcorners"

        const topbuttons = {
            "home": ["/index.html", "Home"],
            "article": ["/blogs/index.html", "Blogs"],
            "experiment": ["/experiments/index.html", "Experiments"],
            "playing_cards": ["/blackjack/index.html", "Blackjack"],
            "Trophy": ["/achievements/index.html", "Achievements"]
        }

        for (var key in topbuttons) {
            const newbutton = document.createElement("a");
            newbutton.className = "button largebutton";
            newbutton.href = topbuttons[key][0];
            newbutton.title = topbuttons[key][1];

            const intext = document.createElement("i");
            intext.className = "material-symbols-outlined";
            intext.innerText = key;

            const info = document.createElement("p");
            info.innerText = topbuttons[key][1];

            newbutton.appendChild(intext);
            newbutton.appendChild(info);
            top.appendChild(newbutton);

            const menubutton = newbutton.cloneNode(true);
            menubutton.className = "button";
            menu.appendChild(menubutton);

            info.className = "revealonhover"
            newbutton.onmouseover = () => {info.style.maxWidth = "200px";}
            newbutton.onmouseout = () => {info.style.maxWidth = "0px";}
        }
        
        const menutoggle = document.createElement("a");
        menutoggle.className = "button smallbutton";
        menutoggle.innerHTML = `<i class="material-symbols-outlined">Menu</i>`;
        let menuheight = 225;
        menu.out = false;
        menutoggle.onclick = () => {
            if (!menu.out) {
                menu.style.transform = "translateY(0) scaleY(1)";
                menu.style.height = menuheight.toString() + "px";
                bcorners.style.top = (menuheight + 60).toString() + "px";
                menu.out = true;
            } else {
                menu.style.transform = "translateY(-100%) scaleY(0)";
                bcorners.style.top = "50px";
                menu.style.height = "0px";
                menu.out = false;
            }
        }
        top.appendChild(menutoggle);

        const bottom = document.createElement("div"); 
        bottom.className = "subbar";
        bottom.style.justifyContent = "flex-end";

        const skull = document.createElement("button");
        skull.className = "button";
        skull.title = "This website boring ahh hell";
        skull.onclick = () => {
            if (addAchievement("brainrot")) {
                tilemsg("Achievement unlocked: Brainrot", "My attention span is way too low for this.", 6000);
            }
            let attentionspan = document.getElementById("popupclip");
            if (!attentionspan) {
                attentionspan = document.createElement("div");
                attentionspan.id = "popupclip";
                attentionspan.className = "popup gone centered";
                attentionspan.innerHTML = `
                <h4>This website boring ahh hell</h4>
                <video style="width: 90%;" autoplay loop muted>
                    <source src="/assets/funiattention.mp4" type="video/mp4">
                    Insert subway surfers clip here
                </video>
                `;
                document.body.appendChild(attentionspan);
                // trigger render
                attentionspan.scrollWidth;
            }

            if (attentionspan.classList.contains("gone")) {
                attentionspan.className = "popup centered";
            } else {
                attentionspan.className = "popup gone centered";
            }
        };

        const skulltext = document.createElement("i");
        skulltext.className = "material-symbols-outlined";
        skulltext.innerText = "skull";
        skull.appendChild(skulltext);

        const floatwin = document.createElement("button");
        // floatwin.className = "button largebutton";
        floatwin.className = "button";
        floatwin.title = "Tiling mode";

        const floattext = document.createElement("i");
        floattext.className = "material-symbols-outlined";
        floattext.innerText = "dock_to_left";
        floatwin.appendChild(floattext);

        let ffirst = true;
        let floating = false
        floatwin.onclick = () => {
            if (ffirst) {
                ffirst = false;
                spawnWindow("../windows/Floating Mode.html", "Floating Mode", true);
            }
            const positionmap = [];
            for (const div of document.getElementsByTagName("article")) {
                positionmap.push(div.getBoundingClientRect());
            }

            let id = 0;
            floating = !floating;
            if (floating) {
                document.body.setAttribute("oncontextmenu", "return false;");
                floattext.innerText = "select_window_2";
                fallwin.style.display = "block";
                tilemsg("Floating mode!", "Left mouse button to move tiles, right mouse button to resize.")
            } else {
                if (gravity) {
                    ungravify();
                }
                document.body.setAttribute("oncontextmenu", "");
                floattext.innerText = "dock_to_left";
                fallwin.style.display = "none";
                tilemsg("Tiled mode!", "Nothing out of the ordinary.")
            }
            for (const div of document.getElementsByTagName("article")) {
                if (floating)
                    makefloat(div, positionmap[id]);
                else
                    unmakefloat(div);
                id++;
            }
        };

        const newwin = document.createElement("button");
        newwin.className = "button";
        newwin.title = "Help?";
        newwin.innerHTML = `<i class="material-symbols-outlined">Help</i>`;
        newwin.onclick = () => {spawnWindow("../windows/Manual.html", "Manual", floating)};

        const fallwin = document.createElement("button");
        fallwin.className = "button";
        fallwin.style.display = "none";
        fallwin.title = "Gravity";

        const falltext = document.createElement("i");
        falltext.className = "material-symbols-outlined";
        falltext.innerText = "arrow_downward";
        fallwin.appendChild(falltext);

        fallwin.onclick = () => {
            if (addAchievement("gravity")) {
                tilemsg("Achievement unlocked: Gravity", "Don't think you slick, Newton found out about this already.", 6000)
            }
            if (gravity) {
                ungravify();
            } else {
                gravify();
            }
        };

        bottom.appendChild(newwin);
        bottom.appendChild(fallwin);
        bottom.appendChild(floatwin);
        setTimeout(() => {
            bottom.appendChild(skull);
        }, existAchievement("brainrot") ? 1 : 60000);

        bar.appendChild(top);
        bar.appendChild(bottom);
        wrap.appendChild(bar);
        wrap.appendChild(menu);
        wrap.appendChild(bcorners);
        this.appendChild(wrap);
    }
}

export class ProjectBox extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback () {
        if (this.childNodes.length > 0) {
            return;
        }
        const title = this.getAttribute("title");
        const link = this.getAttribute("link");
        const file = this.getAttribute("file");
        const filetype = this.getAttribute("filetype");
        const shortdesc = this.getAttribute("short");

        this.className = "box-item";

        const header = document.createElement("h3")
        if (link) {
            const linkelement = document.createElement("a");
            linkelement.href = link;
            linkelement.innerText = title;
            header.appendChild(linkelement);
        } else {
            header.innerText = title;
        }
        this.appendChild(header);

        
        if (filetype && filetype == "image") {
            const embed = document.createElement("img");
            embed.src = file;
            embed.style.width = "90%";
            this.appendChild(embed);
        } else {
            const embed = document.createElement("video");
            embed.style.width = "90%";
            embed.controls = true;
            const source = document.createElement("source");
            source.src = file;
            source.innerText = "Your browser does not support the video tag";
            embed.appendChild(source);
            this.appendChild(embed);
        }

        const footer = document.createElement("p");
        footer.innerText = shortdesc;
        
        this.appendChild(footer);
    }
}

export class BlogPost extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback () {
        if (this.childNodes.length > 0) {
            return;
        }
        const title = this.getAttribute("title");
        const path = this.getAttribute("path");
        const date = this.getAttribute("date");
        const desc = this.getAttribute("desc");
        const src = this.getAttribute("src");
        const mod = this.getAttribute("md");

        this.className = "box-item"
        this.innerHTML = `
        <div class="toppart">
            <img src="${src}" alt="${title}">
            <div>
                <p>${title}</p>
                <p class="date">${date}</p>
            </div>
        </div>
        <p>${desc}</p>
        `
        this.onclick = () => {spawnWindow(path, title, false, mod ? marked.parse : (cont) => cont)};
    }
}

export class Achievement extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback () {
        this.update();
        // this.addEventListener("refresh-achieve", (_) => {
        //     console.log("yooo");
        //     this.update();
        // })
    }

    update() {
        if (this.childNodes.length > 0) {
            return;
        }
        let title = this.getAttribute("ttile");
        let name = this.getAttribute("name");
        let desc = this.getAttribute("desc");
        let src = this.getAttribute("src");

        const achieved = existAchievement(name);

        if (!achieved) {
            title = title.replace(/[^ ]/g, '?');
            desc = desc.replace(/[^ ]/g, '?');
            name = name.replace(/[^ ]/g, '?');
            src = "./thumbnails/white-question-mark.svg";
        }

        this.className = "box-item"
        this.innerHTML = `
        <img src="${src}" alt="${title}">
        <div>
            <p>${title}</p>
            <p class="desc">${desc}</p>
        </div>
        `
    }
}
