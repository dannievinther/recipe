type InspirationItem = {
  category: string;
  title: string;
  href: string;
  time: string;
  imgSrc: string;
  imgWidth: number;
  imgHeight: number;
};

type FavoriteItem = {
  href: string;
  title: string;
  category?: string;
  updatedAt?: number;
};

const FAVORITES_KEY = "fogop:inspirationFavorites";
const dataElement = document.getElementById("inspirationData");
const items: InspirationItem[] = dataElement
  ? JSON.parse(dataElement.textContent || "[]")
  : [];
const wrapper = document.querySelector(".inspiration-wrapper");
const itemCard = wrapper?.querySelector(".inspiration-item");
const itemLink = itemCard?.querySelector("a") || null;
const itemImage = itemCard?.querySelector("img") || null;
const itemCaption = itemCard?.querySelector<HTMLElement>("figcaption") || null;
const itemTime = itemCaption?.querySelector("span");

const nextButton = document.getElementById("next");
const prevButton = document.getElementById("prev");
const shuffleButton = document.getElementById("shuffle");
const saveFavoriteButton = document.getElementById("saveFavorite");
const itemsLeft = document.querySelector(".items-left .number");
const openRecipe = document.getElementById("openRecipe");
const filterButtons = [
  ...document.querySelectorAll<HTMLButtonElement>(".filter-btn"),
];
const favoritesSection = document.querySelector<HTMLElement>(".favorites");
const favoritesList = document.getElementById("favoritesList");

const state: { filter: string; visible: InspirationItem[]; index: number } = {
  filter: "all",
  visible: [],
  index: 0,
};

function shuffle(array: InspirationItem[]) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getCurrentItem() {
  return state.visible[state.index] || null;
}

function formatTime(value: string | number | null | undefined) {
  const normalized = String(value || "").trim();
  if (!normalized) return "";
  if (/\bmin(?:\.|utter)?\b/i.test(normalized)) return normalized;
  return `${normalized} min.`;
}

function readFavorites(): FavoriteItem[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeFavorites(favorites: FavoriteItem[]) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function renderFavorites() {
  if (!favoritesList || !favoritesSection) return;

  const favorites = readFavorites();
  favoritesList.textContent = "";

  if (favorites.length === 0) {
    favoritesSection.hidden = true;
    return;
  }

  favoritesSection.hidden = false;
  const fragment = document.createDocumentFragment();

  favorites.forEach((favorite) => {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = favorite.href;
    link.textContent = favorite.title;
    link.dataset.astroPrefetch = "";

    const remove = document.createElement("button");
    remove.type = "button";
    remove.dataset.removeHref = favorite.href;
    remove.textContent = "Fjern";

    li.append(link, remove);
    fragment.append(li);
  });

  favoritesList.append(fragment);
}

function syncFilterButtons() {
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === state.filter;
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function refreshVisible({ reshuffle = true } = {}) {
  const filtered = items.filter((item) => {
    if (state.filter === "all") return true;
    return item.category === state.filter;
  });

  state.visible = reshuffle ? shuffle(filtered) : filtered;
  state.index = 0;
}

function renderCurrent() {
  const current = getCurrentItem();

  if (!current) {
    if (itemsLeft) itemsLeft.textContent = "0";
    if (openRecipe) openRecipe.setAttribute("href", "/opskrifter/");
    if (saveFavoriteButton) saveFavoriteButton.setAttribute("disabled", "true");
    itemCard?.setAttribute("hidden", "");
    return;
  }

  itemCard?.removeAttribute("hidden");
  if (itemLink) {
    itemLink.href = current.href;
    itemLink.textContent = current.title;
  }

  if (itemImage) {
    itemImage.src = current.imgSrc;
    itemImage.width = current.imgWidth;
    itemImage.height = current.imgHeight;
    itemImage.loading = "eager";
    itemImage.decoding = "async";
  }

  if (itemCaption && itemTime) {
    const label = formatTime(current.time);
    itemCaption.hidden = !label;
    itemTime.textContent = label;
  }

  if (itemsLeft) {
    itemsLeft.textContent = `${Math.max(state.visible.length - state.index - 1, 0)}`;
  }

  if (openRecipe) {
    openRecipe.setAttribute("href", current.href || "/opskrifter/");
  }

  if (saveFavoriteButton) {
    saveFavoriteButton.removeAttribute("disabled");
  }
}

function next() {
  if (state.visible.length === 0) return;
  state.index = (state.index + 1) % state.visible.length;

  if (state.index === 0) {
    state.visible = shuffle(state.visible);
  }

  renderCurrent();
}

function prev() {
  if (state.visible.length === 0) return;
  state.index = state.index === 0 ? state.visible.length - 1 : state.index - 1;
  renderCurrent();
}

function setFilter(filterValue: string) {
  state.filter = filterValue;
  refreshVisible();
  syncFilterButtons();
  renderCurrent();
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filterValue = button.dataset.filter || "all";
    setFilter(filterValue);
  });
});

nextButton?.addEventListener("click", next);
prevButton?.addEventListener("click", prev);
shuffleButton?.addEventListener("click", () => {
  state.visible = shuffle(state.visible);
  state.index = 0;
  renderCurrent();
});

saveFavoriteButton?.addEventListener("click", () => {
  const current = getCurrentItem();
  if (!current) return;

  const href = current.href;
  const title = current.title;
  const category = current.category;

  if (!href || !title) return;

  const favorites = readFavorites();
  const deduped = favorites.filter((favorite) => favorite.href !== href);

  deduped.unshift({
    href,
    title,
    category: category || "",
    updatedAt: Date.now(),
  });

  writeFavorites(deduped.slice(0, 12));
  renderFavorites();
});

favoritesList?.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) return;

  const href = target.dataset.removeHref;
  if (!href) return;

  const favorites = readFavorites().filter((favorite) => favorite.href !== href);
  writeFavorites(favorites);
  renderFavorites();
});

refreshVisible();
syncFilterButtons();
renderCurrent();
renderFavorites();
