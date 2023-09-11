main()

//Fonction principal permettant le bon fonctionnement de toute la page
function main(){
    //On recupere le contenus du panier
    const panierString =localStorage.getItem("panier");
    const panier = JSON.parse(panierString);

    if (panierVide(panier)) {
        return;
    }

    //On initialise nos valeurs qui vont nous être utiles tout au long de la boucle
    let quantiteeTotale = 0;
    let prixTotal = 0;
    let products =[];

    for(let i = 0; i < panier.length; i++)          //On parcours les éléments de notre panier
    {
        const produitDuPanier = panier[i];
        const idKanap = produitDuPanier.id;
            
        quantiteeTotale += produitDuPanier.quantitee;
            
        fetch(`http://localhost:3000/api/products/${idKanap}`)
        .then(reponse => reponse.json())
        .then(kanap =>{
            const article = kanap;

            const sectionProduitPanier = document.getElementById("cart__items");
            const articleContainer = document.createElement("article");
            articleContainer.className = "cart__item"

            let divimg = creationDiv('cart__item__img');
            let divtext = creationDiv('cart__item__content');
            let divdesc = creationDiv('cart__item__content__description');
            let divparametre = creationDiv('cart__item__content__settings');
            let divquantite = creationDiv('cart__item__content__settings__quantity');
            let divsupprime = creationDiv('cart__item__content__settings__delete');


            const imgKanap = creationElementHtml("img", "", "", {src: article.imageUrl});
            const nomKanap = creationElementHtml("h2", "", article.name);
            const couleurKanap = creationElementHtml("p", "", produitDuPanier.couleur);
            const prixKanap = creationElementHtml("p", "", article.price + " €");
                    
            let quantiteKanap = creationElementHtml("input", "itemQuantity", "", {
                type: "number",
                min: 1,
                max: 100,
                value: produitDuPanier.quantitee
            });
            disableNumberInputKeyboard(quantiteKanap);
                    
            const qte = creationElementHtml("p", "", "Qté : ");
            const supprimer = creationElementHtml("p", "deleteItem", "Supprimer");

            prixTotal += produitDuPanier.quantitee*article.price; //a voir

            divimg.appendChild(imgKanap);
            appendElements(articleContainer, [divimg, divtext]);
            appendElements(divdesc, [nomKanap, couleurKanap, prixKanap]);
            appendElements(divquantite, [qte, quantiteKanap]);
            appendElements(divsupprime, [supprimer]);
            appendElements(divparametre, [divquantite, divsupprime]);
            appendElements(divtext, [divdesc, divparametre]);
            appendElements(sectionProduitPanier, [articleContainer]);

            supprimer.addEventListener("click", function(){
                deleteItem(panier, produitDuPanier, articleContainer)
            })

            const quantiteeElements = document.getElementsByClassName("itemQuantity");
            for(let y = 0; y < quantiteeElements.length; y++){
                changementQuantite(quantiteeElements[y], y, panier, quantiteeTotale, prixTotal, article)
            }

            const quantiteeTotaleFinal = document.getElementById("totalQuantity");
            quantiteeTotaleFinal.innerText = quantiteeTotale;
            const prixTotalFinal = document.getElementById("totalPrice");
            prixTotalFinal.innerText = prixTotal;

            products.push(produitDuPanier.id)
        })
    }

    document.querySelector('.cart__order__form').addEventListener('submit', function(event){
        gererSoumissionFormulaire(event, products, panier);
    });
}




//Cette fonction vérifie si le panier est vide ou non
function panierVide(panier) {
    if (!panier || panier.length === 0) {
    console.log("Votre panier est vide");
    return true;
    }
    return false;
}

//Cette fonction créer des div et leur attributs une classe
function creationDiv(className) {
    const div = document.createElement('div');
    div.className = className;
    return div;
}

//Cette fonction crée des éléments html, qu'ils soient images, texte, ou input
function creationElementHtml(element, className, content, attributes = {}) {
    const htmlElement = document.createElement(element);
    htmlElement.className = className;
    htmlElement.innerText = content;
  
    for (let attribute in attributes) {
      htmlElement.setAttribute(attribute, attributes[attribute]);
    }
  
    return htmlElement;
}

