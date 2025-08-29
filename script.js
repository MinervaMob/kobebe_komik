// App State
let zoomLevel = 100;
let isDarkTheme = true; // Start with dark theme
let deferredPrompt;
let isFullscreen = false;
let currentImageIndex = 0;
let currentPage = 1; // Add missing currentPage variable
let totalPages = 11; // Total comic pages

// DOM Elements - will be initialized after DOM is loaded
let sections = {};
let navButtons = {};
let elements = {};

// Comic Pages Data
const comicPages = [
    'komik/image_komik/page 1.jpg',
    'komik/image_komik/page 2.jpg',
    'komik/image_komik/page 3.jpg',
    'komik/image_komik/page 4.jpg',
    'komik/image_komik/page 5.jpg',
    'komik/image_komik/page 6.jpg',
    'komik/image_komik/page 7.jpg',
    'komik/image_komik/page 8.jpg',
    'komik/image_komik/page 9.jpg',
    'komik/image_komik/page 10.jpg',
    'komik/image_komik/page 11.jpg'
];

// Initialize DOM Elements
function initializeDOMElements() {
    console.log('Initializing DOM elements...');

    sections = {
        home: document.getElementById('homeSection'),
        reader: document.getElementById('readerSection'),
        download: document.getElementById('downloadSection'),
        about: document.getElementById('aboutSection')
    };

    navButtons = {
        home: document.getElementById('homeBtn'),
        reader: document.getElementById('readerBtn'),
        download: document.getElementById('downloadBtn'),
        about: document.getElementById('aboutBtn')
    };

    elements = {
        zoomLevelSpan: document.getElementById('zoomLevel'),
        zoomInBtn: document.getElementById('zoomInBtn'),
        zoomOutBtn: document.getElementById('zoomOutBtn'),
        resetZoomBtn: document.getElementById('resetZoomBtn'),
        comicScrollContainer: document.getElementById('comicScrollContainer'),
        scrollProgress: document.getElementById('scrollProgress'),
        loadingScreen: document.getElementById('loadingScreen'),
        loadingProgress: document.getElementById('loadingProgress'),
        imageModal: document.getElementById('imageModal'),
        modalImage: document.getElementById('modalImage'),
        modalCloseBtn: document.getElementById('modalCloseBtn'),
        modalPrevBtn: document.getElementById('modalPrevBtn'),
        modalNextBtn: document.getElementById('modalNextBtn'),
        fullscreenBtn: document.getElementById('fullscreenBtn'),
        themeBtn: document.getElementById('themeBtn'),
        installBtn: document.getElementById('installBtn'),
        startReadingBtn: document.getElementById('startReadingBtn'),
        downloadPdfBtn: document.getElementById('downloadPdfBtn'),
        downloadPdfBtnMain: document.getElementById('downloadPdfBtnMain'),
        downloadAppBtn: document.getElementById('downloadAppBtn'),
        hamburgerBtn: document.getElementById('hamburgerBtn'),
        mainNav: document.getElementById('mainNav'),
        navOverlay: document.getElementById('navOverlay'),
        currentPageSpan: document.getElementById('currentPage') || { textContent: '' },
        prevPageBtn: document.getElementById('prevPageBtn') || { disabled: false },
        nextPageBtn: document.getElementById('nextPageBtn') || { disabled: false }
    };

    console.log('DOM elements initialized!');
}

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded, initializing app...');

    try {
        // Initialize DOM elements first
        initializeDOMElements();

        // Then initialize the app
        initializeApp();
        setupEventListeners();
        setupServiceWorker();
        setupPWAInstallPrompt();

        // Hide loading screen after all images are loaded or timeout
        let imagesLoaded = 0;
        const totalImages = comicPages.length;
        let loadingTimeout;

        // Check if all images are loaded
        function checkImagesLoaded() {
            if (imagesLoaded >= totalImages) {
                clearTimeout(loadingTimeout);
                console.log('All images loaded, hiding loading screen');
                hideLoadingScreen();
            }
        }

        // Load images with progress tracking
        comicPages.forEach((imagePath, index) => {
            const img = new Image();
            img.onload = () => {
                imagesLoaded++;
                updateLoadingProgress((imagesLoaded / totalImages) * 100);
                checkImagesLoaded();
            };
            img.onerror = () => {
                console.warn(`Failed to load image: ${imagePath}`);
                imagesLoaded++;
                checkImagesLoaded();
            };
            img.src = imagePath;
        });

        // Fallback timeout - hide loading screen after 3 seconds even if not all images loaded
        loadingTimeout = setTimeout(() => {
            console.log('Loading timeout reached, hiding loading screen');
            hideLoadingScreen();
        }, 3000);

    } catch (error) {
        console.error('Error during app initialization:', error);
        // Still hide loading screen even if there's an error
        setTimeout(() => {
            hideLoadingScreen();
        }, 1000);
    }
});

