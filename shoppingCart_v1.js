 //SHOPPING CART

  //1. Render in Nav
  function renderNavCart(changeItem){
    let navCart = document.querySelector("#navCart");
    if (navCart){
      const cartFromStorage = JSON.parse(localStorage.getItem('shoppingCart')) || [];
      if (cartFromStorage){
        let cartLength = cartFromStorage.length;
        if (changeItem === 'remove'){
          cartLength--;
        }
        if (changeItem === 'add'){
            cartLength++;
        }
        if (cartLength !== 0){
          navCart.style.opacity = 1;
          navCart.innerHTML = cartLength;
        } else {
          navCart.style.opacity = 0;
        }
      }
    }
  }

  renderNavCart();

  //2. Add items from shop pages

  function addToCart(){
    let itemData = {};
    let itemTitle = document.querySelector("[item-title]").getAttribute('item-title');
    let itemSlug = document.querySelector("[item-slug]").getAttribute('item-slug');
    let itemQuantityType = document.querySelector("[item-quantity-type]").getAttribute('item-quantity-type');
    let itemCollection = document.querySelector("[form_item='collection']").value;
    let itemQuantityLarge = document.querySelector("[form_item='quantity']").value;
    let itemQuantitySmall = document.querySelector("[form_item='quantity-small']").value;
    let itemPaper = document.querySelector("[form_item='paper']").value;
    let priceBase = document.querySelector("[form_item_base_price]").getAttribute("form_item_base_price");
    let priceFinal = document.querySelector("[form_item_final_price]").getAttribute("form_item_final_price");
    let itemUrl = window.location.href; 
    let itemEnvelopeAddressing = document.querySelector("input[name='Envelope-Addressing']:checked");

    if (itemEnvelopeAddressing){
      itemEnvelopeAddressing = itemEnvelopeAddressing.value
    }

    itemData.title = itemTitle;
    itemData.slug = itemSlug;
    itemData.collection = itemCollection;
    itemData.quantity = itemQuantityType == "Large" ? itemQuantityLarge : itemQuantitySmall;
    itemData.quantityType = itemQuantityType;
    itemData.paper = itemPaper;
    itemData.basePrice = priceBase;
    itemData.price = priceFinal;
    itemData.url = itemUrl; 
    itemData.envelopeAddressing = itemEnvelopeAddressing;

    console.log("data ", itemData);
    addToLocalStorage(itemData)
  }

  function addToLocalStorage(item) {
    const existingCart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    let itemAlreadyExists = false;
    existingCart.forEach( cartItem => {
      if (cartItem.collection === item.collection && cartItem.paper === item.paper && cartItem.slug === item.slug){
        //if adding them will stay under max amount, combine. 
        if (item.quantityType === 'Large' && parseInt(cartItem.quantity) + parseInt(item.quantity) <= 280
          || item.quantityType === 'Small' && parseInt(cartItem.quantity) + parseInt(item.quantity) <= 20){
          itemAlreadyExists = true;
          cartItem.quantity = parseInt(cartItem.quantity) + parseInt(item.quantity);
          cartItem.price = calculateShoppingCartItemPrice(cartItem.basePrice, cartItem.paper, cartItem.quantity, cartItem.envelopeAddressing);
          console.log("updated price is ", cartItem.price);
        }
      }
    })
    if (!itemAlreadyExists){
      existingCart.push(item);
      renderNavCart('add');
    } 
    localStorage.setItem('shoppingCart', JSON.stringify(existingCart));
  }

  
  function removeFromLocalStorage(itemSlug) {
    const existingCart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    const itemIndexToRemove = existingCart.findIndex(cartItem => cartItem.slug === itemSlug);
    if (itemIndexToRemove !== -1) {
      existingCart.splice(itemIndexToRemove, 1);
      localStorage.setItem('shoppingCart', JSON.stringify(existingCart));
    }
  }

  function setupAddToCartButton(){
    let addToCartButton = document.querySelector(".add-to-cart-button");
    if (addToCartButton){
      addToCartButton.addEventListener('click', function(e){
        e.preventDefault();
        if (!addToCartButton.classList.contains('disabled')){
          addToCart();
          addToCartButton.querySelector('.add-to-cart-text').innerHTML = "Added";
          addToCartButton.classList.add('shopping-cart-add');
          window.setTimeout(() => {
            addToCartButton.classList.remove('shopping-cart-add');
            addToCartButton.querySelector('.add-to-cart-text').innerHTML = "Add to cart";
          }, 2000)
        }
      })
    }
  }

  if (typeof localStorage !== 'undefined') {
    setupAddToCartButton()
  } else {
    console.error("Shopping cart no supported because no localStorage");
    if (document.querySelector(".add-to-cart-button")) {
      document.querySelector(".add-to-cart-button").innerHTML = "Shopping cart unavailable"
    }
  }


  //3. Render Cart Page
  function renderCartItem(item){

    let cartItem = document.querySelector('.shopping_cart_library .shopping_cart_row');
    let cartRender = document.querySelector('.shopping_cart_render');

    if (!cartItem || !cartRender) return;

    let newItem = cartItem.cloneNode(true);
    if (item.url){
      newItem.querySelector('.shopping_cart_item-link').href = item.url;
    }
    newItem.querySelector('.shopping_cart_title').innerHTML = item.title;
    newItem.querySelector('.shopping_cart_collection').innerHTML = item.collection;
    newItem.querySelector('.shopping_cart_paper').innerHTML = item.paper;
    newItem.querySelector('.shopping_cart_price').innerHTML = '$' + item.price;
    newItem.querySelector('.shopping_cart_price').setAttribute('data-price', item.price);

    let quantityField = null;
    let quantity_Small = newItem.querySelector('.shopping_cart_quantity-small');
    let quantity_Large = newItem.querySelector('.shopping_cart_quantity-large');

    if (item.quantityType === 'Large'){
      quantity_Large.style.display = "block";
      quantity_Small.style.display = "none";
      quantity_Large.value = item.quantity;
      quantityField = quantity_Large;
    } else {
      quantity_Small.style.display = "block";
      quantity_Large.style.display = "none";
      quantity_Small.value = item.quantity;
      quantityField = quantity_Small;
    }

    quantityField.addEventListener('change', function(){
      let newQuantity = parseInt(quantityField.value);
      let newPrice = calculateShoppingCartItemPrice(item.basePrice, item.paper, newQuantity, item.envelopeAddressing);
      newItem.querySelector('.shopping_cart_price').innerHTML = '$' + newPrice;
      newItem.querySelector('.shopping_cart_price').setAttribute('data-price', newPrice);
      renderShoppingCartTotal();
    })

    newItem.querySelector('.shopping_cart_remove').addEventListener("click", function(){
      renderNavCart('remove');
      newItem.remove();
      removeFromLocalStorage(item.slug);
      renderShoppingCartTotal();
    })

    cartRender.appendChild(newItem);
  }

  function calculateShoppingCartItemPrice(price, paper, quantity, envelopeAddressing){
    
    let newPrice = parseFloat(price);
    let newPriceDiscount = null;
    
    //two cents off per item for smooth
    if (paper === "Smooth Cardstock"){
      newPrice = newPrice - 0.02;
    }

    newPrice = newPrice * quantity;

    if (envelopeAddressing){
      newPrice = newPrice * 1.25;
    }
    
    return newPrice = Math.round((newPrice) * 100 ) / 100;
  }


  function renderShoppingCartTotal(){
    const cartTotalPrice = document.querySelector('.shopping_cart_total-text');
    let cartItems = document.querySelectorAll('.shopping_cart_row') ?? [];
    let totalCost = 0;

    cartItems.forEach( item => {
      let itemPrice = item.querySelector('[data-price]')?.getAttribute('data-price');
      if (itemPrice){
        itemPrice = parseFloat(itemPrice);
        totalCost = totalCost + itemPrice;
      }
    })

    let finalPrice = Math.round(totalCost * 100 ) / 100;
    var formattedPrice = finalPrice.toLocaleString('en-US', {
      style: 'decimal'
    });
    cartTotalPrice.innerHTML = formattedPrice;
  }


  function renderShoppingCart(){
    const cartData = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    const cartEmptyText = document.querySelector('.shopping-cart-empty');
    if (cartData.length === 0){
      cartEmptyText.style.display = "block";
    }
    cartData.forEach((item) => {
        renderCartItem(item);
    });
    renderShoppingCartTotal()
  }


  if (document.querySelector('[data-page="shopping-cart"]')) {
    renderShoppingCart();
  }

  // function handleCartSubmit(){
  //   let totalQuote = document.querySelector('.shopping_cart_total-text')?.innerHTML;
  //   localStorage.setItem('totalQuote', JSON.stringify(totalQuote));
  // }

  //4. Webflow Autofill Quote

  function autofillQuoteForm(){
    const cartData = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    //const totalQuote = JSON.parse(localStorage.getItem('totalQuote')) || null;
    let totalQuote = document.querySelector('.shopping_cart_total-text')?.innerHTML;
    const form = document.querySelector('#quoteForm');

    if (cartData.length > 0 && totalQuote.length > 0 && form){

      //paper type auto-checks
      cartData.forEach((item) => {
        if ( document.querySelector(`#form_${item.slug}`)){
          document.querySelector(`#form_${item.slug} input`).checked = true;
          document.querySelector(`#form_${item.slug} .checkbox`).classList.add('w--redirected-checked');
        } else {
          console.warn(`Query for ${item.slug} is broken`);
        }
      });

      //collections
      let collectionInput = document.querySelector('#Collection-Style');
      let chosenCollection = null;
      if (collectionInput){
        cartData.forEach((item) => {
          if (chosenCollection === null && item.collection !== null){
            chosenCollection = item.collection;
          }
          else if (chosenCollection !== item.collection){
            chosenCollection = 'Mixed'
          }
        })
        collectionInput.value = chosenCollection;
      }

      //log hidden details
      let quotedTotal = document.querySelector('#form_totalQuote');
      quotedTotal.innerHTML = totalQuote;
      let cartDetails = document.querySelector('#form_cartDetails');
      let details = "";
      cartData.forEach((item) => {
        details = `${details} || ${item.quantity} ${item.title} in ${item.collection} ${item.paper}`
      })
      cartDetails.innerHTML = details;
    }
  }

  if (document.querySelector('#cartSubmit')){
    let cartSubmitButton = document.querySelector('#cartSubmit');
    cartSubmitButton.addEventListener('click', function(){
      autofillQuoteForm();
    })
    cartSubmitButton.addEventListener('keydown', function(e){
      if (e.key === 'Enter'){
        autofillQuoteForm();
      }
    })
  }

