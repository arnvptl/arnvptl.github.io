document.addEventListener('DOMContentLoaded', function() {
    // Dynamic Media Configuration
    const mediaConfig = {
        featured: [
            {
                id: 1,
                title: "Pune IAS Pooja Khedkar आयाम गुन्हा का चार्जशीट का जवाबी अधिकारी IAS Arun Bhatia यांची ठोकळेबाजी मुलाखत",
                thumbnail: "i/arun-detective.jpg",
                youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                alt: "Arun Bhatia interview about IAS Pooja Khedkar case"
            },
            {
                id: 2,
                title: "'IAS Is One Of The Most Corrupt Organizations In India' : Arun Bhatia, Former IAS Officer",
                thumbnail: "i/arun-angry.webp",
                youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                alt: "Arun Bhatia discussing corruption in IAS"
            },
            {
                id: 3,
                title: "Arun Bhatia Exclusive | सेवानिवृत्त सदस्य अधिकारी भ्रष्ट : माजी आयएस अधिकारी अरुण भाटिया NDTV मराठीवर",
                thumbnail: "i/arun2.jpg",
                youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                alt: "Arun Bhatia exclusive interview on NDTV Marathi"
            }
        ],
        english: [
            {
                id: 4,
                title: "'IAS Is One Of The Most Corrupt Organizations In India' : Arun Bhatia, Former IAS Officer",
                thumbnail: "i/arun-angry.webp",
                youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                alt: "Arun Bhatia discussing IAS corruption in English interview"
            },
            {
                id: 5,
                title: "Former IAS Officer Arun Bhatia Speaks on Administrative Reforms",
                thumbnail: "i/arun2.jpg",
                youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                alt: "Former IAS Officer Arun Bhatia speaking on administrative reforms"
            },
            {
                id: 6,
                title: "Fighting Corruption: An Ex-IAS Officer's Journey",
                thumbnail: "i/arun-detective.jpg",
                youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                alt: "Fighting Corruption: An Ex-IAS Officer's Journey documentary"
            }
        ],
        hindi: [
            {
                id: 7,
                title: "भ्रष्टाचार के खिलाफ लड़ाई: पूर्व आईएएस अधिकारी अरुण भाटिया का साक्षात्कार",
                thumbnail: "i/arun-detective.jpg",
                youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                alt: "भ्रष्टाचार के खिलाफ लड़ाई पर अरुण भाटिया का हिंदी साक्षात्कार"
            },
            {
                id: 8,
                title: "आईएएस सेवा में भ्रष्टाचार: अरुण भाटिया का खुलासा",
                thumbnail: "i/arun-angry.webp",
                youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                alt: "आईएएस सेवा में भ्रष्टाचार पर अरुण भाटिया का खुलासा"
            },
            {
                id: 9,
                title: "प्रशासनिक सुधार की आवश्यकता: अरुण भाटिया की राय",
                thumbnail: "i/arun2.jpg",
                youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                alt: "प्रशासनिक सुधार की आवश्यकता पर अरुण भाटिया की राय"
            }
        ],
        marathi: [
            {
                id: 10,
                title: "Pune IAS Pooja Khedkar आयाम गुन्हा का चार्जशीट का जवाबी अधिकारी IAS Arun Bhatia यांची ठोकळेबाजी मुलाखत",
                thumbnail: "i/arun-detective.jpg",
                youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                alt: "पुणे आयएएस पूजा खेडकर प्रकरणावर अरुण भाटिया यांची मुलाखत"
            },
            {
                id: 11,
                title: "Arun Bhatia Exclusive | सेवानिवृत्त सदस्य अधिकारी भ्रष्ट : माजी आयएस अधिकारी अरुण भाटिया NDTV मराठीवर",
                thumbnail: "i/arun2.jpg",
                youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                alt: "एनडीटीव्ही मराठीवर अरुण भाटिया यांची खास मुलाखत"
            },
            {
                id: 12,
                title: "भ्रष्टाचाराविरुद्धची लढाई: अरुण भाटिया यांचे मत",
                thumbnail: "i/arun-angry.webp",
                youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                alt: "भ्रष्टाचाराविरुद्धची लढाई विषयी अरुण भाटिया यांचे मत"
            }
        ]
    };

    // Function to create media card HTML
    function createMediaCard(video) {
        return `
            <div class="col-lg-4 mb-4">
                <article class="media-card" data-video-id="${video.id}">
                    <div class="video-thumbnail">
                        <img src="${video.thumbnail}" 
                             alt="${video.alt}" 
                             class="img-fluid"
                             loading="lazy"
                             width="300"
                             height="200">
                        <div class="play-button" aria-label="Play video">
                            <i class="fas fa-play" aria-hidden="true"></i>
                        </div>
                    </div>
                    <div class="media-info">
                        <h${video.id <= 3 ? '4' : '3'}>${video.title}</h${video.id <= 3 ? '4' : '3'}>
                    </div>
                </article>
            </div>
        `;
    }

    // Function to render media sections
    function renderMediaSections() {
        // Render featured media (home page)
        const featuredContainer = document.querySelector('.media-section .row');
        if (featuredContainer) {
            featuredContainer.innerHTML = mediaConfig.featured.map(createMediaCard).join('');
        }

        // Render English section
        const englishContainer = document.querySelector('#english-section .row');
        if (englishContainer) {
            englishContainer.innerHTML = mediaConfig.english.map(createMediaCard).join('');
        }

        // Render Hindi section
        const hindiContainer = document.querySelector('#hindi-section .row');
        if (hindiContainer) {
            hindiContainer.innerHTML = mediaConfig.hindi.map(createMediaCard).join('');
        }

        // Render Marathi section
        const marathiContainer = document.querySelector('#marathi-section .row');
        if (marathiContainer) {
            marathiContainer.innerHTML = mediaConfig.marathi.map(createMediaCard).join('');
        }
    }

    // Function to get YouTube URL by video ID
    function getYouTubeUrl(videoId) {
        const allVideos = [
            ...mediaConfig.featured,
            ...mediaConfig.english,
            ...mediaConfig.hindi,
            ...mediaConfig.marathi
        ];
        const video = allVideos.find(v => v.id == videoId);
        return video ? video.youtubeUrl : null;
    }

    // Public API functions for managing media
    window.MediaManager = {
        // Add a new video to a specific section
        addVideo: function(section, video) {
            if (!mediaConfig[section]) {
                console.error(`Section "${section}" does not exist. Available sections: featured, english, hindi, marathi`);
                return false;
            }

            // Auto-generate ID if not provided
            if (!video.id) {
                const allVideos = [
                    ...mediaConfig.featured,
                    ...mediaConfig.english,
                    ...mediaConfig.hindi,
                    ...mediaConfig.marathi
                ];
                video.id = Math.max(...allVideos.map(v => v.id)) + 1;
            }

            // Add default values if not provided
            video.alt = video.alt || video.title;
            video.thumbnail = video.thumbnail || '/placeholder.svg?height=200&width=300';

            mediaConfig[section].push(video);
            renderMediaSections();
            attachEventListeners(); // Re-attach event listeners
            return true;
        },

        // Remove a video by ID
        removeVideo: function(videoId) {
            let removed = false;
            Object.keys(mediaConfig).forEach(section => {
                const index = mediaConfig[section].findIndex(v => v.id == videoId);
                if (index !== -1) {
                    mediaConfig[section].splice(index, 1);
                    removed = true;
                }
            });
            
            if (removed) {
                renderMediaSections();
                attachEventListeners();
            }
            return removed;
        },

        // Update a video by ID
        updateVideo: function(videoId, updates) {
            let updated = false;
            Object.keys(mediaConfig).forEach(section => {
                const video = mediaConfig[section].find(v => v.id == videoId);
                if (video) {
                    Object.assign(video, updates);
                    updated = true;
                }
            });
            
            if (updated) {
                renderMediaSections();
                attachEventListeners();
            }
            return updated;
        },

        // Get all videos from a section
        getVideos: function(section) {
            return mediaConfig[section] || [];
        },

        // Get a specific video by ID
        getVideo: function(videoId) {
            const allVideos = [
                ...mediaConfig.featured,
                ...mediaConfig.english,
                ...mediaConfig.hindi,
                ...mediaConfig.marathi
            ];
            return allVideos.find(v => v.id == videoId);
        },

        // Clear all videos from a section
        clearSection: function(section) {
            if (mediaConfig[section]) {
                mediaConfig[section] = [];
                renderMediaSections();
                attachEventListeners();
                return true;
            }
            return false;
        },

        // Get current media configuration
        getConfig: function() {
            return JSON.parse(JSON.stringify(mediaConfig)); // Return deep copy
        },

        // Load media configuration from JSON
        loadConfig: function(newConfig) {
            Object.assign(mediaConfig, newConfig);
            renderMediaSections();
            attachEventListeners();
        }
    };

    // Navigation functionality
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const sidebar = document.getElementById('sidebar');
    const mobileToggle = document.getElementById('mobileToggle');
    const learnMoreButtons = document.querySelectorAll('.learn-more-btn');
    const knowMoreBtn = document.getElementById('knowMoreBtn');
    const languageScrollBtns = document.querySelectorAll('.language-scroll-btn');
    const currentPageBreadcrumb = document.getElementById('current-page');

    // Update breadcrumb
    function updateBreadcrumb(sectionName) {
        if (currentPageBreadcrumb) {
            const sectionNames = {
                'home': 'Home',
                'about': 'Know Me',
                'blog': 'Book',
                'media': 'Media'
            };
            currentPageBreadcrumb.textContent = sectionNames[sectionName] || sectionName;
        }
    }

    // Function to switch to a section
    function switchToSection(targetSection) {
        // Remove active class from all nav links and sections
        navLinks.forEach(l => {
            l.classList.remove('active');
            l.removeAttribute('aria-current');
        });
        contentSections.forEach(s => s.classList.remove('active'));
        
        // Add active class to target nav link
        const targetNavLink = document.querySelector(`[data-section="${targetSection}"]`);
        if (targetNavLink) {
            targetNavLink.classList.add('active');
            targetNavLink.setAttribute('aria-current', 'page');
        }
        
        // Show target section
        const targetElement = document.getElementById(targetSection);
        if (targetElement) {
            targetElement.classList.add('active');
            updateBreadcrumb(targetSection);
            
            // Update page title for SEO
            const sectionTitles = {
                'home': 'Arun Bhatia - Ex-IAS Officer | Fight Against Corruption',
                'about': 'Know Me - Arun Bhatia | Former IAS Officer Biography',
                'blog': 'Book - Fight Against Corruption | Arun Bhatia',
                'media': 'Media Coverage | Arun Bhatia Interviews and Videos'
            };
            document.title = sectionTitles[targetSection] || document.title;
        }
        
        // Close sidebar on mobile after selection
        if (window.innerWidth < 992) {
            sidebar.classList.remove('show');
            mobileToggle.setAttribute('aria-expanded', 'false');
        }
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Function to attach event listeners to media cards
    function attachEventListeners() {
        // Handle video clicks - open YouTube in new tab with dynamic URLs
        const mediaCards = document.querySelectorAll('.media-card[data-video-id]');
        mediaCards.forEach(card => {
            // Remove existing event listeners by cloning the element
            const newCard = card.cloneNode(true);
            card.parentNode.replaceChild(newCard, card);
            
            newCard.addEventListener('click', function() {
                const videoId = this.getAttribute('data-video-id');
                const youtubeUrl = getYouTubeUrl(videoId);
                
                if (youtubeUrl) {
                    // Add click animation
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1)';
                        // Open YouTube video in new tab
                        window.open(youtubeUrl, '_blank', 'noopener,noreferrer');
                    }, 150);
                }
            });
            
            // Add keyboard support for accessibility
            newCard.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
            
            // Make cards focusable for keyboard navigation
            newCard.setAttribute('tabindex', '0');
            newCard.setAttribute('role', 'button');
        });

        // Re-apply scroll animations to new cards
        const allMediaCards = document.querySelectorAll('.media-card');
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe media cards for scroll animations
        allMediaCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `all 0.6s ease ${index * 0.1}s`;
            observer.observe(card);
        });
    }

    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');
            switchToSection(targetSection);
        });
    });

    // Handle "Know More About Me" button click
    if (knowMoreBtn) {
        knowMoreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                // Switch to About section
                switchToSection('about');
            }, 150);
        });
    }

    // Handle Learn More button clicks
    learnMoreButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('data-target');
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                switchToSection(targetSection);
            }, 150);
        });
    });

    // Handle language scroll buttons
    languageScrollBtns.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSectionId = this.getAttribute('data-target');
            const targetSection = document.getElementById(targetSectionId);
            
            if (targetSection) {
                // First ensure we're in the media section
                switchToSection('media');
                
                // Wait for section switch animation, then scroll to language section
                setTimeout(() => {
                    const offsetTop = targetSection.offsetTop - 100; // Account for fixed elements
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Update active button state
                    languageScrollBtns.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                }, 300);
            }
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Mobile toggle functionality
    mobileToggle.addEventListener('click', function() {
        const isExpanded = sidebar.classList.contains('show');
        sidebar.classList.toggle('show');
        this.setAttribute('aria-expanded', !isExpanded);
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth < 992) {
            if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
                sidebar.classList.remove('show');
                mobileToggle.setAttribute('aria-expanded', 'false');
            }
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 992) {
            sidebar.classList.remove('show');
            mobileToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Add hover effects to profile image
    const profileImage = document.querySelector('.profile-image-container');
    if (profileImage) {
        profileImage.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        profileImage.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    }

    // Add typing effect to main title (optional enhancement)
    const mainTitle = document.querySelector('.main-title');
    if (mainTitle) {
        const text = mainTitle.textContent;
        mainTitle.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                mainTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        // Start typing effect after a short delay
        setTimeout(typeWriter, 500);
    }

    // Add parallax effect to hero section
    let ticking = false;
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });

    // Handle URL hash on page load
    function handleHashOnLoad() {
        const hash = window.location.hash;
        if (hash) {
            if (hash.startsWith('#media-')) {
                const sectionId = hash.replace('#media-', '');
                const targetSection = document.getElementById(`${sectionId}-section`);
                if (targetSection) {
                    // Show media section first
                    switchToSection('media');
                    
                    // Then scroll to the specific language section
                    setTimeout(() => {
                        const offsetTop = targetSection.offsetTop - 100;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }, 300);
                }
            } else {
                const sectionId = hash.replace('#', '');
                switchToSection(sectionId);
            }
        }
    }

    // SEO and Performance optimizations
    
    // Lazy load images that are not immediately visible
    function setupLazyLoading() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.src; // Trigger loading
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }

    // Add structured data for current page
    function updateStructuredData(section) {
        const existingScript = document.querySelector('script[data-dynamic-ld]');
        if (existingScript) {
            existingScript.remove();
        }

        let structuredData = {};
        
        switch(section) {
            case 'about':
                structuredData = {
                    "@context": "https://schema.org",
                    "@type": "AboutPage",
                    "mainEntity": {
                        "@type": "Person",
                        "name": "Arun Bhatia",
                        "jobTitle": "Former IAS Officer",
                        "description": "Ex-IAS officer with three decades of experience fighting corruption in Indian bureaucracy"
                    }
                };
                break;
            case 'blog':
                structuredData = {
                    "@context": "https://schema.org",
                    "@type": "Book",
                    "name": "Fight Against Corruption: An IAS Officer's Journey",
                    "author": {
                        "@type": "Person",
                        "name": "Arun Bhatia"
                    }
                };
                break;
            case 'media':
                structuredData = {
                    "@context": "https://schema.org",
                    "@type": "VideoGallery",
                    "name": "Arun Bhatia Media Coverage",
                    "description": "Collection of interviews and media coverage of former IAS officer Arun Bhatia"
                };
                break;
        }

        if (Object.keys(structuredData).length > 0) {
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.setAttribute('data-dynamic-ld', 'true');
            script.textContent = JSON.stringify(structuredData);
            document.head.appendChild(script);
        }
    }

    // Update structured data when section changes
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            updateStructuredData(section);
        });
    });

    // Initialize the page
    renderMediaSections();
    attachEventListeners();
    setupLazyLoading();
    handleHashOnLoad();

    // Initialize page
    console.log(`
  ┓     ┏┓┳┓┳┓┏┓┓┏
━━┣┓┓┏  ┣┫┣┫┃┃┣┫┃┃
  ┗┛┗┫  ┛┗┛┗┛┗┛┗┗┛
     ┛
https://rnv.is-a.dev`);
    
    // Track page performance
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            }, 0);
        });
    }
});
