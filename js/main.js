// Mobile menu toggle
const menuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        // Toggle icon
        const icon = menuBtn.querySelector('i');
        if (mobileMenu.classList.contains('hidden')) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        } else {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }
    });
}

// Modal popup
const welcomeModal = document.getElementById('welcomeModal');
const closeModal = document.getElementById('closeModal');

if (welcomeModal && closeModal) {
    // Show modal on page load
    window.addEventListener('load', () => {
        welcomeModal.classList.remove('hidden');
    });

    // Close modal on button click
    closeModal.addEventListener('click', () => {
        welcomeModal.classList.add('hidden');
    });

    // Close modal on outside click
    welcomeModal.addEventListener('click', (e) => {
        if (e.target === welcomeModal) {
            welcomeModal.classList.add('hidden');
        }
    });
}

// Testimonials Carousel
function initTestimonialsCarousel() {
    const carousel = document.getElementById('testimonials-carousel');
    const prevBtn = document.getElementById('prev-testimonial');
    const nextBtn = document.getElementById('next-testimonial');
    const dotsContainer = document.getElementById('testimonial-dots');

    if (!carousel || !prevBtn || !nextBtn || !dotsContainer) return;

    let currentIndex = 0;
    let autoSlideInterval;

    // Get responsive slide count
    function getSlidesToShow() {
        if (window.innerWidth >= 1024) return 3; // lg: 3 slides
        if (window.innerWidth >= 768) return 2;  // md: 2 slides
        return 1; // mobile: 1 slide
    }

    function updateCarousel() {
        const slidesToShow = getSlidesToShow();
        const totalSlides = carousel.children.length;
        const maxIndex = Math.max(0, totalSlides - slidesToShow);

        // Clamp currentIndex
        currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));

        // Calculate translateX value
        const slideWidth = carousel.children[0].offsetWidth + 24; // 24px gap
        const translateX = -currentIndex * slideWidth;
        carousel.style.transform = `translateX(${translateX}px)`;

        // Update dots
        updateDots();
    }

    function updateDots() {
        const dots = dotsContainer.querySelectorAll('button');
        const slidesToShow = getSlidesToShow();
        const totalSlides = carousel.children.length;
        const maxIndex = Math.max(0, totalSlides - slidesToShow);

        dots.forEach((dot, index) => {
            if (index <= maxIndex) {
                dot.style.display = 'block';
                if (index === currentIndex) {
                    dot.classList.remove('bg-gray-300');
                    dot.classList.add('bg-primary');
                } else {
                    dot.classList.remove('bg-primary');
                    dot.classList.add('bg-gray-300');
                }
            } else {
                dot.style.display = 'none';
            }
        });
    }

    function nextSlide() {
        const slidesToShow = getSlidesToShow();
        const totalSlides = carousel.children.length;
        const maxIndex = Math.max(0, totalSlides - slidesToShow);

        currentIndex = (currentIndex + 1) > maxIndex ? 0 : currentIndex + 1;
        updateCarousel();
    }

    function prevSlide() {
        const slidesToShow = getSlidesToShow();
        const totalSlides = carousel.children.length;
        const maxIndex = Math.max(0, totalSlides - slidesToShow);

        currentIndex = (currentIndex - 1) < 0 ? maxIndex : currentIndex - 1;
        updateCarousel();
    }

    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 4000);
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }

    // Event listeners
    nextBtn.addEventListener('click', () => {
        stopAutoSlide();
        nextSlide();
        startAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
        stopAutoSlide();
        prevSlide();
        startAutoSlide();
    });

    // Dot navigation
    dotsContainer.addEventListener('click', (e) => {
        if (e.target.matches('button[data-slide]')) {
            const slideIndex = parseInt(e.target.dataset.slide);
            stopAutoSlide();
            goToSlide(slideIndex);
            startAutoSlide();
        }
    });

    // Pause auto-slide on hover
    const carouselContainer = carousel.parentElement.parentElement;
    carouselContainer.addEventListener('mouseenter', stopAutoSlide);
    carouselContainer.addEventListener('mouseleave', startAutoSlide);

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateCarousel();
        }, 250);
    });

    // Initialize
    updateCarousel();
    startAutoSlide();
}

// Mobile products menu toggle
const mobileProductsToggle = document.getElementById('mobile-products-toggle');
const mobileProductsMenu = document.getElementById('mobile-products-menu');

if (mobileProductsToggle && mobileProductsMenu) {
    mobileProductsToggle.addEventListener('click', () => {
        mobileProductsMenu.classList.toggle('hidden');
        const icon = document.getElementById('mobile-products-icon');
        if (mobileProductsMenu.classList.contains('hidden')) {
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
        } else {
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
        }
    });
}

// Initialize testimonials carousel
document.addEventListener('DOMContentLoaded', function() {
    initTestimonialsCarousel();
});
