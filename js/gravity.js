
const friction = 0.88;
const gravity = 3;

export function makefall (div, oldpos) {
    let pos = div.getBoundingClientRect();

    const velocity = [(pos.left-oldpos.left)*friction, (pos.top-oldpos.top)+gravity];

    if (div.getAttribute("held") === "true") 
        // can't really explain it but this works
        velocity[1] -= gravity;

    if (pos.left < window.scrollX && velocity[0] < 0) {
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
