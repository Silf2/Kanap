const str = window.location.href; //recuperation de l'id
const url = new URL(str);
const id = url.searchParams.get("id");

// Récupération des produits depuis l'API
function getProducts(id) {
    return fetch(`http://localhost:3000/api/products/${id}`)
    .then((response) => response.json())
    .catch((error) => console.error(error));
}
  
// Affichage des détails du produit sélectionné
function displayProductDetails(article) {
    const sectionImage = document.querySelector(".item__img");
    const imgKanap = document.createElement("img");
    imgKanap.src = article.imageUrl;
    sectionImage.appendChild(imgKanap);
  
    const titleKanap = document.getElementById("title");
    titleKanap.innerText = article.name;
  
    const priceKanap = document.getElementById("price");
    priceKanap.innerText = article.price;
  
    const descriptionKanap = document.getElementById("description");
    descriptionKanap.innerText = article.description;
  
    const couleur = article.colors;
    for (let j = 0; j < couleur.length; j++) {
        const menuCouleur = document.querySelector("select");
        const nomCouleur = document.createElement("option");
        nomCouleur.innerText = couleur[j];
        nomCouleur.value = couleur[j];
        menuCouleur.appendChild(nomCouleur);
    }
  
    document.getElementById("addToCart").addEventListener("click", function () {
        addProductToCart(article._id);
    });
}
  
// Ajout du produit sélectionné au panier
function addProductToCart(idKanap) {
    const couleurChoisie = document.querySelector("select").value;
    let quantiteeChoisie = document.getElementById("quantity").value;
    quantiteeChoisie = parseInt(quantiteeChoisie);
    const commandeProduit = { id: idKanap, couleur: couleurChoisie, quantitee: quantiteeChoisie };
  
    if (couleurChoisie != "" && quantiteeChoisie != 0 && quantiteeChoisie > 0 && quantiteeChoisie < 101) {
        const panier = JSON.parse(localStorage.getItem("panier")) || [];
        let produitExisteDeja = false;
        for (let i = 0; i < panier.length; i++) {
            if (commandeProduit.id == panier[i].id && commandeProduit.couleur == panier[i].couleur) {
            panier[i].quantitee += quantiteeChoisie;
            produitExisteDeja = true;
            break;
            }
        }
        if (!produitExisteDeja) {
            panier.push(commandeProduit);
        }
        localStorage.setItem("panier", JSON.stringify(panier));
        console.table(panier);
    } else {
        alert("Vous n'avez pas choisi de couleur ou la quantité choisie est invalide !");
    }
}
  
// Fonction principale
function main() {
    getProducts(id)
    .then((kanap) => {
        console.log(kanap);
        displayProductDetails(kanap);
    })
    .catch((error) => console.error(error));
}
  
// Appel de la fonction principale
main();