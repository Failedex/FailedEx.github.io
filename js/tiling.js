import { makefloat } from "./floatingwindows.js";
import { createTitleBar } from "./titlebars.js";
import { tilemsg } from "./components.js";
import { addAchievement } from "../achievements/achievements.js";
import { gravify, gravity, ungravify } from "./gravity.js";

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
        let grav = false;
        if (gravity) {
            grav = true;
            ungravify();
        }
        if (this.master.children.length > 0) {
            const old = this.master.children[0];
            if (!this.slaves || this.slaves.children.length === 0) {
                const workspace = document.getElementsByClassName("workspace")[0];
                this.slaves = document.createElement("div");
                this.slaves.id = "slave-stack";
                workspace.appendChild(this.slaves);
            }
            this.slaves.insertBefore(old, this.slaves.firstChild);
            if (this.slaves.children.length === 15 && addAchievement("chaos")) {
                tilemsg("Achievement unlocked: Master of organised chaos", "The 37th window was necessary I swear", 6000);
            }
        }
        this.master.appendChild(div);
        if (grav) 
            gravify();
    }

    remove(div) {
        div.remove();
        if (this.master.children.length === 0) {
            if (!this.slaves || this.slaves.children.length === 0) {
                setTimeout(() => {
                    if (this.master.children.length === 0) {
                        // Woah no windows open
                        if (addAchievement("window_close")) {
                            tilemsg("Achievement unlocked: Soft Lock", "Are you stupid? why did close everything??? Reload the page if you want to get the windows back.", 6000);
                        }
                    }
                }, 2000);
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

export const spawnWindow = (path, title, float=false, mod= (cont) => cont) => {
    const win = document.createElement("article");
    win.className = "vcentered";

    fetch(path)
    .then(res => res.text())
    .then(cont => {
        win.innerHTML = mod(cont);
        win.setAttribute("label", title);
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
        if (path.includes("blogs") && path !== "../blogs/articles/1.html"){
            const scroller = win.getElementsByClassName("content")[0];
            scroller.addEventListener("scroll", event => {
                const {scrollHeight, scrollTop, clientHeight} = event.target;

                if (Math.abs(scrollHeight - clientHeight - scrollTop) < 1) {
                    setTimeout(() => {
                        if (addAchievement("blogread")) {
                            tilemsg("Achievement Unlocked: \"I Read the Whole Thing\"", "I can't believe you actually read a blog.", 6000);
                        }
                    }, 2000);
                }
            });
        }

    });
}
