var zcount = 2;

function childSet (div, attribute, value) {
    div.childNodes.forEach(element => {
        if (element.style){
            element.style[attribute] = value;
        }
    });
}

export function makefloat (div, position) {

    div.style.position = "fixed";
    div.style.top = (position.top-10+window.scrollY).toString()+"px";
    div.style.left = (position.left-10+window.scrollX).toString()+"px";
    div.style.height = (position.height-4).toString()+"px";
    div.style.width = (position.width-4).toString()+"px";
    div.style.userSelect = "none";
    childSet(div.querySelector('.content'), "pointer-events", "none");
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

    const stopHold = () => {
        if (div.style.position !== "fixed") 
            return;

        held = false;
        rheld = false;
        div.setAttribute("held", "false");
    }

    div.addEventListener('mouseup', stopHold, true);
    div.addEventListener('mouseout', stopHold, true);

    div.addEventListener('mousemove', (e) => {
        if (div.style.position !== "fixed") 
            return;

        e.preventDefault();
        if (held) {
            div.style.left = (e.clientX + offset[0]-10+window.scrollX).toString()+'px';
            div.style.top = (e.clientY + offset[1]-10+window.scrollY).toString()+'px';
        } else if (rheld) {
            // includes the border for some reason
            div.style.width = (e.clientX + offset[0]-24+window.scrollX).toString()+'px';
            div.style.height = (e.clientY + offset[1]-24+window.scrollY).toString()+'px';
        }
    }, true);
}

export function unmakefloat (div) {
    div.style.position = "relative";
    div.style.zIndex = 1;
    div.style.top = "";
    div.style.left = "";
    div.style.height = "";
    div.style.width = "";
    div.style.userSelect = "";
    childSet(div.querySelector('.content'), "pointer-events", "");
    zcount = 1;
}

