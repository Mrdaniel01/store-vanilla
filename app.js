//variables

const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartContent = document.querySelector('.cart-content');
const cartTotal = document.querySelector('.cart-total');
const productsDOM = document.querySelector('.products-center');


//cart
let cart = [];


//get the products
class Products {
  async getProducts(){
    try {
      let result = await fetch('products.json');//to use an API, could use this https://www.contentful.com/developers/
      let data = await result.json();

      let products = data.items;
      products = products.map( item => { //i receive and object from my fake API
        const {title, price} = item.fields;
        const {id} = item.sys;
        const image = item.fields.image.fields.file.url; 
        return {title,price,id,image} //then i return and organized object
      })
      return products
    } catch (error) {
        console.log(error)
    }
  }
}

//display produts
class UI {
  displayProducts(products){
    let result = '';
    products.forEach(product => {
      result += `
      <!--single product-->
      <article class="product">
        <div class="img-container">
          <img 
            src=${product.image}
            alt=${product.name}
            class="product-img" >
          <button class="bag-btn" data-id=${product.id}> 
            <i class="fas fa-cart-plus"></i>
            Add to bag 
          </button>
        </div>
        <h3>${product.title}</h3>
        <h4>${product.price}</h4>
      </article>
      <!--end single product-->
      `;
    });
    productsDOM.innerHTML = result; //render of my items
  }
  getBagButtons(){//get all buttons in each product
    const buttons = [...document.querySelectorAll('.bag-btn')];
    buttons.forEach(button => {
      let id = button.dataset.id;
      let inCart = cart.find(item => item.id === id);
      if (inCart) {
        button.innerText = 'In Cart';
        button.disabled = true;
      } else {
        button.addEventListener('click', (event) => { //cahnge my button state if it is in my cart
          event.target.innerText = 'In Cart';
          event.target.disabled = true;
        })
      }
    }) 
  }
}

//local storage
class Storage {
  static saveProducts(products){
    localStorage.setItem('products', JSON.stringify(products))
  }
}

//Event Listener
document.addEventListener('DOMContentLoaded', () => {
  const ui = new UI()
  const products = new Products()

  //get all products
  products.getProducts().then(products => {
    ui.displayProducts(products)
    Storage.saveProducts(products);

  }).then(() => {
    ui.getBagButtons();
  });
})
