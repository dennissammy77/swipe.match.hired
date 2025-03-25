document.addEventListener("DOMContentLoaded", function() {
    const swiperWrapper = document.querySelector(".swiper-wrapper");

    // Generate 10 slides dynamically
    for (let i = 1; i <= 10; i++) {
        let slide = document.createElement("div");
        slide.classList.add("swiper-slide");
        slide.textContent = `Slide ${i}`;

        slide.style.backgroundColor = 'var(--primary)';

        swiperWrapper.appendChild(slide);
    };
    
    const swiper = new Swiper(".swiper", {
        effect: "cards",
        grabcursor: true,
        initialSlide: 0,
        speed: 1000,
        rotate: true,
        // autoplay: {
        //     delay: 1000,
        // },
        mousewheel: {
            invert: false,
        }
    })
    window.swiper = swiper
});