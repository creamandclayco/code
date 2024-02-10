(function() {


var cc_nav = document.querySelector('.navbar');

function updateNavHeightVar(){
    var newHeight = cc_nav.offsetHeight + 'px';
    document.documentElement.style.setProperty('--nav-height', newHeight);
}

if (document.querySelector('.navbar')){
    updateNavHeightVar();
}

function debounce(func, wait) {
    var timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

window.addEventListener('resize', debounce(updateNavHeightVar, 200));



if (cc_nav){
    var menuButton = document.querySelector('.menu-button');
    var body = document.querySelector('body');
    menuButton.addEventListener('touchstart', function(){
        body.classList.toggle('body--mobile-nav-open');
    })
}


})();
