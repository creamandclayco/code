

(function() {

  if (document.querySelector("#itemPricingForm")){
  
  
  //Webflow auto-remembers selects. Clear them out. 
  setTimeout(function() {
      if (document.querySelector("#Quantity")){
          document.querySelector("#Quantity").selectedIndex = 0;
      }
      if (document.querySelector("#Quantity-Small")){
          document.querySelector("#Quantity-Small").selectedIndex = 0;
      }
      if (document.querySelector("#Paper")){
          document.querySelector("#Paper").selectedIndex = 0;
      }
  }, 200);
  
  
  var el_collection = document.querySelector("[form_item='collection']");
  var el_quantityLarge = document.querySelector("[form_item='quantity']");
  var el_quantitySmall = document.querySelector("[form_item='quantity-small']");
  var el_quantity;
  var el_paper = document.querySelector("[form_item='paper']");
  var el_finalPrice = document.querySelector("[form_item_final_price]");
  var el_envelopeAddressing = document.querySelector("input[name='Envelope-Addressing']:checked");
  
  var itemSlug = document.querySelector("[item-slug]").getAttribute('item-slug');
  var priceBase = document.querySelector("[form_item_base_price]").getAttribute("form_item_base_price");
  var itemCollection = el_collection.value;
  var itemQuantityLarge = el_quantityLarge.value;
  var itemQuantitySmall = el_quantitySmall.value;
  var itemQuantityType = document.querySelector("[item-quantity-type]").getAttribute('item-quantity-type');
  var itemQuantity = itemQuantityType === 'Large' ? itemQuantityLarge : itemQuantitySmall;
  var hasEnvelopeAddressing = false;
  el_quantity = itemQuantityType === 'Large' ? el_quantityLarge : el_quantitySmall;
  if (el_envelopeAddressing){
  hasEnvelopeAddressing = el_envelopeAddressing.value
  }
  
  var activeCollection = itemCollection;
  var activeQuantity = null;
  var activePaper = null;
  var basePrice = priceBase;
  
  if (itemQuantityType === 'Small'){
      el_quantityLarge.style.display = "none";
  } else {
      el_quantitySmall.style.display = "none";
  }
  
  
  function calculatePrice(price, quantity, paper, hasEnvelopeAddressing){
      var newPrice = parseFloat(price);
      var newPriceDiscount = null;
      if (paper === "Smooth Cardstock"){
      newPrice = newPrice - 0.02;
      }
      newPrice = Math.round((newPrice * quantity) * 100 ) / 100;
      if (hasEnvelopeAddressing){
      newPrice = newPrice * 1.25;
      }
      return newPrice = Math.round((newPrice) * 100 ) / 100;
  }
  
  function updatePriceOnPage(){
      var addToCartButton = document.querySelector(".add-to-cart-button");
      if (basePrice !== null && activeCollection !== null && activeQuantity !== null && activeQuantity !== "" && activePaper !== null && activePaper !== ""){
          var item = { 
              type: "Paper",
              slug: itemSlug,
              quantity: activeQuantity,
              paper: activePaper,
              basePrice: basePrice,
              envelopeAddressing: hasEnvelopeAddressing
          } 
          var newPrice = cc_calculatePricing(item)
  
          if (!isNaN(newPrice)){
              el_finalPrice.textContent = newPrice;
              el_finalPrice.setAttribute('form_item_final_price', newPrice)
              if (newPrice !== 0 && addToCartButton){
                  addToCartButton.classList.remove('disabled');
              } else {
                  if (addToCartButton){
                  addToCartButton.classList.add('disabled');
                  }
              }
              } else {
              el_finalPrice.textContent = "Sorry, an error has occured.";
          }    
      }
    }
  
  /* User Faves in progress */
  function updateUserFavesLocalStorage(type, value){
      const existingFaves = JSON.parse(localStorage.getItem('userFaves')) || [];
      var itemAlreadyExists = false;
      var item = {
          'type':type, 
          'value':value
      }
      existingFaves.forEach( cartItem => {
          if (cartItem.type === type){
              itemAlreadyExists = true;
              cartItem.value = value;
          }
      })
      if (!itemAlreadyExists){
          existingFaves.push(item);
      } 
      localStorage.setItem('userFaves', JSON.stringify(existingFaves));
  }
  
  updatePriceOnPage();
  
  el_collection.addEventListener("change", function () {
      activeCollection = el_collection.value;
      updatePriceOnPage();
      updateUserFavesLocalStorage('collection', activeCollection)
  });
  
  el_quantity.addEventListener("change", function () {
      activeQuantity = parseInt(el_quantity.value);
      updatePriceOnPage();
  });
  
  el_paper.addEventListener("change", function () {
      activePaper = el_paper.value;
      updatePriceOnPage();
  });
  
  if (el_envelopeAddressing){
      var addressingRadios = document.querySelectorAll("input[name='Envelope-Addressing']");
      addressingRadios.forEach( radio => {
          radio.addEventListener("change", function () {
          addressingRadios.forEach( rad => {
              if (rad.checked){
              hasEnvelopeAddressing = rad.value;
              updateUserFavesLocalStorage('envelopeColor', rad.value)
              }
          })
          updatePriceOnPage();
          });
      })
  }
  
  // ENVELOPE COLORS
  var envelopeColors = document.querySelector('.shop_envelope-colors');
  var activeColorText = document.querySelector('.shop_envelope-title-active-type');
  var pageSlug = document.querySelector(".shop_view_image-container").getAttribute('data-type')
  var envelopeSVG = document.querySelector(`#envelope--${pageSlug}`)
  
  var envelopeLibrary = {
    'White': {
      bg: '#fff', 
      colorMatrix1: '0 0 0 0 0.827451 0 0 0 0 0.827451 0 0 0 0 0.827451 0 0 0 0.8 0',
      colorMatrix2: '0 0 0 0 0.827451 0 0 0 0 0.827451 0 0 0 0 0.827451 0 0 0 0.8 0',
    },
    'Ivory': {
      bg: '#F7F7F5',
      colorMatrix1: '0 0 0 0 0.831373 0 0 0 0 0.831373 0 0 0 0 0.784314 0 0 0 0.8 0',
      colorMatrix2: '0 0 0 0 0.831225 0 0 0 0 0.831225 0 0 0 0 0.785647 0 0 0 0.8 0',
    },
    'Cobblestone': {
      bg: '#D0C7BC',
      colorMatrix1: '0 0 0 0 0.698039 0 0 0 0 0.666667 0 0 0 0 0.627451 0 0 0 0.8 0',
      colorMatrix2: '0 0 0 0 0.698039 0 0 0 0 0.666667 0 0 0 0 0.627451 0 0 0 0.8 0',
    },
    'Mist': {
      bg: '#EDE6D9',
      colorMatrix1: '0 0 0 0 0.776471 0 0 0 0 0.756863 0 0 0 0 0.729412 0 0 0 0.6 0',
      colorMatrix2: '0 0 0 0 0.775723 0 0 0 0 0.758786 0 0 0 0 0.729752 0 0 0 1 0',
    },
    'Biscuit': {
      bg: '#F6E6D7',
      colorMatrix1: '0 0 0 0 0.847059 0 0 0 0 0.776471 0 0 0 0 0.705882 0 0 0 0.6 0',
      colorMatrix2: '0 0 0 0 0.848929 0 0 0 0 0.77807 0 0 0 0 0.707211 0 0 0 1 0',
    },
    'Stone': {
      bg: '#E7D0B8',
      colorMatrix1: '0 0 0 0 0.796078 0 0 0 0 0.721569 0 0 0 0 0.639216 0 0 0 0.6 0',
      colorMatrix2: '0 0 0 0 0.795146 0 0 0 0 0.720487 0 0 0 0 0.639039 0 0 0 1 0',
    },
    'Blush': {
      bg: '#FBEFE2',
      colorMatrix1: '0 0 0 0 0.886275 0 0 0 0 0.835294 0 0 0 0 0.772549 0 0 0 0.6 0',
      colorMatrix2: '0 0 0 0 0.885496 0 0 0 0 0.835715 0 0 0 0 0.770998 0 0 0 1 0',
    },
    'Cipria': {
      bg: '#F6D2CE',
      colorMatrix1: '0 0 0 0 0.811765 0 0 0 0 0.686275 0 0 0 0 0.670588 0 0 0 0.6 0',
      colorMatrix2: '0 0 0 0 0.811422 0 0 0 0 0.685322 0 0 0 0 0.670037 0 0 0 0.8 0',
    },
    'Dusty Rose': {
      bg: '#DAA2A4',
      colorMatrix1: '0 0 0 0 0.741176 0 0 0 0 0.537255 0 0 0 0 0.545098 0 0 0 0.6 0',
      colorMatrix2: '0 0 0 0 0.742339 0 0 0 0 0.53698 0 0 0 0 0.544314 0 0 0 0.8 0',
    },
    'Rain': {
      bg: '#DED9CD',
      colorMatrix1: '0 0 0 0 0.72549 0 0 0 0 0.705882 0 0 0 0 0.635294 0 0 0 0.6 0',
      colorMatrix2: '0 0 0 0 0.725304 0 0 0 0 0.705436 0 0 0 0 0.634995 0 0 0 0.8 0',
    },
    'Mid Green': {
      bg: '#81886D',
      colorMatrix1: '0 0 0 0 0.443137 0 0 0 0 0.466667 0 0 0 0 0.380392 0 0 0 0.6 0',
      colorMatrix2: '0 0 0 0 0.423517 0 0 0 0 0.444506 0 0 0 0 0.363548 0 0 0 0.8 0',
    },
    'Dusty Blue': {
      bg: '#949DAA',
      colorMatrix1: '0 0 0 0 0.466667 0 0 0 0 0.498039 0 0 0 0 0.545098 0 0 0 0.6 0',
      colorMatrix2: '0 0 0 0 0.467591 0 0 0 0 0.498823 0 0 0 0 0.543934 0 0 0 0.8 0',
    }
  }
  
  
  if (envelopeSVG && envelopeColors && activeColorText){
      var activeEnvelopeColor = '#fff';
      var startingActiveEnvelopeColor = document.querySelector('input[name="Envelope-Color"]:checked');
      var envelopeSVG_rects = envelopeSVG.querySelectorAll('rect');
      var envelopeSVG_paths = envelopeSVG.querySelectorAll('path');
      var envelopeSVG_colorMatrix1 = envelopeSVG.querySelector('.colorMatrix1');
      var envelopeSVG_colorMatrix2 = envelopeSVG.querySelector('.colorMatrix2');
  
      if (startingActiveEnvelopeColor){
        activeColorText.innerHTML = startingActiveEnvelopeColor.value;
      }
  
      envelopeColors.addEventListener('change', function(e){
  
        activeColorText.innerHTML = e.target.value;
        var activeColor = envelopeLibrary[e.target.value];
  
        if (activeColor){
          envelopeSVG_rects.forEach( rect => {
            rect.style.fill = activeColor.bg;
          })
          envelopeSVG_paths.forEach( path => {
            path.style.fill = activeColor.bg;
          })
          if (envelopeSVG_colorMatrix1) envelopeSVG_colorMatrix1.setAttribute('values', activeColor.colorMatrix1);
          if (envelopeSVG_colorMatrix2) envelopeSVG_colorMatrix2.setAttribute('values', activeColor.colorMatrix2);
          
        } 
        else {
          console.error("Color selected is not in color library");
        }
  
      })
    }
  
  
        //Image switching
  var shopImage = document.querySelector("#shopImage");
  
  var letterist_image = document.querySelector(".shop_view_image-letterist"); 
  var ethereal_image = document.querySelector(".shop_view_image-ethereal"); 
  var romantic_image = document.querySelector(".shop_view_image-romantic");
  var classic_image = document.querySelector(".shop_view_image-classic");
  var poetic_image = document.querySelector(".shop_view_image-poetic");
  var modernist_image = document.querySelector(".shop_view_image-modernist");
  
  function hideAllImages(){
    letterist_image.style.height = 0; 
    romantic_image.style.height = 0;
    modernist_image.style.height = 0;
    ethereal_image.style.height = 0;
    classic_image.style.height = 0;
    poetic_image.style.height = 0;
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
    if (activeCollection === "The Ethereal"){
      ethereal_image.style.height = "auto";
    }
    if (activeCollection === "The Classic"){
      classic_image.style.height = "auto";
    }
    if (activeCollection === "The Poetic"){
      poetic_image.style.height = "auto";
    }
    
  });
  
  //Update Breadcrumb and Image if coming from a collection with param set
    var params = new URL(document.location).searchParams;
    var fromCollectionParam = params.get("collection");
    var breadcrumbParam = params.get("breadcrumb");
    var parentBreadcrumbLink = document.querySelector('.breadcrumb-parent-link');
    var currentItemSlug = document.querySelector('[item-slug]').getAttribute('item-slug');
  
    if (fromCollectionParam) {
  
      if (parentBreadcrumbLink){
          if (breadcrumbParam){
              parentBreadcrumbLink.href = "/collections/" +  breadcrumbParam;
              switch (breadcrumbParam){
                  case 'the-letterist' :
                      parentBreadcrumbLink.innerHTML = "The Letterist"; 
                      break;
                  case 'the-ethereal' :
                      parentBreadcrumbLink.innerHTML = "The Ethereal"; 
                      break;
                  case 'the-romantic' :
                      parentBreadcrumbLink.innerHTML = "The Romantic"; 
                      break;
                  case 'the-classic' :
                      parentBreadcrumbLink.innerHTML = "The Classic"; 
                      break;
                  case 'the-poetic' :
                      parentBreadcrumbLink.innerHTML = "The Poetic"; 
                      break;
                  case 'the-modernist' :
                      parentBreadcrumbLink.innerHTML = "The Modernist"; 
                      break;
              }
          }
          else {
              parentBreadcrumbLink.href = "/paper/" +  currentItemSlug;
          }
      }
  
      //update the image
      hideAllImages();
      var collectionValue = '';
  
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
      if (fromCollectionParam === 'the-ethereal'){
          ethereal_image.style.height = "auto";
          collectionValue = "The Ethereal";
      }
      if (fromCollectionParam === 'the-classic'){
          classic_image.style.height = "auto";
          collectionValue = "The Classic";
      }
      if (fromCollectionParam === 'the-poetic'){
          poetic_image.style.height = "auto";
          collectionValue = "The Poetic";
      }
  
      //update the select field
  
      if (fromCollectionParam)
          el_collection.value = collectionValue;
    }
  
  
  
  }
  
  })();
