import { Topbar, ProjectBox, BlogPost, Achievement } from "./components.js";
import { titlebars } from "./titlebars.js";

// customElements.define("side-bar", Sidebar);
customElements.define("custom-bar", Topbar);
customElements.define("project-item", ProjectBox);
customElements.define("blog-item", BlogPost);
customElements.define("achievement-item", Achievement);
titlebars();

// let workspace = document.getElementsByClassName("workspace");
// if (workspace.length >= 1) {
//     workspace = workspace[0];
//     const sideinfo = document.createElement("div");
//     sideinfo.style.flexGrow = 1;
//     sideinfo.innerHTML = `
//         <article class="centered">
//             <img style="pointer-events: none;" src="/assets/fieshidle.gif" alt="profile picture" style="width: 100px; height: 100px;">
//             <h2>Hello I'm Failed!</h2>
//             <ul>
//                 <li>Discord: failed.sh</li>
//                 <li>Github: <a href="https://github.com/Failedex" draggable="false">FailedExperiment</a></li>
//             </ul>
//         </article>
//         <article class="centered">
//             <h2>Navigation</h2>
//             <div id="navwindow">
//                 <a href="/" class="button naventry current">
//                     <i class="material-symbols-outlined">home</i>
//                     <p>Home</p>
//                 </a>
//                 <a href="/blogs/index.html" class="button naventry">
//                     <i class="material-symbols-outlined">article</i>
//                     <p>Blogs</p>
//                 </a>
//                 <a href="/experiments/index.html" class="button naventry">
//                     <i class="material-symbols-outlined">experiment</i>
//                     <p>Experiments</p>
//                 </a>
//                 <a href="/blackjack/index.html" class="button naventry">
//                     <i class="material-symbols-outlined">playing_cards</i>
//                     <p>Blackjack</p>
//                 </a>
//             </div>
//         </article>
//         `;
//     workspace.appendChild(sideinfo);
// }
