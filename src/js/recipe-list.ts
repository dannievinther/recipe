const toggleButton = document.querySelector(".toggle-view");
const categoryLists = [
  ...document.querySelectorAll<HTMLElement>(".category-wrapper"),
];

toggleButton?.addEventListener("click", () => {
  const isListMode = toggleButton.getAttribute("aria-pressed") === "true";
  const nextView = isListMode ? "grid" : "list";

  toggleButton.setAttribute("aria-pressed", String(!isListMode));
  categoryLists.forEach((categoryList) => {
    categoryList.dataset.view = nextView;
  });
});
