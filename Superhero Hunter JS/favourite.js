// get main area to render favourite cards
let searchResults = document.getElementById("search-results");
// get toast alert
const toast = document.querySelector(".toast");

// fetching favourites from local storage of browser
let favourites = JSON.parse(localStorage.getItem("favourites")) || [];

// fetching keys from local storage
let keys = localStorage.getItem("keys").split("|");

// if key is missing then redirect to home page
if (!keys) {
  window.location.href = "./index.html";
}

// extracting keys
const ts = keys[0];
const api_key = keys[1];
const hash_key = keys[2];

// rendering favourites heros
renderFavorites(favourites);

// renders heros
function renderFavorites(data = []) {
  searchResults.innerHTML = "<h1 style='color:#fff;' >Fetching...</h1>";
  if (data <= 0) {
    searchResults.innerHTML =
      "<h1 style='color:#fff;' >Not added any superhero</h1>";
    return;
  }
  searchResults.innerHTML = "";
  data.forEach((id) => {
    let url = `https://gateway.marvel.com/v1/public/characters/${id}?apikey=${api_key}&hash=${hash_key}&ts=${ts}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        searchResults.appendChild(createFavCard(data.data.results[0]));
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  });
}

// create card
function createFavCard(item) {
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
  icon.classList.add("fa-solid", "fa-trash-can");

  icon.addEventListener("click", function () {
    icon.style.color = "red";
    removeFromFav(item.id);
  });

  heroDetails.appendChild(name);
  heroDetails.appendChild(icon);

  heroCard.appendChild(heroImage);
  heroCard.appendChild(heroDetails);

  li.appendChild(heroCard);

  return li;
}

// removes card from favorite
function removeFromFav(id) {
  if (favourites.includes(id) == true) {
    let index = favourites.indexOf(id);
    favourites.splice(index, 1);
    localStorage.setItem("favourites", JSON.stringify(favourites));
    showAlert("Removed From favorites");
    location.reload();
  } else {
    showAlert("Not in favorites");
  }
}

// shows alert message on removal
function showAlert(message = "") {
  const toastText = document.getElementById("toastText");
  toastText.innerText = message;
  toast.classList.remove("hide");
  setTimeout(() => {
    toast.classList.add("hide");
  }, 2000);
}
