
export function titlebars () {
    let count = document.getElementsByTagName("article").length;
    const bar = document.getElementsByClassName("barwrap")[0];
    for (const div of document.getElementsByTagName("article")) {
        const titlebar = document.createElement("div");
        const content = document.createElement("div");
        const title = div.getAttribute("label");
        while (div.childNodes.length > 0) {
            content.appendChild(div.childNodes[0]);
        }

        div.fullscreened = false;

        const actions = {
            "#82cfff": () => {
                console.log(div.style.userSelect);
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
            },
            "#ff7eb6": () => {
                const par = div.parentNode;
                div.remove();
                if (par.children.length == 0 && par.className != "workspace") {
                    par.remove();
                }
                if (div.fullscreened) {
                    bar.style.zIndex = 999;
                }
                count--;
                if (count == 0) {
                    setTimeout(() => {
                        alert("Are you stupid ??? Why did you close all the windows??? 😭😭😭");
                        location.reload();
                    }, 2000);
                }
            }
        }

        const left = document.createElement("div");
        const mid = document.createElement("div");
        const right = document.createElement("div");
        left.className = "sub";
        if (title) {
            left.innerHTML = title;
        }
        right.className = "sub";

        for (const key in actions) {
            const button = document.createElement("a");
            button.className = "actionbutton";
            button.style.backgroundColor = key;
            button.onclick = actions[key];
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
}
