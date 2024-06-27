

const productsList = document.getElementById('productsList');
const cartSection = document.getElementById('cart_section');
const cartList = document.getElementById('cartList');
const noItem = document.getElementById('noItem');
const showCart=document.getElementById('showCart');
const productBlock=document.getElementById('productBlock');
const cartBlock=document.getElementById('cartBlock');
const header=document.getElementById('header')
const cartItems=[];
var products=[]
let subTotal=0;
let totalItems=0;
const badgeCount = document.getElementById('badgeCount');

document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://fakestoreapi.com/products'; // Replace with your API URL
    badgeCount.textContent=0
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json(); // Parse the JSON from the response
        })
        .then(data => {
           if(data.length > 0){
            products=data;
            cartSection.classList.add('d-none')
            renderProducts(data)
           }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            const dataDiv = document.getElementById('data');
            dataDiv.innerHTML = 'Error: ' + error.message;
        });
});

function renderProducts(data){
    productsList.innerHTML=''
    data.forEach(product=>{
        const div = document.createElement('div');
        div.classList.add('col-4');
        div.innerHTML = `
        <div class="card shadow-sm">
        <span class="badge text-bg-danger move rounded-pill">Stock Left: ${product.rating.count}</span>
        <img src="${product.image}" width="100%" height="225" alt="">
        <div class="card-body">
          <p class="card-title">${product.title}</p>
          <p class="card-text">${product.description}</p>
          <div class="d-flex justify-content-between align-items-center mt-3">
            <div class="btn-group">
             ${product.quantity > 0 ? ` <div class="quantity" ><span style="cursor: pointer;" class="reduce_cart" data-product-id="${product.id}">-</span>${product.quantity}<span style="cursor: pointer;" class="increase_cart" data-product-id="${product.id}">+</span></div>`
             : `<button  class="btn btn-success add_to_cart" data-product-id="${product.id}">Add To Cart
                </button>`}                  
          </div>
            <span class="badge text-bg-warning rounded-pill">$${product.price}</span>
        </div>
      </div>
            `;
        productsList.appendChild(div);
    })
}

function renderCart(data){
    cartList.innerHTML=''
    data.forEach(cart=>{
        const div = document.createElement('div');
        div.innerHTML = `
        <div class="row align-items-center" >
              <div class="col-md-1">
                <img src="${cart.image}" style="width:100%" />
              </div>
              <div class="col-md-8">
                <h1 class="title">${cart.title}</h1>
      
                <p>${cart.description}</p>
              </div>
              <div class="col-md-1 quantity"><span style="cursor: pointer;" class="reduce_cart" data-product-id="${cart.id}">-</span>${cart.quantity}<span style="cursor: pointer;" class="increase_cart" data-product-id="${cart.id}">+</span>
            </div>
              <div class="col-md-2 end">
                <div class="amount">$${cart.price}</div>
                <div class="remove remove_cart" data-product-id="${cart.id}">Remove</div>
              </div>
            </div>
            `;
            cartList.appendChild(div);
    })
}

productsList.addEventListener('click', handleButtonClick);
cartList.addEventListener('click', handleButtonClick);

function handleButtonClick(event) {
    if (event.target.classList.contains('add_to_cart')) {
        const productId = event.target.getAttribute('data-product-id');
        let filteredindex = products.findIndex(e => e.id == productId)
        if (filteredindex != -1) {
            addProduct(products[filteredindex]) 
        }
    }
    if (event.target.classList.contains('increase_cart')) {
        const productId = event.target.getAttribute('data-product-id');
        let filteredindex = products.findIndex(e => e.id == productId)
        if (filteredindex != -1) {
            addProduct(products[filteredindex]) 
        }
    }
    if (event.target.classList.contains('reduce_cart')) {
        const productId = event.target.getAttribute('data-product-id');
        let filteredindex = products.findIndex(e => e.id == productId)
        if (filteredindex != -1) {
            reduceProduct(products[filteredindex]) 
        }
    }
    if (event.target.classList.contains('remove_cart')) {
        const productId = event.target.getAttribute('data-product-id');
        let filteredindex = products.findIndex(e => e.id == productId)
        if (filteredindex != -1) {
            removeProduct(products[filteredindex].id) 
        }
    }
    
}


