if (document.querySelector("#itemPricingForm")){


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
    let el_envelopeAddressing = document.querySelector("input[name='Envelope-Addressing']:checked");

    let itemSlug = document.querySelector("[item-slug]").getAttribute('item-slug');
    let priceBase = document.querySelector("[form_item_base_price]").getAttribute("form_item_base_price");
    let itemCollection = el_collection.value;
    let itemQuantityLarge = el_quantityLarge.value;
    let itemQuantitySmall = el_quantitySmall.value;
    let itemQuantityType = document.querySelector("[item-quantity-type]").getAttribute('item-quantity-type');
    let itemQuantity = itemQuantityType === 'Large' ? itemQuantityLarge : itemQuantitySmall;
    let hasEnvelopeAddressing = false;
    el_quantity = itemQuantityType === 'Large' ? el_quantityLarge : el_quantitySmall;
    if (el_envelopeAddressing){
    hasEnvelopeAddressing = el_envelopeAddressing.value
    }

    let activeCollection = itemCollection;
    let activeQuantity = null;
    let activePaper = null;
    let basePrice = priceBase;

    if (itemQuantityType === 'Small'){
        el_quantityLarge.style.display = "none";
    } else {
        el_quantitySmall.style.display = "none";
    }

    
    function calculatePrice(price, quantity, paper, hasEnvelopeAddressing){
        let newPrice = parseFloat(price);
        let newPriceDiscount = null;
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
        if (basePrice !== null && activeCollection !== null && activeQuantity !== null && activeQuantity !== "" && activePaper !== null && activePaper !== ""){
          let newPrice = calculatePrice(basePrice, activeQuantity, activePaper, hasEnvelopeAddressing);
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

    /* User Faves in progress */
    function updateUserFavesLocalStorage(type, value){
        const existingFaves = JSON.parse(localStorage.getItem('userFaves')) || [];
        let itemAlreadyExists = false;
        let item = {
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
        let addressingRadios = document.querySelectorAll("input[name='Envelope-Addressing']");
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
    let envelopeColors = document.querySelector('.shop_envelope-colors');
    let activeColorText = document.querySelector('.shop_envelope-title-active-type');
    let pageSlug = document.querySelector(".shop_view_image-container").getAttribute('data-type')
    let envelopeSVG = document.querySelector(`#envelope--${pageSlug}`)

    let envelopeLibrary = {
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
        let activeEnvelopeColor = '#fff';
        let startingActiveEnvelopeColor = document.querySelector('input[name="Envelope-Color"]:checked');
        let envelopeSVG_paths = envelopeSVG.querySelectorAll('path');
        let envelopeSVG_colorMatrix1 = envelopeSVG.querySelector('.colorMatrix1');
        let envelopeSVG_colorMatrix2 = envelopeSVG.querySelector('.colorMatrix2');
  
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
      letterist_image.style.height = 0; //this is where the error occurs
      romantic_image.style.height = 0;
      modernist_image.style.height = 0;
    }
  
    el_collection.addEventListener("change", function () {
      var activeCollection = el_collection.value;
      hideAllImages();
      if (activeCollection === "The Letterist"){
        letterist_image.style.height = "auto";
        shopImage.style.backgroundColor = letterist_bgColor;
      }
      if (activeCollection === "The Romantic"){
        romantic_image.style.height = "auto";
        shopImage.style.backgroundColor = romantic_bgColor;
      }
      if (activeCollection === "The Modernist"){
        modernist_image.style.height = "auto";
        shopImage.style.backgroundColor = modernist_bgColor;
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



}