// Initialize Application
function initializeApp() {
    console.log('Initializing application...');

    // Check sections
    console.log('Checking sections:');
    Object.keys(sections).forEach(key => {
        if (sections[key]) {
            console.log(`✓ Section ${key} found`);
        } else {
            console.warn(`✗ Section ${key} not found`);
        }
    });

    // Check navigation buttons
    console.log('Checking navigation buttons:');
    Object.keys(navButtons).forEach(key => {
        if (navButtons[key]) {
            console.log(`✓ Nav button ${key} found`);
        } else {
            console.warn(`✗ Nav button ${key} not found`);
        }
    });

    // Check DOM elements
    console.log('Checking DOM elements:');
    Object.keys(elements).forEach(key => {
        if (elements[key]) {
            console.log(`✓ ${key} found`);
        } else {
            console.warn(`✗ ${key} not found`);
        }
    });

    // Set initial values
    updateZoomDisplay();

    // Load all comic pages in scroll container
    loadComicPages();

    // Load saved preferences
    loadPreferences();

    // Set active navigation
    setActiveSection('home');

    // Setup scroll progress indicator
    setupScrollProgress();

    console.log('Application initialized successfully!');
}

// Load all comic pages into scroll container
function loadComicPages() {
    if (!elements.comicScrollContainer) return;

    elements.comicScrollContainer.innerHTML = '';

    comicPages.forEach((imagePath, index) => {
        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = `Halaman ${index + 1}`;
        img.className = 'comic-page';
        img.style.transform = `scale(${zoomLevel / 100})`;

        // Add click handler for modal
        img.addEventListener('click', () => openImageModal(index));

        elements.comicScrollContainer.appendChild(img);
    });
}

// Setup scroll progress indicator
function setupScrollProgress() {
    if (!elements.comicScrollContainer || !elements.scrollProgress) return;

    elements.comicScrollContainer.addEventListener('scroll', () => {
        const container = elements.comicScrollContainer;
        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight - container.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;

        elements.scrollProgress.style.width = `${Math.min(progress, 100)}%`;
    });
}// Setup Event Listeners
function setupEventListeners() {
    console.log('Setting up event listeners...');

    // Navigation
    Object.keys(navButtons).forEach(key => {
        if (navButtons[key]) {
            navButtons[key].addEventListener('click', () => {
                console.log(`Navigation clicked: ${key}`);
                setActiveSection(key);
            });
            console.log(`✓ Navigation listener added for: ${key}`);
        } else {
            console.warn(`✗ Navigation button not found: ${key}`);
        }
    });

    // Reader controls - only add listeners if elements exist
    if (elements.zoomInBtn) {
        elements.zoomInBtn.addEventListener('click', () => {
            console.log('Zoom In clicked');
            zoomIn();
        });
        console.log('✓ Zoom In listener added');
    } else {
        console.warn('✗ Zoom In button not found');
    }

    if (elements.zoomOutBtn) {
        elements.zoomOutBtn.addEventListener('click', () => {
            console.log('Zoom Out clicked');
            zoomOut();
        });
        console.log('✓ Zoom Out listener added');
    } else {
        console.warn('✗ Zoom Out button not found');
    }

    if (elements.resetZoomBtn) {
        elements.resetZoomBtn.addEventListener('click', () => {
            console.log('Reset Zoom clicked');
            resetZoom();
        });
        console.log('✓ Reset Zoom listener added');
    } else {
        console.warn('✗ Reset Zoom button not found');
    }

    // Modal controls
    if (elements.modalCloseBtn) {
        elements.modalCloseBtn.addEventListener('click', () => {
            console.log('Modal close clicked');
            closeImageModal();
        });
        console.log('✓ Modal Close listener added');
    } else {
        console.warn('✗ Modal Close button not found');
    }

    if (elements.modalPrevBtn) {
        elements.modalPrevBtn.addEventListener('click', () => {
            console.log('Modal Previous clicked');
            modalPreviousPage();
        });
        console.log('✓ Modal Previous listener added');
    } else {
        console.warn('✗ Modal Previous button not found');
    }

    if (elements.modalNextBtn) {
        elements.modalNextBtn.addEventListener('click', () => {
            console.log('Modal Next clicked');
            modalNextPage();
        });
        console.log('✓ Modal Next listener added');
    } else {
        console.warn('✗ Modal Next button not found');
    }

    if (elements.imageModal) {
        elements.imageModal.addEventListener('click', (e) => {
            if (e.target === elements.imageModal) {
                console.log('Modal background clicked');
                closeImageModal();
            }
        });
        console.log('✓ Modal background listener added');
    } else {
        console.warn('✗ Image Modal not found');
    }

    // Header actions
    if (elements.fullscreenBtn) {
        elements.fullscreenBtn.addEventListener('click', () => {
            console.log('Fullscreen clicked');
            toggleFullscreen();
        });
        console.log('✓ Fullscreen listener added');
    } else {
        console.warn('✗ Fullscreen button not found');
    }

    if (elements.themeBtn) {
        elements.themeBtn.addEventListener('click', () => {
            console.log('Theme toggle clicked');
            toggleTheme();
        });
        console.log('✓ Theme toggle listener added');
    } else {
        console.warn('✗ Theme button not found');
    }

    if (elements.installBtn) {
        elements.installBtn.addEventListener('click', () => {
            console.log('Install PWA clicked');
            installPWA();
        });
        console.log('✓ Install PWA listener added');
    } else {
        console.warn('✗ Install button not found');
    }

    // Quick action buttons
    if (elements.startReadingBtn) {
        elements.startReadingBtn.addEventListener('click', () => {
            console.log('Start Reading clicked');
            setActiveSection('reader');
        });
        console.log('✓ Start Reading listener added');
    } else {
        console.warn('✗ Start Reading button not found');
    }

    if (elements.downloadPdfBtn) {
        elements.downloadPdfBtn.addEventListener('click', () => {
            console.log('Download PDF clicked');
            downloadPDF();
        });
        console.log('✓ Download PDF listener added');
    } else {
        console.warn('✗ Download PDF button not found');
    }

    if (elements.downloadPdfBtnMain) {
        elements.downloadPdfBtnMain.addEventListener('click', () => {
            console.log('Download PDF Main clicked');
            downloadPDF();
        });
        console.log('✓ Download PDF Main listener added');
    } else {
        console.warn('✗ Download PDF Main button not found');
    }

    if (elements.downloadAppBtn) {
        elements.downloadAppBtn.addEventListener('click', () => {
            console.log('Download App clicked');
            installPWA();
        });
        console.log('✓ Download App listener added');
    } else {
        console.warn('✗ Download App button not found');
    }

    // Scroll progress for reader
    if (elements.comicScrollContainer) {
        elements.comicScrollContainer.addEventListener('scroll', updateScrollProgress);
        console.log('✓ Scroll progress listener added');
    } else {
        console.warn('✗ Comic scroll container not found');
    }

    // Comic page clicks for zoom modal
    setupComicPageClickHandlers();

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    console.log('✓ Keyboard shortcuts listener added');

    // Touch gestures for mobile
    try {
        setupTouchGestures();
        console.log('✓ Touch gestures setup completed');
    } catch (error) {
        console.error('❌ Touch gestures setup failed:', error);
    }

    // Mobile hamburger menu
    try {
        setupMobileMenu();
        console.log('✓ Mobile menu setup completed');
    } catch (error) {
        console.error('❌ Mobile menu setup failed:', error);
    }

    console.log('Event listeners setup completed!');

    // Test button clicks after a short delay to ensure everything is ready
    setTimeout(() => {
        console.log('Testing button availability...');

        // Test navigation buttons
        Object.keys(navButtons).forEach(key => {
            if (navButtons[key]) {
                console.log(`✓ ${key} button is clickable`);
            }
        });

        // Test home page buttons
        if (elements.startReadingBtn) {
            console.log('✓ Start Reading button is ready');
        }
        if (elements.downloadPdfBtn) {
            console.log('✓ Download PDF button is ready');
        }
        if (elements.downloadAppBtn) {
            console.log('✓ Download App button is ready');
        }

        console.log('Button test completed!');

        // Add fallback event listeners manually if needed
        addFallbackEventListeners();
    }, 500);
}

