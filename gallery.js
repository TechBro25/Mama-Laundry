// Gallery functionality for MAMA LAUNDARY website

document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeBtn = document.querySelector('.close');

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter gallery items
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Modal functionality
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const overlay = this.querySelector('.gallery-overlay');
            
            if (img && modal && modalImage && modalCaption) {
                modal.style.display = 'block';
                modalImage.src = img.src;
                
                if (overlay) {
                    const title = overlay.querySelector('h3');
                    const description = overlay.querySelector('p');
                    modalCaption.innerHTML = `
                        <h3>${title ? title.textContent : ''}</h3>
                        <p>${description ? description.textContent : ''}</p>
                    `;
                } else {
                    modalCaption.innerHTML = img.alt || '';
                }
                
                // Prevent body scroll when modal is open
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close modal functionality
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside the image
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.style.display === 'block') {
            closeModal();
        }
    });

    function closeModal() {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Lazy loading for gallery images
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            }
        });
    });

    // Observe all gallery images for lazy loading
    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        if (img) {
            imageObserver.observe(img);
        }
    });

    // Add keyboard navigation for gallery
    let currentIndex = -1;
    const visibleItems = () => Array.from(galleryItems).filter(item => 
        item.style.display !== 'none' && item.style.opacity !== '0'
    );

    document.addEventListener('keydown', function(e) {
        if (modal && modal.style.display === 'block') {
            const items = visibleItems();
            
            if (e.key === 'ArrowRight' && currentIndex < items.length - 1) {
                currentIndex++;
                showImageAtIndex(items[currentIndex]);
            } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
                currentIndex--;
                showImageAtIndex(items[currentIndex]);
            }
        }
    });

    function showImageAtIndex(item) {
        const img = item.querySelector('img');
        const overlay = item.querySelector('.gallery-overlay');
        
        if (img && modalImage && modalCaption) {
            modalImage.src = img.src;
            
            if (overlay) {
                const title = overlay.querySelector('h3');
                const description = overlay.querySelector('p');
                modalCaption.innerHTML = `
                    <h3>${title ? title.textContent : ''}</h3>
                    <p>${description ? description.textContent : ''}</p>
                `;
            } else {
                modalCaption.innerHTML = img.alt || '';
            }
        }
    }

    // Update current index when clicking on gallery items
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            const items = visibleItems();
            currentIndex = items.indexOf(item);
        });
    });

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    if (modal) {
        modal.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });

        modal.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const items = visibleItems();
        
        if (touchEndX < touchStartX - swipeThreshold && currentIndex < items.length - 1) {
            // Swipe left - next image
            currentIndex++;
            showImageAtIndex(items[currentIndex]);
        } else if (touchEndX > touchStartX + swipeThreshold && currentIndex > 0) {
            // Swipe right - previous image
            currentIndex--;
            showImageAtIndex(items[currentIndex]);
        }
    }

    // Add loading animation for images
    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        if (img) {
            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });
            
            img.addEventListener('error', function() {
                this.style.display = 'none';
                const fallback = document.createElement('div');
                fallback.className = 'image-fallback';
                fallback.innerHTML = '<p>Image not available</p>';
                this.parentNode.appendChild(fallback);
            });
        }
    });

    // Initialize masonry layout if needed (for better responsive gallery)
    function initMasonry() {
        const gallery = document.querySelector('.gallery-grid');
        if (gallery && window.innerWidth > 768) {
            // Simple masonry-like effect
            const items = Array.from(galleryItems);
            items.forEach((item, index) => {
                const delay = (index % 4) * 100;
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, delay);
            });
        }
    }

    // Initialize masonry on load and resize
    initMasonry();
    window.addEventListener('resize', MamaLaundaryUtils.throttle(initMasonry, 300));

    console.log('Gallery functionality initialized');
});