const directions = document.querySelector("h2:nth-of-type(2)");
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
let confettiPromise = null;

function areAllChecked(checkboxes) {
  return Array.from(checkboxes).every((checkbox) => checkbox.checked);
}

function getConfetti() {
  if (!confettiPromise) {
    confettiPromise = import("js-confetti")
      .then(({ default: JSConfetti }) => new JSConfetti())
      .catch(() => null);
  }
  return confettiPromise;
}

document.addEventListener("change", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement) || target.type !== "checkbox") {
    return;
  }

  const currentUl = target.closest("ul");
  if (currentUl) {
    const ulCheckboxes = currentUl.querySelectorAll("input[type='checkbox']");
    if (ulCheckboxes.length > 0 && areAllChecked(ulCheckboxes) && directions) {
      directions.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  const currentOl = target.closest("ol");
  if (!currentOl) return;

  // Warm the chunk on first checklist interaction.
  void getConfetti();

  const olCheckboxes = currentOl.querySelectorAll("input[type='checkbox']");
  if (olCheckboxes.length === 0 || !areAllChecked(olCheckboxes)) return;

  const jsConfetti = await getConfetti();
  jsConfetti?.addConfetti({
    emojis: CONFETTI_EMOJIS,
  });
});