// Add fallback event listeners for critical buttons
function addFallbackEventListeners() {
    console.log('Adding fallback event listeners...');

    // Manual navigation setup
    const homeBtn = document.getElementById('homeBtn');
    const readerBtn = document.getElementById('readerBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const aboutBtn = document.getElementById('aboutBtn');

    if (homeBtn && !homeBtn.hasAttribute('data-listener-added')) {
        homeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Fallback: Home button clicked');
            setActiveSection('home');
        });
        homeBtn.setAttribute('data-listener-added', 'true');
        console.log('✓ Fallback Home listener added');
    }

    if (readerBtn && !readerBtn.hasAttribute('data-listener-added')) {
        readerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Fallback: Reader button clicked');
            setActiveSection('reader');
        });
        readerBtn.setAttribute('data-listener-added', 'true');
        console.log('✓ Fallback Reader listener added');
    }

    if (downloadBtn && !downloadBtn.hasAttribute('data-listener-added')) {
        downloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Fallback: Download button clicked');
            setActiveSection('download');
        });
        downloadBtn.setAttribute('data-listener-added', 'true');
        console.log('✓ Fallback Download listener added');
    }

    if (aboutBtn && !aboutBtn.hasAttribute('data-listener-added')) {
        aboutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Fallback: About button clicked');
            setActiveSection('about');
        });
        aboutBtn.setAttribute('data-listener-added', 'true');
        console.log('✓ Fallback About listener added');
    }

    // Home page buttons
    const startReadingBtn = document.getElementById('startReadingBtn');
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    const downloadAppBtn = document.getElementById('downloadAppBtn');

    if (startReadingBtn && !startReadingBtn.hasAttribute('data-listener-added')) {
        startReadingBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Fallback: Start Reading clicked');
            setActiveSection('reader');
        });
        startReadingBtn.setAttribute('data-listener-added', 'true');
        console.log('✓ Fallback Start Reading listener added');
    }

    if (downloadPdfBtn && !downloadPdfBtn.hasAttribute('data-listener-added')) {
        downloadPdfBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Fallback: Download PDF clicked');
            downloadPDF();
        });
        downloadPdfBtn.setAttribute('data-listener-added', 'true');
        console.log('✓ Fallback Download PDF listener added');
    }

    if (downloadAppBtn && !downloadAppBtn.hasAttribute('data-listener-added')) {
        downloadAppBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Fallback: Download App clicked');
            installPWA();
        });
        downloadAppBtn.setAttribute('data-listener-added', 'true');
        console.log('✓ Fallback Download App listener added');
    }

    // Theme and other header buttons
    const themeBtn = document.getElementById('themeBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');

    if (themeBtn && !themeBtn.hasAttribute('data-listener-added')) {
        themeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Fallback: Theme toggle clicked');
            toggleTheme();
        });
        themeBtn.setAttribute('data-listener-added', 'true');
        console.log('✓ Fallback Theme toggle listener added');
    }

    if (fullscreenBtn && !fullscreenBtn.hasAttribute('data-listener-added')) {
        fullscreenBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Fallback: Fullscreen clicked');
            toggleFullscreen();
        });
        fullscreenBtn.setAttribute('data-listener-added', 'true');
        console.log('✓ Fallback Fullscreen listener added');
    }

    console.log('Fallback event listeners setup completed!');

    // Special debugging for downloadAppBtn
    const downloadAppBtnDebug = document.getElementById('downloadAppBtn');
    if (downloadAppBtnDebug) {
        console.log('Download App button found in DOM, testing click handler...');

        // Add a simple test click handler to ensure it's working
        downloadAppBtnDebug.addEventListener('click', function(e) {
            console.log('Download App button clicked - event triggered!');
            console.log('Event target:', e.target);
            console.log('Current target:', e.currentTarget);
            console.log('Button text:', e.currentTarget.textContent);
        });

        // Test if button is visible and clickable
        const rect = downloadAppBtnDebug.getBoundingClientRect();
        console.log('Download App button position:', rect);
        console.log('Download App button visibility:', window.getComputedStyle(downloadAppBtnDebug).display);
        console.log('Download App button is clickable:', !downloadAppBtnDebug.disabled);
    } else {
        console.error('Download App button NOT found in DOM!');
    }
}

