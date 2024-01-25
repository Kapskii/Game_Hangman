const alphabet = [
  "Q",
  "W",
  "E",
  "R",
  "T",
  "Y",
  "U",
  "I",
  "O",
  "P",
  "A",
  "S",
  "D",
  "F",
  "G",
  "H",
  "J",
  "K",
  "L",
  "Z",
  "X",
  "C",
  "V",
  "B",
  "N",
  "M",
];

const puzzles = {
  CITY: "A place where a lot of people live",
  USA: "A country with 50 states",
  CAT: "A pet that can purr",
  DOG: "A pet that can bark",
  APPLE: "The tech brand that bears the fruit's name",
  INTERNET: "So you can communicate with people all over the world",
  PHONE: "You need it to communicate",
  TV: "You're watching movies on this one",
  DANCE: "To move the body and feet to music",
  DANGER: "The possibility of harm or death to someone",
  FIXED: "Arranged or decided already and not able to be changed",
  FRONT: "The part of a building, object, or person's body that faces forward or is most often seen or used",
  SECRET: "A piece of information that is only known by one person or a few people and should not be told to others",
  ACTIVE: "Busy with a particular activity"
};

const bodyElement = document.querySelector("body");
const gallowsWrapper = document.createElement("div");
const gallowGame = `
<div class="gallow-block"></div>
<div class="information-block">
<div class="information-block__word-wrapper"></div>
<p class="information-block__hint"></p>
<p class="information-block__count">Incorrect guesses: <span class="guesses">0/6</span></p>
<div class="information-block__keyboard"></div>
</div>
<div class="modal" id="modal"></div>
`;
const randomKey = getRandomElement(puzzles);
let word;
const lose = "You lose!";
const win = "You win!";

// constants
// --------------

function getRandomElement(obj) {
  const keys = Object.keys(obj);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  const randomValue = obj[randomKey];
  delete obj[randomKey];

  return { key: randomKey, value: randomValue };
}

function generateWord(obj) {
  const { key, value } = obj;
  const newWord = key
    .split("")
    .map(
      (el) =>
        `<h3 class="information-block__word information-block__word--${el} hide"><span>${el}</span></h3>`
    )
    .join("");
  word = key;
  document.querySelector(".information-block__word-wrapper").innerHTML =
    newWord;
  document.querySelector(
    ".information-block__hint"
  ).innerHTML = `Hint: ${value}`;
}

function generateKeyboard(alphabet) {
  const newKeyboard = alphabet
    .map((el) => `<button class="virtual-key key--${el}">${el}</button>`)
    .join("");

  document.querySelector(".information-block__keyboard").innerHTML =
    newKeyboard;
}

function createGallow() {
  const gallow = `
     <img class="gallows" src="./assets/gallows.png" alt="gallows"/>
     <img class="person head hide-image" src="./assets/head.png" alt="head"/>
     <img class="person body hide-image" src="./assets/body.png" alt="body"/>
     <img class="person hand-one hide-image" src="./assets/hand-one.png" alt="hand-one"/>
     <img class="person hand-two hide-image" src="./assets/hand-two.png" alt="hand-two"/>
     <img class="person leg-one hide-image" src="./assets/leg-one.png" alt="leg-one"/>
     <img class="person leg-two hide-image" src="./assets/leg-two.png" alt="leg-two"/>
   `;

  document.querySelector(".gallow-block").innerHTML = gallow;
}

function resetGame() {
  addClass();
  updateGuessesCount();
  document.querySelectorAll(`.virtual-key`).forEach(function (el) {
    el.removeAttribute("disabled");
    el.classList.remove("virtual-key--disabled");
  });
}

function addClass() {
  document
    .querySelectorAll(".information-block__word")
    .forEach((el) => el.classList.add("hide"));
  document
    .querySelectorAll(".person")
    .forEach((el) => el.classList.add("hide-image"));
}

function showModal(message) {
  const modalWrapper = document.querySelector(".modal");
  const modal = `
    <div class="modal-wrapper">
    <div class="modal-content">
    <h2 class="modal-message">${message}</h2>
    <p class="modal-word">${word}</p>
    <a class="modal-button" onclick="closeModal()">Play Again</a>
    </div>
    </div>
    `;
  modalWrapper.innerHTML += modal;
  modalWrapper.style.display = "block";
}

function closeModal() {
  const modal = document.getElementById("modal");
  const modalChild = document.querySelector(".modal-wrapper");
  modal.removeChild(modalChild);
  modal.style.display = "none";
  generateWord(getRandomElement(puzzles));
  resetGame();
  document.addEventListener("keydown", moveKeyBoard);
}

const removeClass = () => {
  const personPart = document.querySelector(".person.hide-image");
  if (personPart) {
    personPart.classList.remove("hide-image");
  }
};

function updateGuessesCount() {
  const persons = document.querySelectorAll(".person:not(.hide-image)");
  const count = persons.length;
  const guessesElement = document.querySelector(".guesses");
  guessesElement.textContent = `${count}/6`;
  if (count > 5) {
    showModal(lose);
    document.removeEventListener("keydown", moveKeyBoard);
  }
}

function moveKeyBoard(event) {
  const letter = event.key.toUpperCase();
  const isDisabled = document.querySelector(`.key--${letter}`)?.hasAttribute('disabled');

  if (/^[A-Z]$/.test(letter) && !isDisabled) {
    document.querySelectorAll(`.key--${letter}`).forEach(function (el) {
      el.setAttribute("disabled", "disabled");
      el.classList.add("virtual-key--disabled");
    });
    if (word.includes(letter)) {
      document
        .querySelectorAll(`.information-block__word--${letter}`)
        .forEach((elem) => elem.classList.remove("hide"));
      let hideCount = document.querySelectorAll(".hide").length;
      if (hideCount === 0) {
        showModal(win);
        document.removeEventListener("keydown", moveKeyBoard);
      }
    } else {
      removeClass();
      updateGuessesCount();
    }
  }
}

// functions
// --------------
gallowsWrapper.innerHTML += gallowGame;

bodyElement.appendChild(gallowsWrapper);
gallowsWrapper.classList.add("gallows-wrapper");

generateWord(randomKey);
generateKeyboard(alphabet);
createGallow();

const letter = document.querySelectorAll(".virtual-key");
letter.forEach(function (key) {
  key.addEventListener("click", function getLetter(event) {
    const letter = event.target.textContent;
    document.querySelectorAll(`.key--${letter}`).forEach(function (el) {
      el.setAttribute("disabled", "disabled");
      el.classList.add("virtual-key--disabled");
    });
    if (word.includes(letter)) {
      document
        .querySelectorAll(`.information-block__word--${letter}`)
        .forEach((elem) => elem.classList.remove("hide"));
      let hideCount = document.querySelectorAll(".hide").length;
      if (hideCount === 0) {
        showModal(win);
      }
    } else {
      removeClass();
      updateGuessesCount();
    }
  });
});

document.addEventListener("keydown", moveKeyBoard);



// main code
// _______________
