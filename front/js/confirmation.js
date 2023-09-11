// Récupère l'ID de commande stocker dans la page précédente, et l'affiche à sa place
function showOrder(){
    const Order = localStorage.getItem("order");
    const orderId = document.getElementById("orderId");
    orderId.innerText = Order;
}

showOrder();

//Supression de tout ce qui a été stocké précedement
localStorage.clear();