function addProduct(product) {
    if (cartItems.length > 0) {
        let filteredIndex = cartItems.findIndex(e => e.id == product.id);
        if (filteredIndex != -1) {
            cartItems[filteredIndex].quantity = cartItems[filteredIndex].quantity + 1;
            cartItems[filteredIndex].totalPrice = cartItems[filteredIndex].price * cartItems[filteredIndex].quantity;
        } else {
            if (!product.quantity) {
                product.quantity = 1;
                product.totalPrice = product.price * product.quantity;
            }
            cartItems.push(product);
        }
    } else {
        if (!product.quantity) {
            product.quantity = 1;
            product.totalPrice = product.price * product.quantity;
        }
        cartItems.push(product);
    }
    products.forEach(a => {
        if (a.id === product.id) {
          a.rating.count = a.rating.count - 1;
        }
      })
      renderProducts(products)
      badgeCount.textContent=cartItems.length
      noItem.classList.add('d-none')
      cartSection.classList.remove('d-none')
      renderCart(cartItems)
      calculateSubTotal()
}

function reduceProduct(product) {
    if (cartItems.length > 0) {
        let filteredIndex = cartItems.findIndex(e => e.id == product.id);
        if (filteredIndex != -1) {
            if(cartItems[filteredIndex].quantity==1){
                cartItems.splice(filteredIndex,1)
            }
            else{
                cartItems[filteredIndex].quantity = cartItems[filteredIndex].quantity - 1;
                cartItems[filteredIndex].totalPrice = cartItems[filteredIndex].price * cartItems[filteredIndex].quantity;
            }
            
        } 
    }
   products.forEach(a => {
    if (a.id === product.id) {
      a.rating.count = a.rating.count + 1;
        let ind = cartItems.findIndex(e => e.id == product.id)
        if (ind == -1) {
          a.quantity = 0
        }
    }
    })
    if(cartItems.length==0){
    noItem.classList.remove('d-none')
    cartSection.classList.add('d-none')
    }
      renderProducts(products)
      badgeCount.textContent=cartItems.length
      renderCart(cartItems)
      calculateSubTotal()
  }

  function calculateSubTotal() {
    const subtotalElement = document.getElementById('subtotal');
    const itemsElement = document.getElementById('items');
    const subTotal = cartItems.reduce((prev, curr) => {
        return prev + (curr.price * curr.quantity);
    }, 0);
    subtotalElement.textContent=`$${subTotal.toFixed(2)}`
    itemsElement.textContent=`${cartItems.length} items`
}

header.addEventListener('click',openCart)

function openCart(event){
    if (event.target.classList.contains('showCart')) {
        if(!productBlock.classList.contains('d-none')){
            productBlock.classList.add('d-none')
        }
        if(cartBlock.classList.contains('d-none')){
            cartBlock.classList.remove('d-none')
        }
    }
    if (event.target.classList.contains('closeCart')) {
        if(productBlock.classList.contains('d-none')){
            productBlock.classList.remove('d-none')
        }
        if(!cartBlock.classList.contains('d-none')){
            cartBlock.classList.add('d-none')
        }
    }
}

function removeProduct(id){
    let filteredIndex = cartItems.findIndex(e => e.id == id);
    const product = cartItems.splice(filteredIndex, 1);
    products.forEach(a => {
        if (a.id === product[0].id) {
          a.rating.count = a.rating.count + product[0].quantity;
          a.quantity = 0
        }
      })
      renderProducts(products)
      badgeCount.textContent=cartItems.length
      renderCart(cartItems)
      calculateSubTotal()
      if(cartItems.length==0){
        noItem.classList.remove('d-none')
        cartSection.classList.add('d-none')
        }
}