// Navigation Functions
function setActiveSection(sectionName) {
    console.log(`Setting active section to: ${sectionName}`);

    // Check if sections and navButtons are properly initialized
    if (!sections || !navButtons) {
        console.error('Sections or navButtons not initialized');
        return;
    }

    // Hide all sections
    Object.values(sections).forEach(section => {
        if (section) {
            section.classList.remove('active');
        }
    });

    // Show selected section
    if (sections[sectionName]) {
        sections[sectionName].classList.add('active');
        console.log(`✓ Section ${sectionName} activated`);
    } else {
        console.error(`Section ${sectionName} not found`);
    }

    // Update navigation buttons
    Object.values(navButtons).forEach(btn => {
        if (btn) {
            btn.classList.remove('active');
        }
    });

    if (navButtons[sectionName]) {
        navButtons[sectionName].classList.add('active');
        console.log(`✓ Nav button ${sectionName} activated`);
    } else {
        console.error(`Nav button ${sectionName} not found`);
    }

    // Add fade-in animation
    if (sections[sectionName]) {
        sections[sectionName].classList.add('fade-in');
    }

    // Special handling for reader section
    if (sectionName === 'reader') {
        // updateComicDisplay(); // Comment out for now as it might cause issues
    }

    // Save last visited section
    localStorage.setItem('lastSection', sectionName);

    console.log(`Section switching to ${sectionName} completed`);
}

// Reader Functions
function updateComicDisplay() {
    const imagePath = comicPages[currentPage - 1];
    elements.comicPage.src = imagePath;
    elements.currentPageSpan.textContent = currentPage;

    // Update navigation buttons
    elements.prevPageBtn.disabled = currentPage === 1;
    elements.nextPageBtn.disabled = currentPage === totalPages;

    // Update thumbnails
    updateThumbnailsSelection();

    // Apply zoom
    applyZoom();

    // Save current page
    localStorage.setItem('currentPage', currentPage);
}

function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        updateComicDisplay();
    }
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        updateComicDisplay();
    }
}

function goToPage(pageNumber) {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
        currentPage = pageNumber;
        updateComicDisplay();
    }
}

// Zoom Functions
function zoomIn() {
    if (zoomLevel < 300) {
        zoomLevel += 25;
        applyZoom();
        updateZoomDisplay();
    }
}

function zoomOut() {
    if (zoomLevel > 50) {
        zoomLevel -= 25;
        applyZoom();
        updateZoomDisplay();
    }
}

function resetZoom() {
    zoomLevel = 100;
    applyZoom();
    updateZoomDisplay();
}

function fitWidth() {
    const container = elements.comicScrollContainer || document.getElementById('comicScrollContainer');
    const image = elements.comicPage || document.querySelector('.comic-page');

    if (!container || !image) {
        console.warn('fitWidth: Required elements not found');
        return;
    }

    // Calculate zoom to fit width
    const containerWidth = container.clientWidth - 40; // Account for padding
    const naturalWidth = image.naturalWidth;

    if (naturalWidth > 0) {
        zoomLevel = Math.floor((containerWidth / naturalWidth) * 100);
        applyZoom();
        updateZoomDisplay();
    }
}

