import JSConfetti from "js-confetti";

const directions = document.querySelector("h2:nth-of-type(2)");
const jsConfetti = new JSConfetti();
const CONFETTI_EMOJIS = [
  "🍆",
  "🥕",
  "🥒",
  "🌶️",
  "🍏",
  "🥦",
  "🥬",
  "🥑",
  "🍅",
  "🌶️",
];

function areAllChecked(checkboxes) {
  return Array.from(checkboxes).every((checkbox) => checkbox.checked);
}

const ulCheckboxes = document.querySelectorAll("ul input[type='checkbox']");
ulCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    if (areAllChecked(ulCheckboxes) && directions) {
      directions.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

const olCheckboxes = document.querySelectorAll("ol input[type='checkbox']");
olCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    if (areAllChecked(olCheckboxes)) {
      jsConfetti.addConfetti({
        emojis: CONFETTI_EMOJIS,
      });
    }
  });
});
