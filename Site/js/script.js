function toggleMenu() {
  var menu = document.querySelector(".menu");
  menu.classList.toggle("show-menu");
}

document.getElementById("search-icon").addEventListener("click", function () {
  toggleMenu();
});

var shoppingCart = (function () {
  // Private methods and properties
  var cart = [];

  // Constructor
  function Item(name, price, count) {
    this.name = name;
    this.price = price;
    this.count = count;
  }

  // Save cart
  function saveCart() {
    sessionStorage.setItem("shoppingCart", JSON.stringify(cart));
  }

  // Load cart
  function loadCart() {
    cart = JSON.parse(sessionStorage.getItem("shoppingCart")) || [];
  }

  if (sessionStorage.getItem("shoppingCart") != null) {
    loadCart();
  }

  // Public methods and properties
  var obj = {};

  // Add to cart
  obj.addItemToCart = function (name, price, count) {
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].name === name) {
        cart[i].count++;
        saveCart();
        return;
      }
    }
    var item = new Item(name, price, count);
    cart.push(item);
    saveCart();
  };

  // Set count for item
  obj.setCountForItem = function (name, count) {
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].name === name) {
        cart[i].count = count;
        break;
      }
    }
    saveCart();
  };

  // Remove item from cart
  obj.removeItemFromCart = function (name) {
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].name === name) {
        cart[i].count--;
        if (cart[i].count === 0) {
          cart.splice(i, 1);
        }
        break;
      }
    }
    saveCart();
  };

  // Remove all items from cart
  obj.removeItemFromCartAll = function (name) {
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].name === name) {
        cart.splice(i, 1);
        break;
      }
    }
    saveCart();
  };

  // Clear cart
  obj.clearCart = function () {
    cart = [];
    saveCart();
  };

  // Count cart
  obj.totalCount = function () {
    var totalCount = 0;
    for (var i = 0; i < cart.length; i++) {
      totalCount += cart[i].count;
    }
    return totalCount;
  };

  // Total cart
  obj.totalCart = function () {
    var totalCart = 0;
    for (var i = 0; i < cart.length; i++) {
      totalCart += cart[i].price * cart[i].count;
    }
    return Number(totalCart.toFixed(2));
  };

  // List cart
  obj.listCart = function () {
    var cartCopy = [];
    for (var i = 0; i < cart.length; i++) {
      var item = cart[i];
      var itemCopy = {};
      for (var prop in item) {
        if (item.hasOwnProperty(prop)) {
          itemCopy[prop] = item[prop];
        }
      }
      itemCopy.total = Number(item.price * item.count).toFixed(2);
      cartCopy.push(itemCopy);
    }
    return cartCopy;
  };

  // Save cart
  obj.saveCart = saveCart;

  // Load cart
  obj.loadCart = loadCart;

  return obj;
})();

// Triggers / Events
// Add item
document.querySelectorAll(".add-to-cart").forEach(function (button) {
  button.addEventListener("click", function (event) {
    event.preventDefault();
    var name = this.dataset.name;
    var price = Number(this.dataset.price);
    shoppingCart.addItemToCart(name, price, 1);
    displayCart();
  });
});

// Clear items
document.querySelectorAll(".clear-cart").forEach(function (button) {
  button.addEventListener("click", function () {
    shoppingCart.clearCart();
    displayCart();
  });
});

// Display cart
function displayCart() {
  var cartArray = shoppingCart.listCart();
  var output = "";
  for (var i = 0; i < cartArray.length; i++) {
    output +=
      "<tr>" +
      "<td>" +
      cartArray[i].name +
      "</td>" +
      "<td>(" +
      cartArray[i].price +
      ")</td>" +
      "<td><div class='input-group'><button class='minus-item input-group-addon btn btn-primary' data-name='" +
      cartArray[i].name +
      "'>-</button>" +
      "<input type='number' class='item-count form-control' data-name='" +
      cartArray[i].name +
      "' value='" +
      cartArray[i].count +
      "'>" +
      "<button class='plus-item btn btn-primary input-group-addon' data-name='" +
      cartArray[i].name +
      "'>+</button></div></td>" +
      "<td><button class='delete-item btn btn-danger' data-name='" +
      cartArray[i].name +
      "'>X</button></td>" +
      " = " +
      "<td>" +
      cartArray[i].total +
      "</td>" +
      "</tr>";
  }
  document.querySelector(".show-cart").innerHTML = output;
  document.querySelector(".total-cart").innerHTML = shoppingCart.totalCart();
  document.querySelector(".total-count").innerHTML = shoppingCart.totalCount();
}

// Delete item button
document
  .querySelector(".show-cart")
  .addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-item")) {
      var name = event.target.dataset.name;
      shoppingCart.removeItemFromCartAll(name);
      displayCart();
    }
  });

// -1
document
  .querySelector(".show-cart")
  .addEventListener("click", function (event) {
    if (event.target.classList.contains("minus-item")) {
      var name = event.target.dataset.name;
      shoppingCart.removeItemFromCart(name);
      displayCart();
    }
  });
// +1
document
  .querySelector(".show-cart")
  .addEventListener("click", function (event) {
    if (event.target.classList.contains("plus-item")) {
      var name = event.target.dataset.name;
      shoppingCart.addItemToCart(name);
      displayCart();
    }
  });

// Item count input
document
  .querySelector(".show-cart")
  .addEventListener("change", function (event) {
    if (event.target.classList.contains("item-count")) {
      var name = event.target.dataset.name;
      var count = Number(event.target.value);
      shoppingCart.setCountForItem(name, count);
      displayCart();
    }
  });

// Afficher la modale du panier lorsqu'un bouton est cliqué
document.getElementById("cartButton").addEventListener("click", function () {
  // Ajoutez la classe 'show' à l'élément de la modale pour l'afficher
  document.getElementById("cart").classList.add("show");
});

// Fermer la modale du panier lorsqu'un bouton est cliqué
document.querySelector("#cart .close").addEventListener("click", function () {
  // Supprimez la classe 'show' de l'élément de la modale pour la masquer
  document.getElementById("cart").classList.remove("show");
});

// Fermer la modale du panier lorsque le bouton 'Fermer' est cliqué
document
  .querySelector("#cart .btn-secondary")
  .addEventListener("click", function () {
    // Supprimez la classe 'show' de l'élément de la modale pour la masquer
    document.getElementById("cart").classList.remove("show");
  });

displayCart();