function fitHeight() {
    const container = elements.comicScrollContainer || document.getElementById('comicScrollContainer');
    const image = elements.comicPage || document.querySelector('.comic-page');

    if (!container || !image) {
        console.warn('fitHeight: Required elements not found');
        return;
    }

    // Calculate zoom to fit height
    const containerHeight = container.clientHeight - 40; // Account for padding
    const naturalHeight = image.naturalHeight;

    if (naturalHeight > 0) {
        zoomLevel = Math.floor((containerHeight / naturalHeight) * 100);
        applyZoom();
        updateZoomDisplay();
    }
}

function applyZoom() {
    if (elements.comicScrollContainer) {
        elements.comicScrollContainer.style.transform = `scale(${zoomLevel / 100})`;
        // Save zoom level
        localStorage.setItem('zoomLevel', zoomLevel);
    }
}

function updateZoomDisplay() {
    if (elements.zoomLevelSpan) {
        elements.zoomLevelSpan.textContent = `${zoomLevel}%`;
    }
}

// Setup comic page click handlers for modal view
function setupComicPageClickHandlers() {
    if (elements.comicScrollContainer) {
        elements.comicScrollContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('comic-page')) {
                const clickedImage = e.target;
                const imageIndex = Array.from(elements.comicScrollContainer.children).indexOf(clickedImage);
                openImageModal(imageIndex);
            }
        });
    }
}

// Update scroll progress bar
function updateScrollProgress() {
    if (elements.comicScrollContainer && elements.scrollProgress) {
        const container = elements.comicScrollContainer;
        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight - container.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        elements.scrollProgress.style.width = `${progress}%`;
    }
}

// Thumbnail Functions
function generateThumbnails() {
    elements.pageThumbnails.innerHTML = '';

    comicPages.forEach((imagePath, index) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = imagePath;
        thumbnail.alt = `Halaman ${index + 1}`;
        thumbnail.classList.add('thumbnail');
        thumbnail.addEventListener('click', () => {
            goToPage(index + 1);
            setActiveSection('reader');
        });

        if (index === 0) {
            thumbnail.classList.add('active');
        }

        elements.pageThumbnails.appendChild(thumbnail);
    });
}

function updateThumbnailsSelection() {
    const thumbnails = elements.pageThumbnails.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.classList.toggle('active', index === currentPage - 1);
    });
}

// Modal Functions
function openImageModal(imageIndex = 0) {
    if (elements.modalImage && elements.imageModal) {
        currentImageIndex = imageIndex;
        elements.modalImage.src = comicPages[imageIndex];
        elements.imageModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeImageModal() {
    if (elements.imageModal) {
        elements.imageModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function modalNextPage() {
    if (currentImageIndex < comicPages.length - 1) {
        currentImageIndex++;
        if (elements.modalImage) {
            elements.modalImage.src = comicPages[currentImageIndex];
        }
    }
}

function modalPreviousPage() {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        if (elements.modalImage) {
            elements.modalImage.src = comicPages[currentImageIndex];
        }
    }
}

// Theme Functions
function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    document.body.classList.toggle('dark-theme', isDarkTheme);

    // Update theme button icon
    const themeIcon = elements.themeBtn.querySelector('i');
    themeIcon.className = isDarkTheme ? 'fas fa-sun' : 'fas fa-moon';

    // Save theme preference
    localStorage.setItem('darkTheme', isDarkTheme);
}

// Fullscreen Functions
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => {
            isFullscreen = true;
            elements.fullscreenBtn.querySelector('i').className = 'fas fa-compress';
        });
    } else {
        document.exitFullscreen().then(() => {
            isFullscreen = false;
            elements.fullscreenBtn.querySelector('i').className = 'fas fa-expand';
        });
    }
}

// PWA Functions
function setupServiceWorker() {
    if ('serviceWorker' in navigator) {
        console.log('🔧 Setting up Service Worker...');

        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('✅ Service Worker registered:', registration);
                    console.log('SW scope:', registration.scope);

                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        console.log('🔄 Service Worker update found');
                        const newWorker = registration.installing;
                        if (newWorker) {
                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'activated') {
                                    console.log('🎉 Service Worker updated and activated');
                                }
                            });
                        }
                    });
                })
                .catch(registrationError => {
                    console.error('❌ Service Worker registration failed:', registrationError);
                });
        });
    } else {
        console.warn('⚠️ Service Worker not supported');
    }
}

