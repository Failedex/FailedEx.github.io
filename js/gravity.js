import { addAchievement, existAchievement } from "../achievements/achievements.js";
import { tilemsg } from "./components.js";
import { dwm } from "./tiling.js";

const friction = 0.88;
const force = 3;

export function makefall (div, oldpos) {
    let pos = div.getBoundingClientRect();

    const velocity = [(pos.left-oldpos.left)*friction, (pos.top-oldpos.top)+force];

    if (div.getAttribute("held") === "true") 
        // can't really explain it but this works
        velocity[1] -= force;

    if (pos.left < window.scrollX && velocity[0] < 0) {
        div.style.left = (window.scrollX).toString()+"px";
        velocity[0] *= -1;
    }

    if (pos.left + pos.width > window.innerWidth+window.scrollX && velocity[0] > 0) {
        div.style.left = (window.innerWidth+window.scrollX-pos.width).toString()+"px";
        velocity[0] *= -1;
    }

    if (pos.top+pos.height > window.innerHeight && velocity[1] > 0) {
        if (Math.abs(velocity[1]-force) > 5) {
            div.style.top = (window.innerHeight+window.scrollY-pos.height).toString()+"px";
            velocity[1] *= 0.5;
            velocity[1] *= -1;
        } else {
            velocity[1] = 0;
        }
    }

    if (pos.top < -1500) {
        freeze.push(div);
        if (addAchievement("flyhigh")) {
            tilemsg("Achievement unlocked: Ascended Beyond Tiling", "That window is God's problem now.");
        }
    }

    if (Math.max(Math.abs(velocity[0]), Math.abs(velocity[1])) > 1 && gravity) {
        div.style.top = (pos.top+window.scrollY+velocity[1]-10).toString()+"px";
        div.style.left = (pos.left+window.scrollX+velocity[0]-10).toString()+"px";
    }
    return pos;
}

export let gravity = null;
let freeze = [];

export const ungravify = () => {
    if (gravity)
        clearInterval(gravity);
    gravity = null;
    for (let div of freeze) {
        dwm.remove(div);
    }
}

export const gravify = () => {
    const positionmap = new Map();

    let id = 0;
    for (const div of document.getElementsByTagName("article")) {
        div.pid = id;
        positionmap[id] = div.getBoundingClientRect();
        id++;
    }

    gravity = setInterval(() => {
        for (const div of document.getElementsByTagName("article")) {
            if (freeze.includes(div)) 
                continue;
            if (div.style.position !== "fixed") {
                clearInterval(gravity);
                gravity = null;
                return;
            }
            let pos = makefall(div, positionmap[div.pid]);
            positionmap[div.pid] = pos;
        }
    }, 1000/60)
}
