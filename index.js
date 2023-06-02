// search box
const searchBox = document.getElementById("search");
// get main container
let searchResults = document.getElementById("search-results");
// toast message
const toast = document.querySelector(".toast");

// keys
const ts = "jk23sd!@*(d)dsf";
const api_key = "7d23170d841421e2acb7c58421d5eced";
const hash_key = "5876f0e116e234f5870326ac97292947";

// if stored session
if (sessionStorage.getItem("id")) {
  sessionStorage.removeItem("id");
}

// create empty array of heros
var heros = [];

// rendering heros
renderHeros();

// set keys in local storage for transfering in another pages
if (localStorage.getItem("keys") == null) {
  localStorage.setItem("keys", `${ts}|${api_key}|${hash_key}`);
}

// create favorite in local storage of browser
if (localStorage.getItem("favourites") == null) {
  localStorage.setItem("favourites", JSON.stringify([]));
} else {
  favourites = JSON.parse(localStorage.getItem("favourites"));
}

// add into favorite
function addToFavorite(id) {
  if (favourites.includes(id) == false) {
    favourites.push(id);
    localStorage.setItem("favourites", JSON.stringify(favourites));
    showAlert("Added into favorites");
  } else {
    showAlert("Already in favorites");
  }
}

// fetching search input and search for characters based on the input
searchBox.addEventListener("keyup", async function (e) {
  let input = e.target.value;
  input.trim();
  if (input.length <= 0) {
    searchResults.innerHTML =
      "<h1 style='color:#fff;' >Search for your favorite superhero character</h1>";
    return;
  }
  let data = await getMarvelCharacters(input);
  if (data.length < 1) {
    searchResults.innerHTML =
      "<h1 style='color:#fff;' >No superhero character found by this name</h1>";
    return;
  }
  renderHeros(data);
});

// getting character
async function getMarvelCharacters(name) {
  const url = `https://gateway.marvel.com/v1/public/characters?nameStartsWith=${name}&ts=${ts}&apikey=${api_key}&hash=${hash_key}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.data.results;
  } catch (error) {
    console.error(error);
  }
}

// rendering heros cards
function renderHeros(data = []) {
  searchResults.innerHTML = "<h1 style='color:#fff;' >Searching...</h1>";
  if (data.length < 1) {
    searchResults.innerHTML =
      "<h1 style='color:#fff;' >Search for your favorite superhero character</h1>";
    return;
  }
  searchResults.innerHTML = "";
  data.forEach((item) => {
    searchResults.appendChild(createCard(item));
  });
}

// creating hero card
function createCard(item) {
  const li = document.createElement("li");
  const heroCard = document.createElement("div");
  heroCard.classList.add("hero-card");

  const heroImage = document.createElement("div");
  heroImage.classList.add("hero-image");
  const img = document.createElement("img");
  img.src = `${item.thumbnail.path}.${item.thumbnail.extension}`;
  img.alt = item.name;

  img.addEventListener("click", function () {
    sessionStorage.setItem("id", item.id);
    window.location.href = "./details.html";
  });

  heroImage.appendChild(img);

  const heroDetails = document.createElement("div");
  heroDetails.classList.add("hero-action", "d-flex", "a-center", "j-between");
  const name = document.createElement("span");
  name.innerText = item.name;
  const icon = document.createElement("i");
  icon.classList.add("fa-sharp", "fa-regular", "fa-heart");

  icon.addEventListener("click", function () {
    icon.style.color = "red";
    addToFavorite(item.id);
  });

  heroDetails.appendChild(name);
  heroDetails.appendChild(icon);

  heroCard.appendChild(heroImage);
  heroCard.appendChild(heroDetails);

  li.appendChild(heroCard);

  return li;
}

// show toast message alert
function showAlert(message = "") {
  const toastText = document.getElementById("toastText");
  toastText.innerText = message;
  toast.classList.remove("hide");
  setTimeout(() => {
    toast.classList.add("hide");
  }, 2000);
}