function setupPWAInstallPrompt() {
    console.log('🔧 Setting up PWA install prompt...');

    // Check if already installed
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        console.log('✅ PWA is already installed');
        if (elements.installBtn) {
            elements.installBtn.style.display = 'none';
        }
        return;
    }

    // Check if running as iOS PWA
    if (window.navigator && window.navigator.standalone === true) {
        console.log('✅ Running as iOS PWA');
        if (elements.installBtn) {
            elements.installBtn.style.display = 'none';
        }
        return;
    }

    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('🚀 beforeinstallprompt event fired');

        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();

        // Stash the event so it can be triggered later
        deferredPrompt = e;
        console.log('✅ Deferred prompt stored');

        // Show the install button
        if (elements.installBtn) {
            elements.installBtn.style.display = 'flex';
            console.log('✅ Install button shown');
        }
    });

    // Listen for app installed
    window.addEventListener('appinstalled', () => {
        console.log('🎉 PWA was installed');
        hideInstallPrompt();
        if (elements.installBtn) {
            elements.installBtn.style.display = 'none';
        }
        showNotification('Aplikasi berhasil diinstall!', 'success');
    });

    // Manual install button setup
    if (elements.installBtn) {
        elements.installBtn.addEventListener('click', installPWA);
        console.log('✅ Install button event listener added');
    }

    // Fallback for browsers that don't support beforeinstallprompt
    setTimeout(() => {
        if (!deferredPrompt && elements.installBtn) {
            elements.installBtn.style.display = 'flex';
            console.log('🔧 Showing install button for manual instructions');
        }
    }, 2000);
}

function installPWA() {
    console.log('📱 Install PWA function called');

    if (deferredPrompt) {
        console.log('✅ Using deferred prompt for PWA installation');
        deferredPrompt.prompt();

        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('🎉 User accepted the install prompt');
                showNotification('Aplikasi sedang diinstall...', 'success');
            } else {
                console.log('❌ User dismissed the install prompt');
                showNotification('Instalasi dibatalkan', 'info');
            }
            deferredPrompt = null;
            if (elements.installBtn) {
                elements.installBtn.style.display = 'none';
            }
        });
    } else {
        console.log('ℹ️ No deferred prompt available, showing manual instructions');
        showManualInstallInstructions();
    }
}

function showManualInstallInstructions() {
    const userAgent = navigator.userAgent.toLowerCase();
    let instructions = '';

    if (userAgent.includes('chrome') || userAgent.includes('edge')) {
        instructions = 'Untuk menginstall aplikasi:<br>1. Klik ikon ⋮ (menu) di browser<br>2. Pilih "Install Kobebe Komik"<br>3. Klik "Install" pada popup yang muncul';
    } else if (userAgent.includes('firefox')) {
        instructions = 'Untuk menginstall aplikasi:<br>1. Klik ikon ☰ (menu) di browser<br>2. Pilih "Install This Site as an App"<br>3. Ikuti petunjuk instalasi';
    } else if (userAgent.includes('safari')) {
        instructions = 'Untuk menginstall aplikasi:<br>1. Klik tombol Share (kotak dengan panah)<br>2. Scroll dan pilih "Add to Home Screen"<br>3. Klik "Add"';
    } else {
        instructions = 'Untuk menginstall aplikasi:<br>1. Buka menu browser<br>2. Cari opsi "Install App" atau "Add to Home Screen"<br>3. Ikuti petunjuk yang muncul';
    }

    // Create and show modal with instructions
    showInstallInstructionsModal(instructions);
}

function showInstallInstructionsModal(instructions) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('installInstructionsModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'installInstructionsModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content install-instructions">
                <button class="modal-close" onclick="closeInstallInstructionsModal()">
                    <i class="fas fa-times"></i>
                </button>
                <div class="modal-header">
                    <h2><i class="fas fa-download"></i> Install Aplikasi</h2>
                </div>
                <div class="modal-body">
                    <p>${instructions}</p>
                    <div class="install-benefits">
                        <h3>Keuntungan menginstall aplikasi:</h3>
                        <ul>
                            <li><i class="fas fa-check"></i> Akses offline</li>
                            <li><i class="fas fa-check"></i> Tampil seperti aplikasi native</li>
                            <li><i class="fas fa-check"></i> Notifikasi push</li>
                            <li><i class="fas fa-check"></i> Performa lebih cepat</li>
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="closeInstallInstructionsModal()">
                        <i class="fas fa-check"></i> Mengerti
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeInstallInstructionsModal() {
    const modal = document.getElementById('installInstructionsModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function showInstallPrompt() {
    if (deferredPrompt && !localStorage.getItem('installPromptDismissed')) {
        elements.installPrompt.classList.add('show');
    }
}

function hideInstallPrompt() {
    elements.installPrompt.classList.remove('show');
    localStorage.setItem('installPromptDismissed', 'true');
}

// Download Functions
function downloadPDF() {
    // Show loading
    showLoadingScreen('Menyiapkan download...');

    // Simulate download preparation
    setTimeout(() => {
        const link = document.createElement('a');
        link.href = 'komik/Komik Bilangan Bulat.pdf';
        link.download = 'Komik Bilangan Bulat.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        hideLoadingScreen();

        // Show success message
        showNotification('File PDF berhasil didownload!', 'success');
    }, 1500);
}

// Keyboard Shortcuts
function handleKeyboardShortcuts(e) {
    // Prevent shortcuts when typing in input fields
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }

    switch (e.key) {
        case 'ArrowRight':
        case ' ': // Space
            e.preventDefault();
            nextPage();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            previousPage();
            break;
        case 'f':
        case 'F':
            e.preventDefault();
            toggleFullscreen();
            break;
        case 't':
        case 'T':
            e.preventDefault();
            toggleTheme();
            break;
        case 'Escape':
            if (elements.imageModal.classList.contains('active')) {
                closeImageModal();
            }
            break;
        case '+':
        case '=':
            e.preventDefault();
            zoomIn();
            break;
        case '-':
            e.preventDefault();
            zoomOut();
            break;
        case '1':
            e.preventDefault();
            setActiveSection('home');
            break;
        case '2':
            e.preventDefault();
            setActiveSection('reader');
            break;
        case '3':
            e.preventDefault();
            setActiveSection('download');
            break;
        case '4':
            e.preventDefault();
            setActiveSection('about');
            break;
    }
}

// Touch Gestures for Mobile
function setupTouchGestures() {
    // Find the comic container element
    const readerContent = document.getElementById('comicScrollContainer') ||
                         document.getElementById('readerSection') ||
                         document.querySelector('.comic-scroll-container');

    if (!readerContent) {
        console.warn('Touch gestures: Reader content element not found, skipping touch setup');
        return;
    }

    console.log('Setting up touch gestures on:', readerContent);

    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    readerContent.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    });

    readerContent.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipeGesture();
    });

    function handleSwipeGesture() {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        // Minimum swipe distance
        const minSwipeDistance = 50;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    // Swipe right - previous page
                    previousPage();
                } else {
                    // Swipe left - next page
                    nextPage();
                }
            }
        }
    }
}

