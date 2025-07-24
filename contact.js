// Contact form functionality for MAMA LAUNDARY website

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Form validation patterns
        const validationRules = {
            firstName: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-Z\s]+$/,
                message: 'First name must be at least 2 characters and contain only letters'
            },
            lastName: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-Z\s]+$/,
                message: 'Last name must be at least 2 characters and contain only letters'
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address'
            },
            phone: {
                required: true,
                pattern: /^[\+]?[0-9\s\-\(\)]{10,}$/,
                message: 'Please enter a valid phone number (minimum 10 digits)'
            },
            message: {
                required: true,
                minLength: 10,
                message: 'Message must be at least 10 characters long'
            }
        };

        // Real-time validation
        Object.keys(validationRules).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            const errorElement = document.getElementById(fieldName + 'Error');
            
            if (field && errorElement) {
                // Validate on blur
                field.addEventListener('blur', function() {
                    validateField(field, errorElement, validationRules[fieldName]);
                });

                // Clear error on input
                field.addEventListener('input', function() {
                    if (errorElement.textContent) {
                        errorElement.textContent = '';
                        field.classList.remove('error');
                    }
                });
            }
        });

        // Form submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const formData = new FormData(contactForm);
            
            // Validate all fields
            Object.keys(validationRules).forEach(fieldName => {
                const field = document.getElementById(fieldName);
                const errorElement = document.getElementById(fieldName + 'Error');
                
                if (field && errorElement) {
                    if (!validateField(field, errorElement, validationRules[fieldName])) {
                        isValid = false;
                    }
                }
            });

            if (isValid) {
                submitForm(formData);
            } else {
                // Scroll to first error
                const firstError = contactForm.querySelector('.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstError.focus();
                }
            }
        });

        function validateField(field, errorElement, rules) {
            const value = field.value.trim();
            let isValid = true;
            let errorMessage = '';

            // Required validation
            if (rules.required && !value) {
                isValid = false;
                errorMessage = `${field.labels[0].textContent.replace('*', '').trim()} is required`;
            }
            // Pattern validation
            else if (value && rules.pattern && !rules.pattern.test(value)) {
                isValid = false;
                errorMessage = rules.message;
            }
            // Minimum length validation
            else if (value && rules.minLength && value.length < rules.minLength) {
                isValid = false;
                errorMessage = rules.message;
            }

            // Update UI
            if (isValid) {
                field.classList.remove('error');
                field.classList.add('valid');
                errorElement.textContent = '';
            } else {
                field.classList.remove('valid');
                field.classList.add('error');
                errorElement.textContent = errorMessage;
            }

            return isValid;
        }

        function submitForm(formData) {
            const submitBtn = contactForm.querySelector('.form-submit-btn');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');

            // Show loading state
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';

            // Simulate form submission (replace with actual form handling)
            setTimeout(() => {
                // Create summary of form data
                const formSummary = {
                    firstName: formData.get('firstName'),
                    lastName: formData.get('lastName'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    service: formData.get('service'),
                    message: formData.get('message'),
                    newsletter: formData.get('newsletter') ? 'Yes' : 'No'
                };

                // Show success message
                showSuccessMessage(formSummary);
                
                // Reset form
                contactForm.reset();
                contactForm.querySelectorAll('.valid').forEach(field => {
                    field.classList.remove('valid');
                });

                // Reset button state
                submitBtn.disabled = false;
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';

                // Optional: Send data to WhatsApp or email
                sendToWhatsApp(formSummary);

            }, 2000); // Simulate network delay
        }

        function showSuccessMessage(formData) {
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.innerHTML = `
                <div class="success-content">
                    <div class="success-icon">✅</div>
                    <h3>Thank You, ${formData.firstName}!</h3>
                    <p>Your message has been received. We'll get back to you shortly at ${formData.email}.</p>
                    <button onclick="this.parentElement.parentElement.remove()" class="btn btn-primary">Close</button>
                </div>
            `;

            // Add styles
            successMessage.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            `;

            const successContent = successMessage.querySelector('.success-content');
            successContent.style.cssText = `
                background: white;
                padding: 3rem;
                border-radius: 15px;
                text-align: center;
                max-width: 400px;
                margin: 0 20px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            `;

            const successIcon = successMessage.querySelector('.success-icon');
            successIcon.style.cssText = `
                font-size: 4rem;
                margin-bottom: 1rem;
                display: block;
            `;

            document.body.appendChild(successMessage);

            // Auto close after 5 seconds
            setTimeout(() => {
                if (successMessage.parentElement) {
                    successMessage.remove();
                }
            }, 5000);
        }

        function sendToWhatsApp(formData) {
            const message = `
New inquiry from MAMA LAUNDARY website:

Name: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Phone: ${formData.phone}
Service: ${formData.service || 'Not specified'}
Newsletter: ${formData.newsletter}

Message:
${formData.message}
            `.trim();

            const whatsappUrl = `https://wa.me/2347031339900?text=${encodeURIComponent(message)}`;
            
            // Optional: Open WhatsApp link automatically (uncomment if desired)
            // window.open(whatsappUrl, '_blank');
            
            console.log('Form data ready for WhatsApp:', message);
        }

        // Form field enhancements
        const phoneField = document.getElementById('phone');
        if (phoneField) {
            phoneField.addEventListener('input', function(e) {
                // Auto-format phone number
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 0) {
                    if (value.length <= 3) {
                        value = value;
                    } else if (value.length <= 6) {
                        value = value.slice(0, 3) + '-' + value.slice(3);
                    } else if (value.length <= 10) {
                        value = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6);
                    } else {
                        value = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6, 10);
                    }
                }
                e.target.value = value;
            });
        }

        // Service selection enhancement
        const serviceField = document.getElementById('service');
        const messageField = document.getElementById('message');
        
        if (serviceField && messageField) {
            serviceField.addEventListener('change', function() {
                const service = this.value;
                if (service && !messageField.value) {
                    const serviceMessages = {
                        'washing': 'I would like to know more about your washing services...',
                        'ironing': 'I need professional ironing services...',
                        'dry-cleaning': 'I have items that need dry cleaning...',
                        'pickup-delivery': 'I\'m interested in your pickup and delivery service...',
                        'wash-fold': 'I need wash and fold services...',
                        'other': 'I have a specific inquiry about your services...'
                    };
                    
                    if (serviceMessages[service]) {
                        messageField.value = serviceMessages[service];
                        messageField.focus();
                    }
                }
            });
        }

        // Character counter for message field
        if (messageField) {
            const maxLength = 500;
            const counter = document.createElement('div');
            counter.className = 'char-counter';
            counter.style.cssText = `
                text-align: right;
                font-size: 0.875rem;
                color: #64748b;
                margin-top: 0.25rem;
            `;
            messageField.parentElement.appendChild(counter);

            function updateCounter() {
                const remaining = maxLength - messageField.value.length;
                counter.textContent = `${remaining} characters remaining`;
                
                if (remaining < 50) {
                    counter.style.color = '#ef4444';
                } else if (remaining < 100) {
                    counter.style.color = '#f59e0b';
                } else {
                    counter.style.color = '#64748b';
                }
            }

            messageField.addEventListener('input', updateCounter);
            messageField.setAttribute('maxlength', maxLength);
            updateCounter();
        }

        console.log('Contact form functionality initialized');
    }

    // Business hours highlight
    highlightCurrentBusinessHours();
    
    function highlightCurrentBusinessHours() {
        const hoursItems = document.querySelectorAll('.hours-item');
        const now = new Date();
        const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const currentHour = now.getHours();

        // Business hours logic (adjust as needed)
        const businessHours = {
            1: { start: 7, end: 19 }, // Monday
            2: { start: 7, end: 19 }, // Tuesday
            3: { start: 7, end: 19 }, // Wednesday
            4: { start: 7, end: 19 }, // Thursday
            5: { start: 7, end: 19 }, // Friday
            6: { start: 8, end: 18 }, // Saturday
            0: { start: 10, end: 16 } // Sunday
        };

        hoursItems.forEach((item, index) => {
            const dayNumber = index === 0 ? [1,2,3,4,5] : index === 1 ? [6] : [0];
            
            if (dayNumber.includes(currentDay)) {
                item.style.background = '#e0f2fe';
                item.style.borderLeft = '4px solid #3B82F6';
                
                const hours = businessHours[currentDay];
                if (hours && currentHour >= hours.start && currentHour < hours.end) {
                    item.style.background = '#dcfce7';
                    item.style.borderLeft = '4px solid #22c55e';
                    
                    const statusText = document.createElement('span');
                    statusText.textContent = ' (Open Now)';
                    statusText.style.color = '#22c55e';
                    statusText.style.fontWeight = 'bold';
                    item.querySelector('.time').appendChild(statusText);
                }
            }
        });
    }
});