import { makefloat } from "./floatingwindows.js";
import { createTitleBar } from "./titlebars.js";

class Dwm {
    constructor() {
        // Master slave layout for dwm. This is what they call it I swear.
        this.master = document.getElementById("master-stack");
        if (!this.master) {
            const workspace = document.getElementsByClassName("workspace")[0];
            this.master = workspace.children[0];
            this.master.id = "master-stack";
        }
        this.slaves = document.getElementById("slave-stack");
    }

    add(div) {
        if (this.master.children.length > 0) {
            const old = this.master.children[0];
            if (!this.slaves || this.slaves.children.length === 0) {
                const workspace = document.getElementsByClassName("workspace")[0];
                this.slaves = document.createElement("div");
                this.slaves.id = "slave-stack";
                workspace.appendChild(this.slaves);
            }
            this.slaves.insertBefore(old, this.slaves.firstChild);
        }
        this.master.appendChild(div);
    }

    remove(div) {
        div.remove();
        if (this.master.children.length === 0) {
            if (!this.slaves || this.slaves.children.length === 0) {
                return
            }
            const old = this.slaves.children[0];
            this.master.appendChild(old);
        }

        if (this.slaves.children.length === 0) {
            this.slaves.remove();
            this.slaves = null;
        }
    }

    promote(div) {
        const old = this.master.children[0];
        if (div === old)
            return;
        this.slaves.insertBefore(old, this.slaves.firstChild);
        this.master.appendChild(div);
    }
}

export const dwm = new Dwm();

export const blankWindow = () => {
    const win = document.createElement("article");
    win.className = "vcentered";
    win.innerHTML = "Hello!!!";
    win.setAttribute("label", "new window!!");
    createTitleBar(win);
    dwm.add(win);
};

export const spawnWindow = (name, float=false, title=null) => {
    const win = document.createElement("article");
    win.className = "vcentered";
    fetch(`../windows/${name}.html`)
    .then(res => res.text())
    .then(cont => {
        win.innerHTML = cont
        win.setAttribute("label", title ? title : name);
        createTitleBar(win);
        dwm.add(win);
        if (float) {
            makefloat(win, win.getBoundingClientRect());
            win.style.left = (window.innerWidth / 2 - 600/2).toString()+"px";
            win.style.top = (window.innerHeight / 2 - 400/2).toString()+"px";
            win.style.width = "600px";
            win.style.height = "400px";
            win.style.zIndex = 2;
        }
    });
}
