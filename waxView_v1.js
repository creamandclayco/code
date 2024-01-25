
if (document.querySelector("#waxPricingForm")){


    //Webflow auto-remembers selects. Clear them out. 
    setTimeout(function() {
        document.querySelector("#Quantity").selectedIndex = 0;
    }, 200);


    let el_quantity = document.querySelector("[form_item='quantity']");
    let el_basePrice = document.querySelector("[form_item_base_price]")
    let el_finalPrice = document.querySelector("[form_item_final_price]");

    let basePrice = el_basePrice.getAttribute("form_item_base_price");
    let itemQuantityType = "Large"
    let itemQuantity = el_quantity.value;
    let activeQuantity = null;

    function calculatePrice(price, quantity){
        let newPrice = parseFloat(price);
        // let newPriceDiscount = null;
        // if (paper === "Smooth Cardstock"){
        // newPrice = newPrice - 0.02;
        // }
        newPrice = Math.round((newPrice * quantity) * 100 ) / 100;
        // if (hasEnvelopeAddressing){
        // newPrice = newPrice * 1.25;
        // }
        // return newPrice = Math.round((newPrice) * 100 ) / 100;
        return newPrice;
    }

    function updatePriceOnPage(){
        let addToCartButton = document.querySelector(".add-to-cart-button");
        if (basePrice !== null && activeQuantity !== null && activeQuantity !== ""){
        let newPrice = calculatePrice(basePrice, activeQuantity);
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
        else {
        //   console.log("Not all fields filled out to update price")
        }
    }

    updatePriceOnPage();

    el_quantity.addEventListener("change", function () {
        activeQuantity = parseInt(el_quantity.value);
        updatePriceOnPage();
    });



    // WAX SEAL MOCKUP
    let waxColors = document.querySelector('.shop_wax-colors');
    let activeColorText = document.querySelector('.shop_wax-title-active-type');
    let waxesOnMockup = document.querySelectorAll('.shop_view_wax');

    function updateWaxSealMockup(value){
        waxesOnMockup.forEach( wax => {
            if (wax.getAttribute('data-value') === value){
                wax.style.display = "block"
            } else {
                wax.style.display = "none"
            }
        })
    }

    if (waxColors){
        updateWaxSealMockup("White");
    }

    //Wax Color active text 
    if (waxColors && activeColorText){
        let startingActiveWaxColor = document.querySelector('input[name="Wax-Color"]:checked');
        if (startingActiveWaxColor){
            activeColorText.innerHTML = startingActiveWaxColor.value;
        }
        waxColors.addEventListener('change', function(e){
            activeColorText.innerHTML = e.target.value;
            updateWaxSealMockup(e.target.value)
        })
    }


    let waxDesigns = document.querySelector('.shop_wax-designs');
    let activeDesignText = document.querySelector('.shop_wax-design-title-active-type');

    //Wax Design active text 
    if (waxDesigns && activeDesignText){
        let startingActiveWaxDesign = document.querySelector('input[name="Wax-Design"]:checked');
        if (startingActiveWaxDesign){
            activeDesignText.innerHTML = startingActiveWaxDesign.value;
        }
        waxDesigns.addEventListener('change', function(e){
            activeDesignText.innerHTML = e.target.value;
        })
    }


}
