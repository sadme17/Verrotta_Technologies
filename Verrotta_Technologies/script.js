// ==========================================================================
// VERROTTA TECHNOLOGIES LIMITED - INTERACTIVE SCRIPTS
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

    // ===== 1. MOBILE MENU TOGGLE =====
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close menu on clicking nav items
        document.querySelectorAll('.nav-item, .revolut-nav-item').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Close on clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }


    // ===== 2. ACTIVE NAVIGATION ITEM ON SCROLL =====
    const navLinks = document.querySelectorAll('.nav-item, .revolut-nav-item');
    const sections = document.querySelectorAll('section[id], header[id]');

    function highlightNavOnScroll() {
        const scrollPosition = window.scrollY + 180;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavOnScroll);


    // ===== 3. BACK TO TOP BUTTON =====
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 450) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }


    // ===== 4. FAQ ACCORDION (TEMPLATE STYLE) =====
    const faqItems = document.querySelectorAll('.faq-accordion-item');

    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const icon = item.querySelector('.faq-state-icon i');

        trigger.addEventListener('click', () => {
            const isCurrentlyActive = item.classList.contains('active');

            // Close all items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                const otherTrigger = otherItem.querySelector('.faq-trigger');
                const otherIcon = otherItem.querySelector('.faq-state-icon i');
                if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
                if (otherIcon) otherIcon.className = 'fas fa-plus';
            });

            // Toggle selected item
            if (!isCurrentlyActive) {
                item.classList.add('active');
                trigger.setAttribute('aria-expanded', 'true');
                if (icon) icon.className = 'fas fa-times';
            }
        });
    });


    // ===== 5. INTERACTIVE SOLAR CALCULATOR (NIGERIAN MARKET) =====
    const monthlySpendSlider = document.getElementById('monthlySpend');
    const spendDisplay = document.getElementById('spendDisplay');
    const propertyType = document.getElementById('propertyType');
    const resSystem = document.getElementById('resSystem');
    const resBattery = document.getElementById('resBattery');
    const resSavings = document.getElementById('resSavings');
    const res5Yr = document.getElementById('res5Yr');

    function formatNaira(num) {
        return num.toLocaleString('en-NG');
    }

    function calculateSolar() {
        if (!monthlySpendSlider) return;

        const spend = parseInt(monthlySpendSlider.value, 10);
        if (spendDisplay) spendDisplay.textContent = formatNaira(spend);

        const prop = propertyType ? propertyType.value : 'medium';

        let systemSpec = '5 kVA Pure Sine Wave';
        let batterySpec = '10 kWh LiFePO4';
        let savingsRatio = 0.80; // 80% savings on generator + NEPA

        if (prop === 'small' || spend < 80000) {
            systemSpec = '3.5 kVA Hybrid Inverter';
            batterySpec = '5 kWh LiFePO4';
            savingsRatio = 0.78;
        } else if (prop === 'medium' || (spend >= 80000 && spend < 220000)) {
            systemSpec = '5 kVA Hybrid MPPT';
            batterySpec = '10 kWh LiFePO4';
            savingsRatio = 0.82;
        } else if (prop === 'large' || (spend >= 220000 && spend < 400000)) {
            systemSpec = '10 kVA High-Voltage Hybrid';
            batterySpec = '15 kWh LiFePO4';
            savingsRatio = 0.85;
        } else {
            systemSpec = '15 - 20 kVA 3-Phase Commercial';
            batterySpec = '25 - 30 kWh Rackmount';
            savingsRatio = 0.88;
        }

        const monthlySave = Math.round(spend * savingsRatio);
        const fiveYearSave = monthlySave * 60;

        if (resSystem) resSystem.textContent = systemSpec;
        if (resBattery) resBattery.textContent = batterySpec;
        if (resSavings) resSavings.textContent = `₦${formatNaira(monthlySave)} / mo`;
        if (res5Yr) res5Yr.textContent = `₦${formatNaira(fiveYearSave)}`;
    }

    if (monthlySpendSlider) {
        monthlySpendSlider.addEventListener('input', calculateSolar);
    }
    if (propertyType) {
        propertyType.addEventListener('change', calculateSolar);
    }
    calculateSolar(); // Initial calculation


    // ===== 6. ANIMATED NUMERICAL COUNTERS FOR MILESTONES =====
    const matrixNumbers = document.querySelectorAll('.matrix-num[data-target]');
    let matrixAnimated = false;

    function runMatrixAnimation() {
        matrixNumbers.forEach(elem => {
            const target = parseFloat(elem.getAttribute('data-target'));
            const prefix = elem.getAttribute('data-prefix') || '';
            const suffix = elem.getAttribute('data-suffix') || '';
            const isDecimal = elem.hasAttribute('data-decimal');
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease-out cubic formula
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const currentVal = easeOut * target;

                if (isDecimal) {
                    elem.textContent = `${prefix}${currentVal.toFixed(1)}${suffix}`;
                } else {
                    elem.textContent = `${prefix}${Math.round(currentVal).toLocaleString()}${suffix}`;
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    const milestonesSection = document.querySelector('.section-milestones');
    if (milestonesSection && 'IntersectionObserver' in window) {
        const milestoneObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !matrixAnimated) {
                    matrixAnimated = true;
                    runMatrixAnimation();
                }
            });
        }, { threshold: 0.25 });

        milestoneObserver.observe(milestonesSection);
    }


    // ===== 7. LEAD QUOTE FORM SUBMISSION =====
    const quoteForm = document.getElementById('quoteForm');

    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = quoteForm.querySelector('button[type="submit"]');
            const originalContent = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Processing your request...</span> <i class="fas fa-spinner fa-spin"></i>';

            setTimeout(() => {
                submitBtn.innerHTML = '<span>Request Received! We will call you within 2 hours.</span> <i class="fas fa-check-circle"></i>';
                submitBtn.style.background = '#4CAF50';
                submitBtn.style.borderColor = '#4CAF50';
                submitBtn.style.color = '#FFFFFF';

                setTimeout(() => {
                    quoteForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalContent;
                    submitBtn.style.background = '';
                    submitBtn.style.borderColor = '';
                    submitBtn.style.color = '';
                }, 4000);
            }, 1400);
        });
    }


    // ===== 8. SMOOTH SCROLLING FOR ALL ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 20;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

});
