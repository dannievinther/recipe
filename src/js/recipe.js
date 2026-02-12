const directions = document.querySelector("h2:nth-of-type(2)");
const CONFETTI_COLORS = [
  "#27a69a",
  "#80cbc4",
  "#f59e0b",
  "#22c55e",
  "#38bdf8",
  "#f43f5e",
];
const CONFETTI_EMOJIS = ["🥕", "🍅", "🥦", "🍓", "🍌", "🍪", "✨", "🎉", "🥳"];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function applyTrajectory(piece, centerXPercent) {
  const x = clamp(centerXPercent + (Math.random() - 0.5) * 34, 3, 97);
  const xDrift = (Math.random() - 0.5) * 24;
  const duration = 800 + Math.random() * 900;
  const delay = Math.random() * 130;
  const spin = (Math.random() - 0.5) * 920;

  piece.style.setProperty("--x", `${x}vw`);
  piece.style.setProperty("--x-end", `${clamp(x + xDrift, 2, 98)}vw`);
  piece.style.setProperty("--duration", `${duration}ms`);
  piece.style.setProperty("--delay", `${delay}ms`);
  piece.style.setProperty("--spin", `${spin}deg`);
}

function ensureConfettiStyles() {
  if (document.getElementById("confetti-styles")) return;
  const style = document.createElement("style");
  style.id = "confetti-styles";
  style.textContent = `
    .confetti-layer {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 9999;
      overflow: hidden;
    }
    .confetti-piece {
      position: absolute;
      top: -8px;
      left: 0;
      width: 8px;
      height: 12px;
      border-radius: 2px;
      transform: translate3d(var(--x), -10px, 0) rotate(0deg);
      animation: confetti-fall var(--duration) ease-out forwards;
      animation-delay: var(--delay);
      opacity: 0.95;
    }
    .confetti-emoji {
      position: absolute;
      top: -18px;
      left: 0;
      font-size: clamp(16px, 2.8vw, 24px);
      line-height: 1;
      transform: translate3d(var(--x), -24px, 0) rotate(0deg);
      animation: confetti-fall var(--duration) ease-out forwards;
      animation-delay: var(--delay);
      filter: drop-shadow(0 2px 4px hsl(210 30% 20% / 0.25));
    }
    @keyframes confetti-fall {
      to {
        transform: translate3d(var(--x-end), 105vh, 0) rotate(var(--spin));
        opacity: 0;
      }
    }
  `;
  document.head.append(style);
}

function launchConfettiBurst(centerXPercent = 50) {
  ensureConfettiStyles();

  const layer = document.createElement("div");
  layer.className = "confetti-layer";

  const confettiCount = 28;
  for (let i = 0; i < confettiCount; i += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    piece.style.background = color;
    applyTrajectory(piece, centerXPercent);
    layer.append(piece);
  }

  const emojiCount = 20;
  for (let i = 0; i < emojiCount; i += 1) {
    const emoji = document.createElement("span");
    emoji.className = "confetti-emoji";
    emoji.textContent =
      CONFETTI_EMOJIS[Math.floor(Math.random() * CONFETTI_EMOJIS.length)];
    applyTrajectory(emoji, centerXPercent);
    layer.append(emoji);
  }

  document.body.append(layer);
  setTimeout(() => {
    layer.remove();
  }, 2200);
}

// check to see if all checkboxes are checked
function areAllChecked(checkboxes) {
  return Array.from(checkboxes).every((checkbox) => checkbox.checked);
}

document.addEventListener("change", (event) => {
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

  // Fire confetti when this change completes the full checklist
  // for the current recipe article.
  const scope = target.closest("article") ?? document;
  const checklist = scope.querySelectorAll("input[type='checkbox']");
  const allChecked = checklist.length > 0 && areAllChecked(checklist);
  if (target.checked && allChecked) {
    const rect = target.getBoundingClientRect();
    const centerXPercent = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
    launchConfettiBurst(centerXPercent);
  }
});
