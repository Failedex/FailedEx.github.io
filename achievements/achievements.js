
export function getAchievements() {
    const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith("achievements="));
    let achievements;
    if (!cookieValue) {
        achievements = [];
    } else {
        achievements = cookieValue.split("=")[1].split(",");
    }
    return achievements;
}
// const achieved = new CustomEvent("refresh-achieve", {
//   detail: {
//     favourite_anim: "cat",
//   },
// });

export function addAchievement(achievement) {
    let achievements = getAchievements();
    if (achievements.includes(achievement)) 
        return false;
    achievements.push(achievement);
    document.cookie = `achievements=${achievements.join(',')}; path=/`;
    // const cont = document.getElementById("achievements");
    // if (cont) {
    //     for (const child of cont.children) {
    //         child.dispatchEvent(achieved);
    //     }
    // }

    return true;
}

export function existAchievement(achievement) {
    let achievements = getAchievements();
    return achievements.includes(achievement);
}
