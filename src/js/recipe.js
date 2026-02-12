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

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function applyTrajectory(piece, side) {
  const fromX =
    side === "left"
      ? -10 + Math.random() * 22
      : 88 + Math.random() * 22;
  const toX = clamp(35 + Math.random() * 30 + (Math.random() - 0.5) * 12, 20, 80);
  const duration = 900 + Math.random() * 850;
  const delay = Math.random() * 120;
  const spinStart = (Math.random() - 0.5) * 180;
  const spinEnd = spinStart + (Math.random() - 0.5) * 1080;

  piece.style.setProperty("--x-start", `${fromX}vw`);
  piece.style.setProperty("--x-end", `${toX}vw`);
  piece.style.setProperty("--duration", `${duration}ms`);
  piece.style.setProperty("--delay", `${delay}ms`);
  piece.style.setProperty("--spin-start", `${spinStart}deg`);
  piece.style.setProperty("--spin-end", `${spinEnd}deg`);
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
    .confetti-emoji {
      position: absolute;
      top: -18px;
      left: 0;
      font-size: clamp(16px, 2.8vw, 24px);
      line-height: 1;
      transform: translate3d(var(--x-start), -24px, 0) rotate(var(--spin-start));
      animation: confetti-fall var(--duration) ease-out forwards;
      animation-delay: var(--delay);
      filter: drop-shadow(0 2px 4px hsl(210 30% 20% / 0.25));
    }
    @keyframes confetti-fall {
      to {
        transform: translate3d(var(--x-end), 105vh, 0) rotate(var(--spin-end));
        opacity: 0;
      }
    }
  `;
  document.head.append(style);
}

function launchConfettiBurst() {
  ensureConfettiStyles();

  const layer = document.createElement("div");
  layer.className = "confetti-layer";

  const emojiCountPerSide = 18;
  for (let i = 0; i < emojiCountPerSide * 2; i += 1) {
    const side = i % 2 === 0 ? "left" : "right";
    const emojiPiece = document.createElement("span");
    emojiPiece.className = "confetti-emoji";
    emojiPiece.textContent =
      CONFETTI_EMOJIS[Math.floor(Math.random() * CONFETTI_EMOJIS.length)];
    applyTrajectory(emojiPiece, side);
    layer.append(emojiPiece);
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
    launchConfettiBurst();
  }
});
