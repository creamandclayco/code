(function() {


if (document.querySelector("#waxPricingForm")){


    //Webflow auto-remembers selects. Clear them out. 
    setTimeout(function() {
        document.querySelector("#Quantity").selectedIndex = 0;
    }, 200);


    var el_quantity = document.querySelector("[form_item='quantity']");
    var el_basePrice = document.querySelector("[form_item_base_price]")
    var el_finalPrice = document.querySelector("[form_item_final_price]");

    var basePrice = el_basePrice.getAttribute("form_item_base_price");
    var itemQuantityType = "Large"
    var itemQuantity = el_quantity.value;
    var activeQuantity = null;

    function calculatePrice(price, quantity){
        var newPrice = parseFloat(price);
        // var newPriceDiscount = null;
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
        var addToCartButton = document.querySelector(".add-to-cart-button");
        if (basePrice !== null && activeQuantity !== null && activeQuantity !== ""){
        var newPrice = calculatePrice(basePrice, activeQuantity);
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
    var waxColors = document.querySelector('.shop_wax-colors');
    var activeColorText = document.querySelector('.shop_wax-title-active-type');
    var waxesOnMockup = document.querySelectorAll('.shop_view_wax');

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
        var startingActiveWaxColor = document.querySelector('input[name="Wax-Color"]:checked');
        if (startingActiveWaxColor){
            activeColorText.innerHTML = startingActiveWaxColor.value;
        }
        waxColors.addEventListener('change', function(e){
            activeColorText.innerHTML = e.target.value;
            updateWaxSealMockup(e.target.value)
        })
    }


    var waxDesigns = document.querySelector('.shop_wax-designs');
    var activeDesignText = document.querySelector('.shop_wax-design-title-active-type');

    //Wax Design active text 
    if (waxDesigns && activeDesignText){
        var startingActiveWaxDesign = document.querySelector('input[name="Wax-Design"]:checked');
        if (startingActiveWaxDesign){
            activeDesignText.innerHTML = startingActiveWaxDesign.value;
        }
        waxDesigns.addEventListener('change', function(e){
            activeDesignText.innerHTML = e.target.value;
        })
    }


}


})();
