document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("mobile-menu-toggle");
    const closeMenuToggle = document.getElementById("close-mobile-menu-toggle");
    const mobileNav = document.getElementById("mobile-nav");
    
    menuToggle.addEventListener("click", () => {
        console.log('Menu toggle clicked!');
        mobileNav.classList.toggle("d-none");
    });
    closeMenuToggle.addEventListener("click", () => {
        console.log('Menu toggle clicked!');
        mobileNav.classList.toggle("d-none");
    });
})