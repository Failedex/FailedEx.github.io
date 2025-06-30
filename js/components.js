import { makefall } from "./gravity.js";
import { makefloat, unmakefloat } from "./floatingwindows.js";

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
        }
        
        const menutoggle = document.createElement("a");
        menutoggle.className = "button smallbutton";
        menutoggle.innerHTML = `<i class="material-symbols-outlined">Menu</i>`;
        let menuheight = 195;
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
        floatwin.className = "button largebutton";
        floatwin.title = "Tiling mode";

        const floattext = document.createElement("i");
        floattext.className = "material-symbols-outlined";
        floattext.innerText = "dock_to_left";
        floatwin.appendChild(floattext);

        let count = 0;

        const tilemsg = (head, p) => {
            let msg = document.getElementById("popupnotify");
            if (!msg) {
                msg = document.createElement("div");
                msg.id = "popupnotify";
                msg.className = "popup notif gone centered";
                msg.style.zIndex = 5;
                document.body.appendChild(msg)
                // trigger render
                msg.scrollWidth;
            }
            count++;
            msg.innerHTML = `
            <h4>${head}</h4>
            <p>${p}</p>
            `;
            msg.className = "popup notif centered";
            setTimeout(() => {
                count--;
                if (count <= 0) {
                    msg.className = "popup notif gone centered";
                }
            }, 4000);
        }

        floatwin.onclick = () => {
            const positionmap = [];
            for (const div of document.getElementsByTagName("article")) {
                positionmap.push(div.getBoundingClientRect());
            }

            let id = 0;
            for (const div of document.getElementsByTagName("article")) {
                if (div.style.position !== "fixed") {
                    document.body.setAttribute("oncontextmenu", "return false;");
                    floattext.innerText = "select_window_2";
                    makefloat(div, positionmap[id]);
                    fallwin.style.display = "block";
                    tilemsg("Floating mode!", "Left mouse button to move tiles, right mouse button to resize.")

                } else {
                    document.body.setAttribute("oncontextmenu", "");
                    floattext.innerText = "dock_to_left";
                    unmakefloat(div);
                    fallwin.style.display = "none";
                    tilemsg("Tiled mode!", "Nothing out of the ordinary.")
                }
                id++;
            }
        };

        const fallwin = document.createElement("button");
        fallwin.className = "button";
        fallwin.style.display = "none";
        fallwin.title = "Gravity";

        const falltext = document.createElement("i");
        falltext.className = "material-symbols-outlined";
        falltext.innerText = "arrow_downward";
        fallwin.appendChild(falltext);

        let gravity;
        fallwin.onclick = () => {
            if (gravity) {
                clearInterval(gravity);
                gravity = null;
            } else {
                const positionmap = [];

                for (const div of document.getElementsByTagName("article")) {
                    positionmap.push(div.getBoundingClientRect());
                }

                gravity = setInterval(() => {
                    let id = 0
                    for (const div of document.getElementsByTagName("article")) {
                        if (div.style.position !== "fixed") {
                            clearInterval(gravity);
                            gravity = null;
                            return;
                        }
                        positionmap[id] = makefall(div, positionmap[id]);
                        id++;
                    }
                }, 1000/60)
            }
        };

        bottom.appendChild(fallwin);
        bottom.appendChild(floatwin);
        bottom.appendChild(skull);

        bar.appendChild(top);
        bar.appendChild(bottom);
        wrap.appendChild(bar);
        wrap.appendChild(menu);
        wrap.appendChild(bcorners);
        this.appendChild(wrap);
    }
}

export class Sidebar extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const bar = document.createElement("nav");
        bar.className = "bar"
        bar.style.width = "50px";

        const top = document.createElement("div"); 
        top.className = "subbar";
        top.style.justifyContent = "flex-start";

        const topbuttons = {
            "home": ["/index.html", "Home"],
            "article": ["/blogs/index.html", "Blogs"],
            "experiment": ["/experiments/index.html", "Experiments"],
            "playing_cards": ["/blackjack/index.html", "Blackjack"],
        }

        for (var key in topbuttons) {
            const newbutton = document.createElement("a");
            newbutton.className = "button";
            newbutton.href = topbuttons[key][0];
            newbutton.title = topbuttons[key][1];

            const intext = document.createElement("i")
            intext.className = "material-symbols-outlined";
            intext.innerText = key;

            newbutton.appendChild(intext);
            top.appendChild(newbutton);
        }

        const bottom = document.createElement("div"); 
        bottom.className = "subbar";
        bottom.style.justifyContent = "flex-end";

        const skull = document.createElement("button");
        skull.className = "button";
        skull.title = "This website boring ahh hell";
        skull.onclick = () => {
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
        floatwin.className = "button";
        floatwin.title = "Tiling mode";

        const floattext = document.createElement("i");
        floattext.className = "material-symbols-outlined";
        floattext.innerText = "dock_to_left";
        floatwin.appendChild(floattext);

        let count = 0;

        const tilemsg = (head, p) => {
            let msg = document.getElementById("popupnotify");
            if (!msg) {
                msg = document.createElement("div");
                msg.id = "popupnotify";
                msg.className = "popup notif gone centered";
                msg.style.zIndex = 5;
                document.body.appendChild(msg)
                // trigger render
                msg.scrollWidth;
            }
            count++;
            msg.innerHTML = `
            <h4>${head}</h4>
            <p>${p}</p>
            `;
            msg.className = "popup notif centered";
            setTimeout(() => {
                count--;
                if (count <= 0) {
                    msg.className = "popup notif gone centered";
                }
            }, 4000);
        }

        floatwin.onclick = () => {
            const positionmap = [];
            for (const div of document.getElementsByTagName("article")) {
                positionmap.push(div.getBoundingClientRect());
            }

            let id = 0;
            for (const div of document.getElementsByTagName("article")) {
                if (div.style.position !== "fixed") {
                    document.body.setAttribute("oncontextmenu", "return false;");
                    floattext.innerText = "select_window_2";
                    makefloat(div, positionmap[id]);
                    fallwin.style.display = "block";
                    tilemsg("Floating mode!", "Left mouse button to move tiles, right mouse button to resize.")

                } else {
                    document.body.setAttribute("oncontextmenu", "");
                    floattext.innerText = "dock_to_left";
                    unmakefloat(div);
                    fallwin.style.display = "none";
                    tilemsg("Tiled mode!", "Nothing out of the ordinary.")
                }
                id++;
            }
        };

        const fallwin = document.createElement("button");
        fallwin.className = "button";
        fallwin.style.display = "none";
        fallwin.title = "Gravity";

        const falltext = document.createElement("i");
        falltext.className = "material-symbols-outlined";
        falltext.innerText = "arrow_downward";
        fallwin.appendChild(falltext);

        let gravity;
        fallwin.onclick = () => {
            if (gravity) {
                clearInterval(gravity);
                gravity = null;
            } else {
                const positionmap = [];

                for (const div of document.getElementsByTagName("article")) {
                    positionmap.push(div.getBoundingClientRect());
                }

                gravity = setInterval(() => {
                    let id = 0
                    for (const div of document.getElementsByTagName("article")) {
                        if (div.style.position !== "fixed") {
                            clearInterval(gravity);
                            gravity = null;
                            return;
                        }
                        positionmap[id] = makefall(div, positionmap[id]);
                        id++;
                    }
                }, 1000/60)
            }
        };

        bottom.appendChild(fallwin);
        bottom.appendChild(floatwin);
        bottom.appendChild(skull);

        bar.appendChild(top);
        bar.appendChild(bottom);
        this.appendChild(bar)
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
