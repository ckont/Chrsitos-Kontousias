function initScrollAnimations() {
    // Don't animate if IntersectionObserver is not supported
    if (!('IntersectionObserver' in window)) {
        // Fallback: show all elements immediately
        document.querySelectorAll('.scroll-animate').forEach(el => {
            el.classList.add('animated');
        });
        return;
    }

    // Track observed elements to prevent double observation
    const observedElements = new Set();

    // Animation observer options
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    // Create observer instance
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Use requestAnimationFrame to ensure smooth animation
                requestAnimationFrame(() => {
                    entry.target.classList.add('animated');
                });
                observer.unobserve(entry.target);
                observedElements.delete(entry.target);
            }
        });
    }, observerOptions);

    // Helper function to observe element only if not already observed
    const observeElement = (element) => {
        if (!observedElements.has(element)) {
            observedElements.add(element);
            observer.observe(element);
        }
    };

    // Automatically find and observe all sections (excluding hero which is already visible)
    const sections = document.querySelectorAll('section:not(.hero)');
    sections.forEach(section => {
        section.classList.add('scroll-animate');
        observeElement(section);
    });

    // Automatically find and observe section headers with stagger effect
    const sectionHeaders = document.querySelectorAll('.section__header');
    sectionHeaders.forEach((header, index) => {
        header.classList.add('scroll-animate');
        header.style.setProperty('--animation-delay', `${index * 0.05}s`);
        observeElement(header);
    });

    // Automatically find and observe section text elements
    const sectionTexts = document.querySelectorAll('.section__text');
    sectionTexts.forEach((text, index) => {
        text.classList.add('scroll-animate');
        text.style.setProperty('--animation-delay', `${index * 0.08}s`);
        observeElement(text);
    });

    // Automatically find and observe cards with stagger effect
    const cardContainers = document.querySelectorAll('.cards-grid');
    cardContainers.forEach(container => {
        const cards = container.querySelectorAll('.card');
        cards.forEach((card, index) => {
            card.classList.add('scroll-animate');
            card.style.setProperty('--animation-delay', `${index * 0.1}s`);
            observeElement(card);
        });
    });

    // Automatically find and observe timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.classList.add('scroll-animate');
        item.style.setProperty('--animation-delay', `${index * 0.15}s`);
        observeElement(item);
    });

    // Automatically find and observe education items
    const educationItems = document.querySelectorAll('.education-item');
    educationItems.forEach((item, index) => {
        item.classList.add('scroll-animate');
        item.style.setProperty('--animation-delay', `${index * 0.1}s`);
        observeElement(item);
    });

    // Automatically find and observe thesis sections
    const thesisSections = document.querySelectorAll('.thesis');
    thesisSections.forEach(section => {
        section.classList.add('scroll-animate');
        observeElement(section);
    });

    // Automatically find and observe contact links with stagger
    const contactLinksContainers = document.querySelectorAll('.contact-links');
    contactLinksContainers.forEach(container => {
        const links = container.querySelectorAll('.contact-links__item');
        links.forEach((link, index) => {
            link.classList.add('scroll-animate');
            link.style.setProperty('--animation-delay', `${index * 0.1}s`);
            observeElement(link);
        });
    });

    // Automatically find and observe project cards with stagger
    const projectsSliders = document.querySelectorAll('.projects-slider');
    projectsSliders.forEach(slider => {
        const cards = slider.querySelectorAll('.project-card');
        cards.forEach((card, index) => {
            card.classList.add('scroll-animate');
            card.style.setProperty('--animation-delay', `${index * 0.08}s`);
            observeElement(card);
        });
    });

    // Automatically find and observe lists with stagger (for tags, etc.)
    const tagLists = document.querySelectorAll('.tags');
    tagLists.forEach(list => {
        const items = list.querySelectorAll('li');
        items.forEach((item, index) => {
            item.classList.add('scroll-animate');
            item.style.setProperty('--animation-delay', `${index * 0.05}s`);
            observeElement(item);
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollAnimations);
} else {
    initScrollAnimations();
}

export default initScrollAnimations;