// Mobile Menu Functions
function setupMobileMenu() {
    console.log('🍔 Setting up mobile menu...');

    // Wait for DOM and try multiple times
    let attempts = 0;
    const maxAttempts = 5;

    function tryInitMenu() {
        attempts++;
        console.log(`Attempt ${attempts}/${maxAttempts} to initialize hamburger menu`);

        const hamburgerBtn = document.getElementById('hamburgerBtn');
        const mainNav = document.getElementById('mainNav');
        const navOverlay = document.getElementById('navOverlay');

        // Debug element existence
        console.log('Elements check:', {
            hamburger: hamburgerBtn ? '✅' : '❌',
            nav: mainNav ? '✅' : '❌',
            overlay: navOverlay ? '✅' : '❌'
        });

        if (!hamburgerBtn || !mainNav || !navOverlay) {
            if (attempts < maxAttempts) {
                console.log(`⏱️ Retrying in ${200 * attempts}ms...`);
                setTimeout(tryInitMenu, 200 * attempts);
            } else {
                console.error('❌ Failed to find required elements after all attempts');
            }
            return;
        }

        // Success! Setup event listeners
        console.log('✅ All elements found, setting up event listeners...');

        // Remove any existing event listeners by cloning
        const newHamburgerBtn = hamburgerBtn.cloneNode(true);
        hamburgerBtn.parentNode.replaceChild(newHamburgerBtn, hamburgerBtn);

        // Main click handler
        newHamburgerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🍔 HAMBURGER CLICKED!');

            const isMenuOpen = mainNav.classList.contains('active');
            console.log('Menu state:', isMenuOpen ? 'OPEN' : 'CLOSED');

            if (isMenuOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Touch support for mobile
        newHamburgerBtn.addEventListener('touchend', function(e) {
            e.preventDefault();
            console.log('👆 Hamburger touch end');
        });

        // Overlay click to close
        navOverlay.addEventListener('click', closeMenu);

        // Nav button clicks close menu
        const navBtns = mainNav.querySelectorAll('.nav-btn');
        navBtns.forEach(btn => {
            btn.addEventListener('click', closeMenu);
        });

        // ESC key closes menu
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mainNav.classList.contains('active')) {
                closeMenu();
            }
        });

        console.log('🎉 Hamburger menu setup completed successfully!');

        // Helper functions
        function openMenu() {
            console.log('📱 OPENING MENU...');

            newHamburgerBtn.classList.add('active');
            mainNav.classList.add('active');
            navOverlay.style.display = 'block';
            navOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';

            console.log('✅ Menu opened successfully');
        }

        function closeMenu() {
            console.log('❌ CLOSING MENU...');

            newHamburgerBtn.classList.remove('active');
            mainNav.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.style.overflow = '';

            setTimeout(() => {
                if (!mainNav.classList.contains('active')) {
                    navOverlay.style.display = 'none';
                }
            }, 300);

            console.log('✅ Menu closed successfully');
        }

        // Make functions globally available for debugging
        window.debugOpenMenu = openMenu;
        window.debugCloseMenu = closeMenu;
        window.debugToggleMenu = function() {
            if (mainNav.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        };

        // Add visual debug indicator
        newHamburgerBtn.style.border = '2px solid lime';
        newHamburgerBtn.title = 'Hamburger Menu - Click to toggle';
        setTimeout(() => {
            newHamburgerBtn.style.border = 'none';
        }, 3000);
    }

    // Start the initialization process
    tryInitMenu();
}

