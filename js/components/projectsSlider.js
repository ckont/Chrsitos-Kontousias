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
    let currentIndex = 0; // Current slide index
    let currentViewIndex = 0; // Current view/page index
    let slidesPerView = getSlidesPerView();
    let dots = [];

    function createDots() {
        // Clear existing dots
        dotsContainer.innerHTML = '';
        dots = [];
        
        // Calculate total views based on slides per view
        const totalViews = Math.ceil(totalSlides / slidesPerView);
        
        // Create dots for each view
        for (let i = 0; i < totalViews; i++) {
            const dot = document.createElement('button');
            dot.className = 'projects-slider__dot';
            dot.setAttribute('aria-label', `Go to view ${i + 1}`);
            dot.addEventListener('click', () => goToView(i));
            dotsContainer.appendChild(dot);
            dots.push(dot);
        }
    }

    // Initialize dots
    createDots();

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
            
            // Calculate scroll position based on current slide index
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
            updateViewIndex();
            updateDots();
            
            // Reset flag after smooth scroll animation completes
            programmaticScrollTimeout = setTimeout(() => {
                isProgrammaticScroll = false;
            }, 600);
        });
    }

    function updateViewIndex() {
        // Calculate which view the current slide belongs to
        currentViewIndex = Math.floor(currentIndex / slidesPerView);
    }

    function updateButtons() {
        // Buttons are always enabled for looping
        prevBtn.disabled = false;
        nextBtn.disabled = false;
    }

    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('projects-slider__dot--active', index === currentViewIndex);
        });
    }

    function goToView(viewIndex) {
        // Calculate the slide index for the start of this view
        const totalViews = Math.ceil(totalSlides / slidesPerView);
        const targetView = Math.max(0, Math.min(viewIndex, totalViews - 1));
        currentIndex = targetView * slidesPerView;
        // Ensure we don't go beyond the last slide
        currentIndex = Math.min(currentIndex, totalSlides - 1);
        updateSlider();
    }

    function goToSlide(index) {
        // Allow going to any slide index
        currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
        updateSlider();
    }

    function nextSlide() {
        // Move by one view (slidesPerView slides)
        const maxIndex = totalSlides - 1;
        const nextIndex = currentIndex + slidesPerView;
        
        if (nextIndex > maxIndex) {
            // Loop to beginning
            currentIndex = 0;
        } else {
            currentIndex = nextIndex;
        }
        updateSlider();
    }

    function prevSlide() {
        // Move back by one view (slidesPerView slides)
        const prevIndex = currentIndex - slidesPerView;
        
        if (prevIndex < 0) {
            // Loop to the last view
            const totalViews = Math.ceil(totalSlides / slidesPerView);
            const lastViewStart = (totalViews - 1) * slidesPerView;
            currentIndex = Math.min(lastViewStart, totalSlides - 1);
        } else {
            currentIndex = prevIndex;
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
    let lastUpdateIndex = currentIndex;
    
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
        
        // Calculate current view based on scroll position
        const slideWidth = slides[0]?.offsetWidth || 0;
        const gap = 20;
        const scrollPosition = track.scrollLeft;
        
        // Calculate which view we're in based on scroll position
        // Each view spans slidesPerView slides
        const viewWidth = (slideWidth + gap) * slidesPerView;
        const totalViews = Math.ceil(totalSlides / slidesPerView);
        
        // Use floor to determine base view, then check if we've scrolled past the midpoint
        const baseViewIndex = Math.floor(scrollPosition / viewWidth);
        const positionInView = (scrollPosition % viewWidth) / viewWidth;
        
        // Switch to next view if we've scrolled more than 50% through the current view
        // This ensures that when you see the third project half-way, it switches to the next view
        let bestViewIndex = baseViewIndex;
        if (positionInView > 0.5 && baseViewIndex < totalViews - 1) {
            bestViewIndex = baseViewIndex + 1;
        }
        bestViewIndex = Math.max(0, Math.min(bestViewIndex, totalViews - 1));
        
        // Update view index and slide index if changed
        if (bestViewIndex !== currentViewIndex) {
            currentViewIndex = bestViewIndex;
            // Set currentIndex to the first slide of the detected view
            currentIndex = bestViewIndex * slidesPerView;
            currentIndex = Math.min(currentIndex, totalSlides - 1);
            lastUpdateIndex = currentIndex;
            updateDots();
        }
        
        // Debounce the button update and snap to view when scrolling stops
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            updateButtons();
            // Snap to the current view's first slide when scrolling ends
            if (!isProgrammaticScroll) {
                const targetPosition = currentIndex * (slideWidth + gap);
                const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
                const finalPosition = Math.min(targetPosition, maxScroll);
                
                // Only snap if we're not already at the target position (within 20px tolerance)
                if (Math.abs(track.scrollLeft - finalPosition) > 20) {
                    isProgrammaticScroll = true;
                    track.scrollTo({
                        left: finalPosition,
                        behavior: 'smooth'
                    });
                    setTimeout(() => {
                        isProgrammaticScroll = false;
                    }, 600);
                }
            }
        }, 150);
    });

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newSlidesPerView = getSlidesPerView();
            if (newSlidesPerView !== slidesPerView) {
                slidesPerView = newSlidesPerView;
                createDots(); // Recreate dots for new view count
                updateViewIndex(); // Recalculate current view
                updateDots(); // Update active dot
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
    updateViewIndex();
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

