


  //GLOBAL VARS
  var cc_addToCartButton = document.querySelector(".add-to-cart-button");
  var cc_isShoppingCartPage = document.querySelector('[data-page="shopping-cart"]');
  var cc_cartSubmitButton = document.querySelector('#cartSubmit');
  var cc_quoteForm = document.querySelector('#quoteForm');
  var cc_quoteFormModalBtn = document.querySelector('.modal-open_btn');
  var cc_pricingForm = document.querySelector("#itemPricingForm");


  //SHOPPING CART

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
  
    itemData.title = itemTitle;
    itemData.slug = itemSlug;
    itemData.collection = itemCollection;
    itemData.quantity = itemQuantityType == "Large" ? itemQuantityLarge : itemQuantitySmall;
    itemData.quantityType = itemQuantityType;
    itemData.paper = itemPaper;
    itemData.basePrice = priceBase;
    itemData.price = priceFinal;
    itemData.url = itemUrl; 
  
    console.log("data ", itemData);
    addToLocalStorage(itemData)
  }

  
  function addToLocalStorage(item) {
    const existingCart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    let itemAlreadyExists = false;
    existingCart.forEach( cartItem => {
      if (cartItem.collection === item.collection && cartItem.paper === item.paper && cartItem.slug === item.slug){
        //if adding them will go over max select value, don't. 
        if (item.quantityType === 'Large' && parseInt(cartItem.quantity) + parseInt(item.quantity) <= 280
          || item.quantityType === 'Small' && parseInt(cartItem.quantity) + parseInt(item.quantity) <= 20){
          itemAlreadyExists = true;
          cartItem.quantity = parseInt(cartItem.quantity) + parseInt(item.quantity);
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
    if (cc_addToCartButton) {
      cc_addToCartButton.innerHTML = "Shopping cart unavailable"
    }
  }

  
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
        let newPrice = calculateShoppingCartItemPrice(item.basePrice, item.paper, newQuantity);
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

  function calculateShoppingCartItemPrice(price, paper, quantity){
    
      let newPrice = parseFloat(price);
      let newPriceDiscount = null;
      
      //two cents off per item for smooth
      if (paper === "Smooth Cardstock"){
        newPrice = newPrice - 0.02;
      }
      
      //multiply by quantity
      return newPrice = Math.round((newPrice * quantity) * 100 ) / 100;
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


  function handleCartSubmit(){
    let totalQuote = document.querySelector('.shopping_cart_total-text')?.innerHTML;
    localStorage.setItem('totalQuote', JSON.stringify(totalQuote));
    //window.location.href = "/contact?autofill"
  }


  if (cc_isShoppingCartPage) {
    renderShoppingCart();
  }
  if (cc_cartSubmitButton){
    cc_cartSubmitButton.addEventListener('click', function(){
      handleCartSubmit();
    })
    cc_cartSubmitButton.addEventListener('keydown', function(e){
      if (e.key === 'Enter'){
        handleCartSubmit();
      }
    })
  }


  //Webflow Autofill Quote

  function autofillQuoteForm(){
    const cartData = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    const totalQuote = JSON.parse(localStorage.getItem('totalQuote')) || null;
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


  if (cc_quoteForm && cc_quoteFormModalBtn){
    cc_quoteFormModalBtn.addEventListener('click', function(){
      autofillQuoteForm();
    })
  }
  

    // ITEM PRICING
    if (cc_pricingForm){
  
      //Webflow auto-remembers selects. Clear them out. 
      setTimeout(function() {
        document.querySelector("#Quantity").selectedIndex = 0;
        document.querySelector("#Quantity-Small").selectedIndex = 0;
        document.querySelector("#Paper").selectedIndex = 0;
      }, 200);

      let el_collection = document.querySelector("[form_item='collection']");
      let el_quantityLarge = document.querySelector("[form_item='quantity']");
      let el_quantitySmall = document.querySelector("[form_item='quantity-small']");
      let el_quantity;
      let el_paper = document.querySelector("[form_item='paper']");
      let el_finalPrice = document.querySelector("[form_item_final_price]");

      let itemSlug = document.querySelector("[item-slug]").getAttribute('item-slug');
      let priceBase = document.querySelector("[form_item_base_price]").getAttribute("form_item_base_price");
      let itemCollection = el_collection.value;
      let itemQuantityLarge = el_quantityLarge.value;
      let itemQuantitySmall = el_quantitySmall.value;
      let itemQuantityType = document.querySelector("[item-quantity-type]").getAttribute('item-quantity-type');
      let itemQuantity = itemQuantityType === 'Large' ? itemQuantityLarge : itemQuantitySmall;
      el_quantity = itemQuantityType === 'Large' ? el_quantityLarge : el_quantitySmall;

      console.log("el_quantity ", el_quantity)

      let activeCollection = itemCollection;
      let activeQuantity = null;
      let activePaper = null;
      let basePrice = priceBase;

  
      if (itemQuantityType === 'Small'){
        el_quantityLarge.style.display = "none";
      } else {
        el_quantitySmall.style.display = "none";
      }


      function calculatePrice(price, quantity, paper){
          let newPrice = parseFloat(price);
          let newPriceDiscount = null;
          //two cents off per item for smooth
          if (paper === "Smooth Cardstock"){
            newPrice = newPrice - 0.02;
          }
          //multiply by quantity
          return newPrice = Math.round((newPrice * quantity) * 100 ) / 100;
      }

      
      function updatePriceOnPage(){
        if (basePrice !== null && activeCollection !== null && activeQuantity !== null && activeQuantity !== "" && activePaper !== null && activePaper !== ""){
          let newPrice = calculatePrice(basePrice, activeQuantity, activePaper);
          if (!isNaN(newPrice)){
              el_finalPrice.textContent = newPrice;
              el_finalPrice.setAttribute('form_item_final_price', newPrice)
              if (newPrice !== 0 && cc_addToCartButton){
                cc_addToCartButton.classList.remove('disabled');
              } else {
                if (cc_addToCartButton){
                  cc_addToCartButton.classList.add('disabled');
                }
              }
            } else {
              el_finalPrice.textContent = "Sorry, an error has occured.";
          }    
        }
        else {
          console.log("Not all fields filled out to update price")
        }
      }
  
      updatePriceOnPage();
      
      el_collection.addEventListener("change", function () {
        activeCollection = el_collection.value;
        console.log('update collection with ', activeCollection)
        updatePriceOnPage();
      });
      
      el_quantity.addEventListener("change", function () {
        activeQuantity = parseInt(el_quantity.value);
        console.log('update collection with ', activeQuantity)
        updatePriceOnPage();
      });
      
      el_paper.addEventListener("change", function () {
        activePaper = el_paper.value;
        console.log('update collection with ', activePaper)
        updatePriceOnPage();
      });
      



    // ENVELOPE COLORS
    let envelopeColors = document.querySelector('.shop_envelope-colors');
    let activeColorText = document.querySelector('.shop_envelope-title-active-type');

    let envelopeLibrary = {
      'White': {
        bg: '#fff',
        colorMatrix1: '0 0 0 0 0.827451 0 0 0 0 0.827451 0 0 0 0 0.827451 0 0 0 0.8 0',
        colorMatrix2: '0 0 0 0 0.827451 0 0 0 0 0.827451 0 0 0 0 0.827451 0 0 0 0.8 0',
      },
      'Cipria': {
        bg: '#F6D2CE',
        colorMatrix1: '0 0 0 0 0.811765 0 0 0 0 0.686275 0 0 0 0 0.670588 0 0 0 0.6 0',
        colorMatrix2: '0 0 0 0 0.811422 0 0 0 0 0.685322 0 0 0 0 0.670037 0 0 0 0.8 0',
      },
      'Ivory': {
        bg: '#F7F7F5',
        colorMatrix1: '0 0 0 0 0.831373 0 0 0 0 0.831373 0 0 0 0 0.784314 0 0 0 0.8 0',
        colorMatrix2: '0 0 0 0 0.831225 0 0 0 0 0.831225 0 0 0 0 0.785647 0 0 0 0.8 0',
      }
    }
 

    if (envelopeColors && activeColorText && envelopeSVG){
      let activeEnvelopeColor = '#fff';
      let startingActiveEnvelopeColor = document.querySelector('input[name="Envelope-Color"]:checked');
      let envelopeSVG_paths = envelopeSVG.querySelectorAll('path');
      let envelopeSVG_colorMatrix1 = envelopeSVG.querySelector('.colorMatrix1');
      let envelopeSVG_colorMatrix2 = envelopeSVG.querySelectorAll('.colorMatrix2');

      //TODO get only the releveant envelope
      let envelopeSVG = document.querySelector('.shop_envelope-svg[data-slug="""]');
      let itemSlug = document.querySelector("[item-slug]").getAttribute('item-slug');
      
      if (startingActiveEnvelopeColor){
        activeColorText.innerHTML = startingActiveEnvelopeColor.value;
      }

      envelopeColors.addEventListener('change', function(e){

        activeColorText.innerHTML = e.target.value;
        let activeColor = envelopeLibrary[e.target.value];

        if (activeColor){
          envelopeSVG_paths.forEach( path => {
            path.style.fill = activeColor.bg;
          })
          envelopeSVG_colorMatrix1.setAttribute('values', activeColor.colorMatrix1);
          envelopeSVG_colorMatrix2.setAttribute('values', activeColor.colorMatrix2);
        } 
        else {
          console.error("Color selected is not in color library");
        }

      })
    }

    //Image switching
      let shopImage = document.querySelector("#shopImage");

      let letterist_bgColor = "#DFDBD3";
      let romantic_bgColor = "#ECE8E1";
      let modernist_bgColor = "#E5E3E0";
      
      let letterist_image = document.querySelector(".shop_view_image-letterist");
      let romantic_image = document.querySelector(".shop_view_image-romantic");
      let modernist_image = document.querySelector(".shop_view_image-modernist");
    
      function hideAllImages(){
        letterist_image.style.height = 0;
        romantic_image.style.height = 0;
        modernist_image.style.height = 0;
      }
    
      el_collection.addEventListener("change", function () {
        var activeCollection = el_collection.value;
        hideAllImages();
        if (activeCollection === "The Letterist"){
          letterist_image.style.height = "auto";
        }
        if (activeCollection === "The Romantic"){
          romantic_image.style.height = "auto";
        }
        if (activeCollection === "The Modernist"){
          modernist_image.style.height = "auto";
        }
        
      });

//Update Breadcrumb and Image if coming from a collection with param set
      
      function getUrlParameter(name) {
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(window.location.href);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
      }
  
      var fromCollectionParam = getUrlParameter("from-collection");
  
      if (fromCollectionParam) {
        // Find all elements with class ".breadcrumb-parent"
        var breadcrumbParents = document.querySelectorAll(".breadcrumb-parent");
  
        // Update the href attribute for each matching element
        breadcrumbParents.forEach(function(element) {
          var newAnchor = document.createElement("a");
          if (fromCollectionParam === 'the-letterist'){
            newAnchor.href = "/collection/the-letterist";
            newAnchor.textContent = "The Letterist";
          }
          if (fromCollectionParam === 'the-romantic'){
            newAnchor.href = "/collection/the-romantic";
            newAnchor.textContent = "The Romantic";
          }
          if (fromCollectionParam === 'the-modernist'){
            newAnchor.href = "/collection/the-modernist";
            newAnchor.textContent = "The Modernist";
          }
          newAnchor.classList.add("breadcrumb-parent-link");
          element.parentNode.replaceChild(newAnchor, element);
     
        });
  
        //update the image
        hideAllImages();
        let collectionValue = '';

        if (fromCollectionParam === "the-letterist"){
          letterist_image.style.height = "auto";
          collectionValue = "The Letterist";
        }
        if (fromCollectionParam === "the-romantic"){
          romantic_image.style.height = "auto";
          collectionValue = "The Romantic";
        }
        if (fromCollectionParam === "the-modernist"){
          modernist_image.style.height = "auto";
          collectionValue = "The Modernist";
        }
  
        //update the select field
    
        if (fromCollectionParam)
        el_collection.value = collectionValue;
  
      }
  
  



      //TODO add in show illustration CTA






    }
    

    // COLLECTION DYNAMIC BREADCRUMB
    
    var collectionPage = document.querySelector("[active-collection]");
    // console.log("collectionPage ", collectionPage)
    
    if (collectionPage){
  
      var activeCollectionOnCollectionPage = collectionPage.getAttribute("active-collection");
      // console.log("activeCollection ", activeCollection)
  
      window.setTimeout(() => {
        var itemLinks = document.querySelectorAll(".collection-item-link");
        itemLinks.forEach( item => {
          item.href = item.href + `?from-collection=${activeCollectionOnCollectionPage}`
        })
  
      }, 200)
  
    }
    