// Debug PWA Installability
function debugPWAInstallability() {
    console.log('🔍 === PWA Installability Debug ===');

    // Check Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
            console.log('📋 Service Worker registrations:', registrations.length);
            registrations.forEach((registration, index) => {
                console.log(`SW ${index + 1}:`, registration.scope, registration.active?.state);
            });
        });
    } else {
        console.log('❌ Service Worker not supported');
    }

    // Check manifest
    const manifestLink = document.querySelector('link[rel="manifest"]');
    console.log('📄 Manifest link:', manifestLink ? manifestLink.href : 'Not found');

    // Check if PWA criteria are met
    const checks = {
        'HTTPS or localhost': location.protocol === 'https:' || location.hostname === 'localhost',
        'Service Worker': 'serviceWorker' in navigator,
        'Manifest': !!document.querySelector('link[rel="manifest"]'),
        'Valid manifest': true, // We assume it's valid for now
        'Install prompt': !!deferredPrompt
    };

    console.log('✅ PWA Criteria Check:');
    Object.entries(checks).forEach(([check, passed]) => {
        console.log(`${passed ? '✅' : '❌'} ${check}: ${passed}`);
    });

    // Check display mode
    if (window.matchMedia) {
        const standalone = window.matchMedia('(display-mode: standalone)').matches;
        console.log('📱 Display mode standalone:', standalone);
    }

    // Manual install trigger for testing
    window.testInstallPrompt = function() {
        if (deferredPrompt) {
            console.log('🚀 Triggering install prompt...');
            installPWA();
        } else {
            console.log('❌ No deferred prompt available');
            console.log('Try: chrome://flags/#enable-desktop-pwas-additional-windowing-controls');
        }
    };

    console.log('💡 Run testInstallPrompt() to test manual installation');
    console.log('🔍 === End PWA Debug ===');
}

// Run debug after page load
setTimeout(debugPWAInstallability, 3000);// Utility Functions
function showLoadingScreen(message = 'Memuat...') {
    if (elements.loadingScreen) {
        elements.loadingScreen.style.display = 'flex';
        const titleElement = elements.loadingScreen.querySelector('h3');
        if (titleElement) {
            titleElement.textContent = message;
        }

        // Animate loading bar
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            if (elements.loadingProgress) {
                elements.loadingProgress.style.width = `${progress}%`;
            }

            if (progress >= 100) {
                clearInterval(interval);
            }
        }, 100);
    }
}

function hideLoadingScreen() {
    if (elements.loadingScreen) {
        elements.loadingScreen.style.opacity = '0';
        setTimeout(() => {
            elements.loadingScreen.style.display = 'none';
            elements.loadingScreen.style.opacity = '1';
            if (elements.loadingProgress) {
                elements.loadingProgress.style.width = '0%';
            }
        }, 500);
    }
}

function updateLoadingProgress(percentage) {
    if (elements.loadingProgress) {
        elements.loadingProgress.style.width = `${percentage}%`;
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    // Add notification styles if not already present
    if (!document.querySelector('#notificationStyles')) {
        const style = document.createElement('style');
        style.id = 'notificationStyles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: var(--bg-card);
                color: var(--text-primary);
                padding: var(--spacing-md) var(--spacing-lg);
                border-radius: var(--radius-lg);
                box-shadow: var(--shadow-lg);
                border: 1px solid rgba(255, 255, 255, 0.1);
                display: flex;
                align-items: center;
                gap: var(--spacing-sm);
                z-index: 1600;
                animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s;
                animation-fill-mode: forwards;
            }

            .notification-success {
                border-left: 4px solid var(--primary-color);
            }

            .notification i {
                color: var(--primary-color);
            }

            @keyframes slideInRight {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
            }

            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}

function loadPreferences() {
    try {
        // Load theme
        const savedTheme = localStorage.getItem('darkTheme');
        if (savedTheme === 'true') {
            isDarkTheme = true;
            document.body.classList.add('dark-theme');
            if (elements.themeBtn && elements.themeBtn.querySelector('i')) {
                elements.themeBtn.querySelector('i').className = 'fas fa-sun';
            }
        }

        // Load current page
        const savedPage = localStorage.getItem('currentPage');
        if (savedPage) {
            currentPage = parseInt(savedPage);
            if (elements.currentPageSpan && elements.currentPageSpan.textContent !== undefined) {
                elements.currentPageSpan.textContent = currentPage;
            }
        }

        // Load zoom level
        const savedZoom = localStorage.getItem('zoomLevel');
        if (savedZoom) {
            zoomLevel = parseInt(savedZoom);
            updateZoomDisplay();
        }

        // Load last section
        const lastSection = localStorage.getItem('lastSection');
        if (lastSection && sections[lastSection]) {
            setActiveSection(lastSection);
        }
    } catch (error) {
        console.error('Error loading preferences:', error);
    }
}

// Preload images for better performance
function preloadImages() {
    comicPages.forEach(imagePath => {
        const img = new Image();
        img.src = imagePath;
    });
}

// Initialize image preloading when the app starts
setTimeout(preloadImages, 2000);

// Error handling
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
    showNotification('Terjadi kesalahan. Silakan refresh halaman.', 'error');
});

// Prevent zoom on double tap for iOS
document.addEventListener('touchend', (e) => {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounced resize handler
window.addEventListener('resize', debounce(() => {
    // Recalculate layout if needed
    if (sections.reader.classList.contains('active')) {
        updateComicDisplay();
    }
}, 250));

console.log('Kobebe Komik App initialized successfully!');
