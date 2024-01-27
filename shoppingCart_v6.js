
//SHOPPING CART


  //1. Render cart number in Nav
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
        if (changeItem === 'clear'){
          cartLength = 0;
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

    /* Cart Versions
        1.2 - added id 
        1.1 - added wax 
    */
   let cartVersion = "1.2";

    //PAPER
    if (document.querySelector("#itemPricingForm")){
        let item = cc_getPaperItem();
        item.cartVersion = cartVersion 
        addToLocalStorage(item)
    }

    //WAX
    if (document.querySelector("#waxPricingForm")){
        let item = cc_getWaxItem();
        item.cartVersion = cartVersion
        addToLocalStorage(item)
    }

  }

  function addToLocalStorage(item) {
    const existingCart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    let itemAlreadyExists = false;
    existingCart.forEach( cartItem => {
        if (cartItem.id === item.id){
            //if adding them will stay under max amount, combine. 
            if (item.quantityType === 'Large' && parseInt(cartItem.quantity) + parseInt(item.quantity) <= 280
            || item.quantityType === 'Small' && parseInt(cartItem.quantity) + parseInt(item.quantity) <= 20){
                itemAlreadyExists = true;
                let newQuantity = parseInt(cartItem.quantity) + parseInt(item.quantity);
                cartItem.price = cc_calculatePricing(cartItem, newQuantity);
                cartItem.quantity = newQuantity;
            }
        }
    })
    if (!itemAlreadyExists){
      existingCart.push(item);
      renderNavCart('add');
    } 
    localStorage.setItem('shoppingCart', JSON.stringify(existingCart));
  }

  function updateQuantityInLocalStorage(item, newQuantity) {
    const existingCart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    existingCart.forEach( cartItem => {
        if (cartItem.id === item.id && cartItem.quantity === item.quantity){
            cartItem.quantity = newQuantity;
        }
    })
    localStorage.setItem('shoppingCart', JSON.stringify(existingCart));
  }
  
  function removeFromLocalStorage(itemId, itemQuantity) {
    const existingCart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    const itemIndexToRemove = existingCart.findIndex(cartItem => cartItem.id === itemId && cartItem.quantity === itemQuantity);
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
    newItem.querySelector('.shopping_cart_collection').innerHTML = item.collection ?? "";
    newItem.querySelector('.shopping_cart_paper').innerHTML = item.paper ?? "";
    newItem.querySelector('.shopping_cart_price').innerHTML = '$' + item.price;
    newItem.querySelector('.shopping_cart_price').setAttribute('data-price', item.price);

    if (item.type === "Paper" || item.type === undefined) {
      newItem.querySelector('.shopping_cart_envelope-color').innerHTML = item.envelopeColor;
    } 
    if (item.type === "Wax") {
      newItem.querySelector('.shopping_cart_envelope-color').innerHTML = item.waxColor;
      let label = document.querySelector('[data-cart-label="color"]');
      if (label) label.innerHTML = "Envelope/Wax Color";
    } 
   
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

    quantityField.addEventListener('change', function(e){
      let newQuantity = parseInt(e.target.value);
      updateQuantityInLocalStorage(item, newQuantity)
      let newPrice = cc_calculatePricing(item, newQuantity);
      newItem.querySelector('.shopping_cart_price').innerHTML = '$' + newPrice;
      newItem.querySelector('.shopping_cart_price').setAttribute('data-price', newPrice);
      renderShoppingCartTotal();
    })

    newItem.querySelector('.shopping_cart_remove').addEventListener("click", function(){
      renderNavCart('remove');
      newItem.remove();
      removeFromLocalStorage(item.id, item.quantity);
      renderShoppingCartTotal();
    })

    cartRender.appendChild(newItem);
  }


  function renderShoppingCartTotal(){
    const cartTotalPrice = document.querySelector('.shopping_cart_total-text');
    let cartItems = document.querySelectorAll('.shopping_cart_row:not(.shopping_cart_row-labels)') ?? [];
    let totalCost = 0;

    cartItems.forEach( item => {
      let itemPrice = item.querySelector('[data-price]');
      if (itemPrice){
        itemPrice = itemPrice.getAttribute('data-price');
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
    //Clear any old rows
    let oldRows = document.querySelectorAll('.shopping_cart_render .shopping_cart_row:not(.shopping_cart_row-labels)');
    oldRows.forEach( row => {
      row.remove();
    })

    //Add new
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


//4. Watch for form success message

  var successElement = document.querySelector('.success-container');

  function clearCartAfterSubmission(){
    localStorage.setItem('shoppingCart', JSON.stringify(""));
    renderShoppingCart();
    renderNavCart('clear');
  }

  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.attributeName === "style") {
        var displayValue = successElement.style.display;
        if (displayValue === "block") {
          clearCartAfterSubmission()
        }
      }
    });
  });
  var config = { attributes: true };
  if (document.querySelector('#submitQuoteBtn')){
    observer.observe(successElement, config);
  }





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
          else if (chosenCollection !== item.collection && item.collection !== null){
            chosenCollection = 'Mixed'
          }
        })
        collectionInput.value = chosenCollection;
      }

      //log details 
      let quotedTotal = document.querySelector('#form_totalQuote');
      quotedTotal.innerHTML = totalQuote;
      let cartDetails = document.querySelector('#form_cartDetails');
      let cartDetailsRow = document.querySelector('.form-cart-details');
      let details = "";
      cartData.forEach((item) => {
        if (item.type === 'Paper'){
            let envelopeColorDetails = item.envelopeColor ? ` with ${item.envelopeColor} envelopes.` : '';
            details = `${details} ${item.quantity} ${item.title} in ${item.collection} ${item.paper} ${envelopeColorDetails} || `;
        }
        if (item.type === 'Wax'){
            details = `${details} ${item.quantity} ${item.waxColor} Wax Seals with a ${item.waxDesign} design || `;
        }

      })
      cartDetails.innerHTML = details;
      cartDetailsRow.style.display = 'flex';
    }

  }

  if (document.querySelector('#startQuoteBtn')){
    let startQuoteButton = document.querySelector('#startQuoteBtn');
    startQuoteButton.addEventListener('click', function(){
      autofillQuoteForm();
    })
    startQuoteButton.addEventListener('keydown', function(e){
      if (e.key === 'Enter'){
        autofillQuoteForm();
      }
    })
  }
