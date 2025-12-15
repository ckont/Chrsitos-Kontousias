function initProjectsSlider() {
    const track = document.getElementById('projects-track');
    const prevBtn = document.querySelector('.projects-slider__btn--prev');
    const nextBtn = document.querySelector('.projects-slider__btn--next');
    const dotsContainer = document.getElementById('projects-dots');

    if (!track || !prevBtn || !nextBtn || !dotsContainer) {
        return;
    }

    const slides = track.querySelectorAll('.projects-slider__slide');
    const totalSlides = slides.length;
    let currentIndex = 0;
    let slidesPerView = getSlidesPerView();

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'projects-slider__dot';
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.projects-slider__dot');

    function getSlidesPerView() {
        const width = window.innerWidth;
        if (width <= 800) return 1;
        if (width <= 1200) return 2;
        return 3;
    }

    function updateSlider() {
        // Wait for next frame to ensure layout is calculated
        requestAnimationFrame(() => {
            // Set flag to ignore scroll events during programmatic scroll
            isProgrammaticScroll = true;
            
            // Clear any existing timeout
            if (programmaticScrollTimeout) {
                clearTimeout(programmaticScrollTimeout);
            }
            
            const slideWidth = slides[0]?.offsetWidth || 0;
            const gap = 20; // 1.25rem = 20px
            
            // Calculate scroll position based on current index
            let scrollPosition = currentIndex * (slideWidth + gap);
            
            // For the last slides, ensure we can scroll to show them
            // Calculate max scroll based on actual track dimensions
            const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
            
            // If our calculated position exceeds max, use max (this shows the last slides)
            if (scrollPosition > maxScroll) {
                scrollPosition = maxScroll;
            }
            
            track.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });

            updateButtons();
            updateDots();
            
            // Reset flag after smooth scroll animation completes
            programmaticScrollTimeout = setTimeout(() => {
                isProgrammaticScroll = false;
            }, 600);
        });
    }

    function updateButtons() {
        // Buttons are always enabled for looping
        prevBtn.disabled = false;
        nextBtn.disabled = false;
    }

    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('projects-slider__dot--active', index === currentIndex);
        });
    }

    function goToSlide(index) {
        // Allow going to any slide index
        currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
        updateSlider();
    }

    function nextSlide() {
        const maxIndex = totalSlides - 1;
        if (currentIndex >= maxIndex) {
            // Loop to beginning
            currentIndex = 0;
        } else {
            currentIndex++;
        }
        updateSlider();
    }

    function prevSlide() {
        if (currentIndex <= 0) {
            // Loop to end
            currentIndex = totalSlides - 1;
        } else {
            currentIndex--;
        }
        updateSlider();
    }

    // Event listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Handle scroll to update current index (for manual scrolling)
    let scrollTimeout;
    let isProgrammaticScroll = false;
    let programmaticScrollTimeout = null;
    
    track.addEventListener('scroll', () => {
        // Ignore programmatic scrolls for a longer period to allow smooth scroll to complete
        if (isProgrammaticScroll) {
            // Reset flag after scroll animation completes (smooth scroll takes ~500ms)
            if (programmaticScrollTimeout) {
                clearTimeout(programmaticScrollTimeout);
            }
            programmaticScrollTimeout = setTimeout(() => {
                isProgrammaticScroll = false;
            }, 600); // Wait for smooth scroll to complete
            return;
        }
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const slideWidth = slides[0]?.offsetWidth || 0;
            const gap = 20;
            const scrollPosition = track.scrollLeft;
            const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
            
            // Always use visibility-based detection for more accuracy
            const trackRect = track.getBoundingClientRect();
            let bestIndex = currentIndex; // Default to current to prevent unwanted changes
            let maxVisible = 0;
            
            // Find the slide that's most visible (centered or most in view)
            slides.forEach((slide, index) => {
                const slideRect = slide.getBoundingClientRect();
                const slideCenter = slideRect.left + slideRect.width / 2;
                const trackCenter = trackRect.left + trackRect.width / 2;
                
                // Calculate how much of the slide is visible
                const visibleLeft = Math.max(0, slideRect.left - trackRect.left);
                const visibleRight = Math.min(slideRect.width, trackRect.right - slideRect.left);
                const visibleArea = Math.max(0, visibleRight - visibleLeft);
                
                // Prefer slides that are more centered and more visible
                const centerDistance = Math.abs(slideCenter - trackCenter);
                const score = visibleArea - (centerDistance * 0.1); // Prefer centered slides
                
                if (score > maxVisible && visibleArea > slideRect.width * 0.3) {
                    maxVisible = score;
                    bestIndex = index;
                }
            });
            
            // Only update if we found a valid slide and it's different
            if (bestIndex !== currentIndex && bestIndex >= 0 && bestIndex < totalSlides) {
                currentIndex = bestIndex;
                updateButtons();
                updateDots();
            }
        }, 150); // Slightly longer timeout for more stable detection
    });

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newSlidesPerView = getSlidesPerView();
            if (newSlidesPerView !== slidesPerView) {
                updateSlider();
            }
        }, 250);
    });

    // Keyboard navigation
    track.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextSlide();
        }
    });

    // Initialize
    updateSlider();

    // Make track focusable for keyboard navigation
    track.setAttribute('tabindex', '0');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProjectsSlider);
} else {
    initProjectsSlider();
}

export default initProjectsSlider;

