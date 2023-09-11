fetch("http://localhost:3000/api/products")
 .then (reponse => reponse.json())
 .then (kanap =>{

    for(let i= 0; i<kanap.length; i++){
        const article = kanap[i];
        displayArticle(article);
    }    
 }
)

//Cette fonction gère l'URL qui sera afficher sur la page produit en y incluant l'id
function createLink(article) {
    const linkContainer = document.createElement("a");
    linkContainer.href = `./product.html?id=${article._id}`;
    return linkContainer;
}
  
//Cette fonction créé nos articles en leur attribuant leurs noms, images et une description tronquée
function createArticle(article) {
    const articleContainer = document.createElement("article");
    articleContainer.className = "article";
  
    const nomKanap = document.createElement("h3");
    nomKanap.innerText = article.name;
    const imgKanap = document.createElement("img");
    imgKanap.src = article.imageUrl;
  
    const descriptionKanap = document.createElement("p");
    if (article.description.length > 50) {
      descriptionKanap.innerText = article.description.slice(0, 50) + "...";
    } else {
      descriptionKanap.innerText = article.description;
    }
  
    articleContainer.appendChild(nomKanap);
    articleContainer.appendChild(imgKanap);
    articleContainer.appendChild(descriptionKanap);
  
    return articleContainer;
}
 
//Cette fonction affiche nos articles
function displayArticle(article) {
    const sectionItem = document.querySelector(".items");
    const linkContainer = createLink(article);
    const articleContainer = createArticle(article);
  
    linkContainer.appendChild(articleContainer);
    sectionItem.appendChild(linkContainer);
}
  