//Cette fonction permet de supprimer un élément du panier en cliquant sur le bouton "Supprimer"
function deleteItem(panier, produitDuPanier, articleContainer) {
    let deleteElement = panier.indexOf(produitDuPanier);
    panier.splice(deleteElement, 1);
    localStorage.setItem("panier", JSON.stringify(panier));
    articleContainer.remove();
    let deleteProduct = panier.indexOf(produitDuPanier.id);
    panier.splice(deleteProduct, 1);
}

//Cette fonction permet d'engandrer des éléments
function appendElements(parent, children) {
    for (let child of children) {
      parent.appendChild(child);
    }
}
  
//Cette longue fonction permet d'actualiser le nombre d'articles dans le panier en bas de page en temps réel
function changementQuantite(element, index, panier, quantiteeTotale, prixTotal, article) {
    element.addEventListener("input", function(event) {
      const quantiteKanap = parseInt(event.target.value);
      const lastQuantite = panier[index].quantitee;
      panier[index].quantitee = quantiteKanap;
  
      if (lastQuantite < panier[index].quantitee) {
        quantiteeTotale += 1;
        prixTotal += article.price;
      } else if (lastQuantite > panier[index].quantitee) {
        quantiteeTotale -= 1;
        prixTotal -= article.price;
      }
  
      const quantiteeTotaleFinal = document.getElementById("totalQuantity");
      quantiteeTotaleFinal.innerText = quantiteeTotale;
  
      const prixTotalFinal = document.getElementById("totalPrice");
      prixTotalFinal.innerText = prixTotal;
  
      localStorage.setItem("panier", JSON.stringify(panier));
    });
}
  

//Cette fonction recherche si il y a un nombre dans la chaine de caractère
function rechercheNombre(string){
    return /\d/.test(string);
}

//Cette fonction recherche si l'adresse mail est valide
function mailValide(string){
    const regex = /\S+@\S+\.\S+/;
    return regex.test(string);
}

//Cette fonction empêche de saisir la quantité au clavier, pour éviter tout problème de quantité négative
function disableNumberInputKeyboard(input) {
    input.addEventListener("keydown", function(e) {
      if (e.key !== "ArrowUp" && e.key !== "ArrowDown") {
        e.preventDefault();
      }
    });
}

// Fonction pour récupérer les valeurs des champs du formulaire
function recupererValeursFormulaire() {
    const prenom = document.getElementById('firstName').value;
    const nom = document.getElementById('lastName').value;
    const adresse = document.getElementById('address').value;
    const ville = document.getElementById('city').value;
    const mail = document.getElementById('email').value;

    return { prenom, nom, adresse, ville, mail };
}

// Fonction pour valider les champs du formulaire
function validerFormulaire(valeurs, panier) {
    const { prenom, nom, mail } = valeurs;
    if(rechercheNombre(prenom) || rechercheNombre(nom) || !mailValide(mail) || panierVide(panier)){
        alert("L'un des champs n'est pas valide !");
        return false;
    }
    return true;
}

// Fonction pour envoyer la requête au serveur
function envoyerRequete(contact, produits) {
    fetch('http://localhost:3000/api/products/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contact: contact,
            products: produits
        })
    })
    .then(response => response.json())
    .then(data => {
        localStorage.setItem("order", data.orderId);
        window.location.assign(`confirmation.html?orderID=${data.orderId}`);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Erreur lors de l\'envoi de la requête');
    });
}

// Fonction pour gérer la soumission du formulaire
function gererSoumissionFormulaire(event, produits, panier) {
    event.preventDefault();

    const valeurs = recupererValeursFormulaire();
    if (!validerFormulaire(valeurs, panier)) {
        return;
    }

    const { prenom, nom, adresse, ville, mail } = valeurs;
    const contact = { firstName : prenom, lastName : nom, address : adresse, city : ville, email : mail};

    envoyerRequete(contact, produits);
}




