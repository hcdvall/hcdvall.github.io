document.addEventListener("DOMContentLoaded", () => {
    const navbarPlaceholder = document.createElement("div");
    navbarPlaceholder.id = "navbar-placeholder";
    document.body.insertBefore(navbarPlaceholder, document.body.firstChild);

    fetch("./src/navbar.html")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load navbar: ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            navbarPlaceholder.innerHTML = data;

            // Add event listener for the mobile menu toggle
            const mobileMenu = document.getElementById("mobile-menu");
            const navbarMenu = document.querySelector(".navbar__menu");

            if (mobileMenu && navbarMenu) {
                mobileMenu.addEventListener("click", () => {
                    mobileMenu.classList.toggle("is-active");
                    navbarMenu.classList.toggle("active");
                });
            }
        })
        .catch(error => console.error(error));
});