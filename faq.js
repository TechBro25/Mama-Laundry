// FAQ functionality for MAMA LAUNDARY website

document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            const toggle = item.querySelector('.faq-toggle');
            
            if (question && answer && toggle) {
                question.addEventListener('click', function() {
                    const isActive = item.classList.contains('active');
                    
                    // Close all other FAQ items
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                        }
                    });
                    
                    // Toggle current item
                    if (isActive) {
                        item.classList.remove('active');
                    } else {
                        item.classList.add('active');
                        
                        // Scroll to item if it's not fully visible
                        setTimeout(() => {
                            const rect = item.getBoundingClientRect();
                            const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
                            
                            if (!isVisible) {
                                item.scrollIntoView({ 
                                    behavior: 'smooth', 
                                    block: 'nearest' 
                                });
                            }
                        }, 300);
                    }
                });
                
                // Keyboard navigation
                question.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        question.click();
                    }
                });
                
                // Make question focusable
                question.setAttribute('tabindex', '0');
                question.setAttribute('role', 'button');
                question.setAttribute('aria-expanded', 'false');
                
                // Update aria-expanded when item is toggled
                const observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        if (mutation.attributeName === 'class') {
                            const isActive = item.classList.contains('active');
                            question.setAttribute('aria-expanded', isActive.toString());
                        }
                    });
                });
                
                observer.observe(item, { attributes: true });
            }
        });
        
        // Search functionality
        addFAQSearch();
        
        // Auto-expand FAQ based on URL hash
        checkForHashFAQ();
        
        console.log('FAQ functionality initialized');
    }
    
    function addFAQSearch() {
        const faqSection = document.querySelector('.faq-section');
        if (!faqSection) return;
        
        const container = faqSection.querySelector('.container');
        if (!container) return;
        
        // Create search box
        const searchContainer = document.createElement('div');
        searchContainer.className = 'faq-search';
        searchContainer.innerHTML = `
            <div class="search-box">
                <input type="text" id="faqSearch" placeholder="Search frequently asked questions..." />
                <button type="button" id="clearSearch">×</button>
            </div>
            <div id="searchResults" class="search-results"></div>
        `;
        
        // Add styles
        searchContainer.style.cssText = `
            margin-bottom: 2rem;
        `;
        
        const searchBox = searchContainer.querySelector('.search-box');
        searchBox.style.cssText = `
            position: relative;
            max-width: 600px;
            margin: 0 auto;
        `;
        
        const searchInput = searchContainer.querySelector('#faqSearch');
        searchInput.style.cssText = `
            width: 100%;
            padding: 12px 40px 12px 16px;
            border: 2px solid #e2e8f0;
            border-radius: 25px;
            font-size: 16px;
            background: white;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
        `;
        
        const clearButton = searchContainer.querySelector('#clearSearch');
        clearButton.style.cssText = `
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            font-size: 20px;
            color: #64748b;
            cursor: pointer;
            display: none;
        `;
        
        // Insert search box before FAQ container
        const faqContainer = container.querySelector('.faq-container');
        container.insertBefore(searchContainer, faqContainer);
        
        // Search functionality
        let searchTimeout;
        
        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.trim().toLowerCase();
            
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performSearch(query);
            }, 300);
            
            // Show/hide clear button
            clearButton.style.display = query ? 'block' : 'none';
        });
        
        searchInput.addEventListener('focus', function() {
            this.style.borderColor = '#3B82F6';
            this.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
        });
        
        searchInput.addEventListener('blur', function() {
            this.style.borderColor = '#e2e8f0';
            this.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        });
        
        clearButton.addEventListener('click', function() {
            searchInput.value = '';
            performSearch('');
            this.style.display = 'none';
            searchInput.focus();
        });
        
        function performSearch(query) {
            const resultsContainer = document.getElementById('searchResults');
            
            if (!query) {
                // Show all FAQ items
                faqItems.forEach(item => {
                    item.style.display = 'block';
                    item.classList.remove('search-highlight');
                });
                resultsContainer.innerHTML = '';
                return;
            }
            
            let visibleCount = 0;
            const matches = [];
            
            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question h3');
                const answer = item.querySelector('.faq-answer p');
                
                if (question && answer) {
                    const questionText = question.textContent.toLowerCase();
                    const answerText = answer.textContent.toLowerCase();
                    
                    if (questionText.includes(query) || answerText.includes(query)) {
                        item.style.display = 'block';
                        item.classList.add('search-highlight');
                        visibleCount++;
                        matches.push(item);
                        
                        // Highlight matching text
                        highlightText(question, query);
                        highlightText(answer, query);
                    } else {
                        item.style.display = 'none';
                        item.classList.remove('search-highlight');
                    }
                }
            });
            
            // Show search results summary
            if (visibleCount > 0) {
                resultsContainer.innerHTML = `
                    <p style="text-align: center; color: #64748b; margin: 1rem 0;">
                        Found ${visibleCount} result${visibleCount !== 1 ? 's' : ''} for "${query}"
                    </p>
                `;
            } else {
                resultsContainer.innerHTML = `
                    <div style="text-align: center; padding: 2rem; color: #64748b;">
                        <p>No results found for "${query}"</p>
                        <p style="margin-top: 1rem;">
                            <a href="contact.html" class="btn btn-primary">Ask Us Directly</a>
                        </p>
                    </div>
                `;
            }
        }
        
        function highlightText(element, query) {
            const originalText = element.textContent;
            const regex = new RegExp(`(${query})`, 'gi');
            const highlightedText = originalText.replace(regex, '<mark style="background: #fef08a; padding: 2px 4px; border-radius: 3px;">$1</mark>');
            element.innerHTML = highlightedText;
        }
    }
    
    function checkForHashFAQ() {
        const hash = window.location.hash;
        if (hash) {
            const targetElement = document.querySelector(hash);
            if (targetElement && targetElement.classList.contains('faq-item')) {
                setTimeout(() => {
                    targetElement.classList.add('active');
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 500);
            }
        }
    }
    
    // Add quick action buttons
    addQuickActions();
    
    function addQuickActions() {
        const stillQuestions = document.querySelector('.still-questions-content');
        if (stillQuestions) {
            // Add quick FAQ topics
            const quickTopics = document.createElement('div');
            quickTopics.className = 'quick-topics';
            quickTopics.innerHTML = `
                <h3>Quick Topics</h3>
                <div class="topic-buttons">
                    <button class="topic-btn" data-search="pricing">Pricing</button>
                    <button class="topic-btn" data-search="pickup">Pickup & Delivery</button>
                    <button class="topic-btn" data-search="turnaround">Turnaround Time</button>
                    <button class="topic-btn" data-search="stain">Stain Removal</button>
                    <button class="topic-btn" data-search="fabric">Fabric Care</button>
                </div>
            `;
            
            quickTopics.style.cssText = `
                margin-bottom: 2rem;
                text-align: center;
            `;
            
            const topicButtons = quickTopics.querySelector('.topic-buttons');
            topicButtons.style.cssText = `
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                justify-content: center;
                margin-top: 1rem;
            `;
            
            stillQuestions.insertBefore(quickTopics, stillQuestions.firstChild);
            
            // Style topic buttons and add functionality
            const buttons = quickTopics.querySelectorAll('.topic-btn');
            buttons.forEach(btn => {
                btn.style.cssText = `
                    padding: 8px 16px;
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: all 0.3s ease;
                `;
                
                btn.addEventListener('click', function() {
                    const searchTerm = this.getAttribute('data-search');
                    const searchInput = document.getElementById('faqSearch');
                    
                    if (searchInput) {
                        searchInput.value = searchTerm;
                        searchInput.dispatchEvent(new Event('input'));
                        
                        // Scroll to FAQ section
                        document.querySelector('.faq-section').scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'start' 
                        });
                    }
                });
                
                btn.addEventListener('mouseenter', function() {
                    this.style.background = 'white';
                    this.style.color = '#3B82F6';
                });
                
                btn.addEventListener('mouseleave', function() {
                    this.style.background = 'rgba(255, 255, 255, 0.2)';
                    this.style.color = 'white';
                });
            });
        }
    }
    
    // Add FAQ analytics
    trackFAQInteractions();
    
    function trackFAQInteractions() {
        faqItems.forEach((item, index) => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', function() {
                const questionText = question.querySelector('h3').textContent;
                console.log('FAQ clicked:', questionText);
                
                // Here you could send analytics data to your tracking service
                // Example: gtag('event', 'faq_click', { question: questionText });
            });
        });
    }
});