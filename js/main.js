// idea from https://github.com/Stardust-kyun/stardust-kyun.github.io/blob/main/js/main.js
class Sidebar extends HTMLElement {
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
            "home": "/index.html",
            "article": "/blogs/index.html",
            "experiment": "/experiments/index.html"
        }

        for (var key in topbuttons) {
            const newbutton = document.createElement("a");
            newbutton.className = "button";
            newbutton.href = topbuttons[key];

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
        skull.onclick = () => {
            let attentionspan = document.getElementById("popup");
            if (!attentionspan) {
                attentionspan = document.createElement("div");
                attentionspan.id = "popup";
                attentionspan.className = "popup gone centered";
                attentionspan.innerHTML = `
                <h4>This website boring ahh hell</h4>
                <video style="width: 90%;" autoplay loop muted>
                    <source src="/assets/funiattention.mp4" type="video/mp4">
                    Insert subway surfers clip here
                </video>
                `;
                document.body.appendChild(attentionspan);
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

        const floattext = document.createElement("i");
        floattext.className = "material-symbols-outlined";
        floattext.innerText = "dock_to_left";
        floatwin.appendChild(floattext);

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
                } else {
                    document.body.setAttribute("oncontextmenu", "");
                    floattext.innerText = "dock_to_left";
                    unmakefloat(div);
                    fallwin.style.display = "none";
                }
                id++;
            }
        };

        const fallwin = document.createElement("button");
        fallwin.className = "button";
        fallwin.style.display = "none";

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

customElements.define("side-bar", Sidebar)

class ProjectBox extends HTMLElement {
    constructor() {
        super();
    }


    connectedCallback () {
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

customElements.define("project-item", ProjectBox);

var zcount = 1;

function makefloat (div, position) {

    div.style.position = "fixed";
    div.style.top = (position.top-10+window.scrollY).toString()+"px";
    div.style.left = (position.left-10+window.scrollX).toString()+"px";
    div.style.height = (position.height-24).toString()+"px";
    div.style.width = (position.width-24).toString()+"px";
    div.style.userSelect = "none";
    div.style.zIndex = 1;

    if (div.getAttribute('listener') === 'true') 
        return;

    div.setAttribute('listener', 'true');

    let offset = [div.offsetLeft, div.offsetTop];;
    let held = false;
    let rheld = false;

    div.addEventListener('mousedown', (e) => {
        if (div.style.position !== "fixed") 
            return;

        if (e.button === 0) {
            held = true;
            div.setAttribute("held", "true");
            offset = [
                div.offsetLeft - e.clientX, 
                div.offsetTop - e.clientY, 
            ];
        } else if (e.button === 2) {
            rheld = true;
            div.setAttribute("held", "true");
            offset = [
                div.offsetWidth - e.clientX, 
                div.offsetHeight - e.clientY, 
            ];
        }

        div.style.zIndex = zcount;
        zcount++;
    }, true);

    div.addEventListener('mouseup', () => {
        if (div.style.position !== "fixed") 
            return;

        held = false;
        rheld = false;
        div.setAttribute("held", "false");
    }, true);

    div.addEventListener('mousemove', (e) => {
        if (div.style.position !== "fixed") 
            return;

        e.preventDefault();
        if (held) {
            div.style.left = (e.clientX + offset[0]).toString()+'px';
            div.style.top = (e.clientY + offset[1]).toString()+'px';
        } else if (rheld) {
            div.style.width = (e.clientX + offset[0]).toString()+'px';
            div.style.height = (e.clientY + offset[1]).toString()+'px';
        }
    }, true);
}

function unmakefloat (div) {
    div.style.position = "relative";
    div.style.zIndex = 1;
    div.style.top = "";
    div.style.left = "";
    div.style.height = "";
    div.style.width = "";
    div.style.userSelect = "";
    zcount = 1;

}

const friction = 0.88;
const gravity = 3;

function makefall (div, oldpos) {
    let pos = div.getBoundingClientRect();

    const velocity = [(pos.left-oldpos.left)*friction, (pos.top-oldpos.top)+gravity];

    if (div.getAttribute("held") === "true") 
        // can't really explain it but this works
        velocity[1] -= gravity;

    if (pos.left < window.scrollX+50 && velocity[0] < 0) {
        div.style.left = (window.scrollX).toString()+"px";
        velocity[0] *= -1;
    }

    if (pos.left + pos.width > window.innerWidth+window.scrollX && velocity[0] > 0) {
        div.style.left = (window.innerWidth+window.scrollX-pos.width).toString()+"px";
        velocity[0] *= -1;
    }

    if (pos.top+pos.height > window.innerHeight && velocity[1] > 0) {
        if (Math.abs(velocity[1]-gravity) > 5) {
            div.style.top = (window.innerHeight+window.scrollY-pos.height).toString()+"px";
            velocity[1] *= 0.5;
            velocity[1] *= -1;
        } else {
            velocity[1] = 0;
        }
    }

    if (Math.max(Math.abs(velocity[0]), Math.abs(velocity[1])) > 1) {
        div.style.top = (pos.top+window.scrollY+velocity[1]-10).toString()+"px";
        div.style.left = (pos.left+window.scrollX+velocity[0]-10).toString()+"px";
    }
    return pos;
}
