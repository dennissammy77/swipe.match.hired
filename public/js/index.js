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
    // handle auth token from localstorage
    const authToken = localStorage.getItem("swipe.match.hired-accessToken");
    // remove login and signup button if user is logged in and show profile name after decoding authtoken
    if (authToken) {
        const decodedToken = JSON.parse(atob(authToken.split('.')[1]));
        const profileName = decodedToken.name;
        const authActionContainer = document.getElementById("auth-actions");
        authActionContainer.classList.remove("d-flex");
        authActionContainer.classList.add("d-none");
        
        
        const profileContainer = document.getElementById("auth-active-actions");
        profileContainer.classList.remove("d-none");

        const profileNameElement = document.getElementById("profile-name");
        profileNameElement.textContent = profileName;

        const profileButton = document.getElementById("profile-btn");
        profileButton.addEventListener("click", () => {
            window.location.href = "/profile";
        });
        // handle logout button
        const logoutButton = document.getElementById("logout-button");
        logoutButton.addEventListener("click", () => {
            localStorage.removeItem("swipe.match.hired-accessToken");
            window.location.href = "/";
        });
    } else {
        const authActionContainer = document.getElementById("auth-actions");
        authActionContainer.classList.remove("d-none");
        authActionContainer.classList.add("d-flex");
        
        const profileContainer = document.getElementById("auth-active-actions");
        profileContainer.classList.add("d-none");
    }
})