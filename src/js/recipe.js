import JSConfetti from "js-confetti";
const jsConfetti = new JSConfetti();

const ulCheckboxes = document.querySelectorAll("ul [type='checkbox']");
const olCheckboxes = document.querySelectorAll("ol [type='checkbox']");
const directions = document.querySelector("h2:nth-of-type(2)");

// check to see if all checkboxes are checked
function areAllChecked(checkboxes) {
  return Array.from(checkboxes).every((checkbox) => checkbox.checked);
}

// Event listener for each checkbox
ulCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    if (areAllChecked(ulCheckboxes)) {
      // Smoothly scroll to the target element
      directions.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

olCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    if (areAllChecked(olCheckboxes)) {
      jsConfetti.addConfetti();
    }
  });
});
