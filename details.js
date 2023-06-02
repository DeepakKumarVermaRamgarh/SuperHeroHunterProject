// getting id of character from session storage
const id = sessionStorage.getItem("id");

// getting keys from localstorage
let keys = localStorage.getItem("keys");

// if key or id any one is missing then redirect to home page
if (!keys || !id) {
  window.location.href = "./index.html";
}

// spliting keys
keys = keys.split("|");

// getting main area
const mainContainer = document.getElementById("details");

// create url to fetch data
const url = `https://gateway.marvel.com/v1/public/characters/${id}?apikey=${keys[1]}&hash=${keys[2]}&ts=${keys[0]}`;

// fetching data and display details
fetch(url)
  .then((response) => response.json())
  .then((data) => {
    createDetailCard(data.data.results[0]);
  })
  .catch((error) => {
    console.error("An error occurred:", error);
  });

// creates detailed card to view
function createDetailCard(character) {
  mainContainer.innerHTML = `<div class="details-container d-flex">
            <div class=" image-container">
                <img src=${character.thumbnail.path}.${character.thumbnail.extension} alt=${character.name}>
            </div>
            <div class="details-area">
                <center><span class="name">${character.name}</span></center>
                <div class="bio">
                    <div style="width:100%">
                        <p class="title">Biography</p>
                        <p><b>Full Name :</b> ${character.name}</p>
                        <p><b>Description :</b> ${character.description}</p>
                    </div>
                    
                </div>
                
            </div>
        </div>`;
}
