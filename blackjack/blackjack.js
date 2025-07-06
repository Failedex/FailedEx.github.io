import { addAchievement } from "../achievements/achievements.js";
import { tilemsg } from "../js/components.js";

const suits = ["spade", "heart", "club", "diamond"];
const numbers = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
let gambling = 0;

class BlackJack {
    constructor (hitButton, standButton, dealBoard, playBoard) {
        this.dealer = [];
        this.player = [];

        this.hitButton = hitButton;
        this.standButton = standButton;
        this.hitButton.disabled = false;
        this.standButton.disabled = false;

        this.dealBoard = dealBoard;
        this.playBoard = playBoard;
        this.dealBoard.innerHTML = "";
        this.playBoard.innerHTML = "";

        this.hidden;

        this.dealGame();
    }

    dealGame() {
        let card = this.randomCard();
        this.dealer.push(card);
        this.dealBoard.appendChild(this.displayCard(card));
        
        card = this.randomCard();
        this.dealer.push(card);
        this.hidden = document.createElement("div");
        this.hidden.className = "card black"
        this.hidden.innerHTML = "<h1>?</h1>";
        this.dealBoard.appendChild(this.hidden);

        for (let i = 0 ; i<2; i++) {
            const card = this.randomCard();
            this.player.push(card);
            this.playBoard.appendChild(this.displayCard(card));
        }
    }

    cardCheck(card) {
        for (let c of this.dealer) {
            if (c.number === card.number && c.suit === card.suit) 
                return false;
        }
        for (let c of this.player) {
            if (c.number === card.number && c.suit === card.suit) 
                return false;
        }
        return true;
    }

    randomCard() {
        let card = {
            number: numbers[Math.floor(Math.random()*numbers.length)],
            suit: suits[Math.floor(Math.random()*suits.length)]
        };

        while (!this.cardCheck(card)) {
            card.number = numbers[Math.floor(Math.random()*numbers.length)];
            card.suit = suits[Math.floor(Math.random()*suits.length)];
        }

        return card;
    }

    handValue(hand) {
        let total = 0;
        let aces = 0;
        for (let card of hand) {
            if (!isNaN(card.number)) {
                total += parseInt(card.number);
            } else if (card.number === "A") {
                aces++;
            } else {
                total += 10;
            }
        }

        if (aces === 0)
            return total;

        let possible = [total+1, total+11];
        for (let i=1; i<aces; i++) {
            let add = [];
            for (let t of possible) {
                add.push(t+11);
                add.push(t+1);
            }
            possible = add;
        }
        let minimum = Math.min(...possible);
        possible = possible.filter(e => e <= 21);

        if (possible.length === 0) {
            return minimum;
        } else {
            return Math.max(...possible);
        }
    }

    hit() {
        const newCard = this.randomCard()
        if (this.handValue(this.player) == 21) {
            if (addAchievement("suboptimal")) {
                tilemsg("Achievement unlocked: Suboptimal Play", "Bro you already had 21 what are you doing 😭😭😭")
            }
        }
        this.player.push(newCard);
        this.playBoard.appendChild(this.displayCard(newCard))
        if (this.handValue(this.player) > 21) {
            this.hitButton.disabled = true;
            this.standButton.disabled = true;
            return false;
        } 
        return true;
    }

    stand() {
        this.hitButton.disabled = true;
        this.standButton.disabled = true;

        this.revealHidden();

        while (this.handValue(this.dealer) < 17 && this.dealer.length < 5) {
            const newCard = this.randomCard()
            this.dealer.push(newCard);
            this.dealBoard.appendChild(this.displayCard(newCard));
        }

        let deal = this.handValue(this.dealer);
        let play = this.handValue(this.player);

        if (this.dealer.length === 5 && deal <= 21) {
            return false;
        }

        if (deal > 21 || deal < play) {
            return true;
        } 
        if (deal > play) {
            return false;
        } 

        return null;
    }

    revealHidden() {
        const card = this.dealer[1];
        this.hidden.innerHTML = `
            <p>${card.number}</p>
            <img src='/assets/${card.suit}.svg' width="30px">
            <p>${card.number}</p>
        `;

        if (card.suit === "spade" || card.suit === "club")
            this.hidden.className = "card black";
        else 
            this.hidden.className = "card red";
    }

    displayCard(card) {
        const display = document.createElement("div");
        display.innerHTML = `
            <p>${card.number}</p>
            <img src='/assets/${card.suit}.svg' width="30px">
            <p>${card.number}</p>
        `;
        if (card.suit === "spade" || card.suit === "club")
            display.className = "card black";
        else 
            display.className = "card red";
        return display
    }
}

function startgame () {
    gambling++;
    if (gambling === 10) {
        if (addAchievement("gambling")) {
            tilemsg("Achievement unlocked: Gabling Addiction", "99% of gamblers quit right before they win big", 6000);
        }
    }

    const button = document.getElementById("start");
    const dealBoard = document.getElementById("dealer");
    const playBoard = document.getElementById("player");
    const hit = document.getElementById("hit");
    const stand = document.getElementById("stand");
    const result = document.getElementById("result")

    if (!dealBoard || !playBoard || !hit || !stand || !result)
        return;

    button.disabled = true;
    result.innerText = "Good luck";

    const game = new BlackJack(hit, stand, dealBoard, playBoard);

    hit.onclick = () => {
        if (!game.hit()) {
            result.innerText = "You Lost";
            button.disabled = false;
            return;
        } 
        if (game.player.length === 5) {
            result.innerText = "You win";
            hit.disabled = true;
            stand.disabled = true;
            button.disabled = false;
        }
    };

    stand.onclick = () => {
        const win = game.stand();
        if (win) {
            result.innerText = "You win";
        } else if (win === false) {
            result.innerText = "You lost";
        } else {
            result.innerText = "Tie"
        }
        button.disabled = false;
    };
}

document.getElementById("start").onclick = startgame;
