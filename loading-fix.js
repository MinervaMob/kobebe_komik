// ULTIMATE EMERGENCY LOADING SCREEN FIX
console.log('🚨 ULTIMATE Emergency loading fix loaded');

// Nuclear function to force hide loading
function nuclearHideLoading() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        // Try every possible way to hide it
        loadingScreen.style.setProperty('display', 'none', 'important');
        loadingScreen.style.setProperty('visibility', 'hidden', 'important');
        loadingScreen.style.setProperty('opacity', '0', 'important');
        loadingScreen.style.setProperty('z-index', '-99999', 'important');
        loadingScreen.style.setProperty('position', 'absolute', 'important');
        loadingScreen.style.setProperty('top', '-9999px', 'important');
        loadingScreen.style.setProperty('left', '-9999px', 'important');
        loadingScreen.style.setProperty('width', '0', 'important');
        loadingScreen.style.setProperty('height', '0', 'important');
        loadingScreen.style.setProperty('overflow', 'hidden', 'important');
        loadingScreen.style.setProperty('pointer-events', 'none', 'important');

        // Add class for CSS override
        loadingScreen.classList.add('nuclear-hidden');

        console.log('🚨 NUCLEAR: All hiding methods applied');
        return true;
    }
    console.log('❌ Loading screen element not found');
    return false;
}

// Add extreme CSS override
const extremeStyle = document.createElement('style');
extremeStyle.textContent = `
    .nuclear-hidden,
    #loadingScreen.nuclear-hidden,
    .loading-screen.nuclear-hidden {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        z-index: -99999 !important;
        position: absolute !important;
        top: -9999px !important;
        left: -9999px !important;
        width: 0 !important;
        height: 0 !important;
        overflow: hidden !important;
        pointer-events: none !important;
        transform: scale(0) !important;
    }
`;
document.head.appendChild(extremeStyle);

// Try immediately
nuclearHideLoading();

// Try multiple times with different delays
[500, 1000, 1500, 2000, 3000].forEach(delay => {
    setTimeout(nuclearHideLoading, delay);
});

// Continuous nuclear assault - every 200ms for 30 seconds
let nuclearAttempts = 0;
const nuclearInterval = setInterval(() => {
    nuclearAttempts++;
    nuclearHideLoading();

    // Stop after 150 attempts (30 seconds)
    if (nuclearAttempts > 150) {
        clearInterval(nuclearInterval);
        console.log('🚨 NUCLEAR: Stopped after 150 attempts');
    }
}, 200);

// Event-based nuclear strikes
['click', 'touchstart', 'keydown', 'scroll', 'mousemove'].forEach(event => {
    document.addEventListener(event, nuclearHideLoading, { once: true });
});

// Final solution - physically remove the element
setTimeout(() => {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        console.log('🚨 FINAL: Physically removing loading screen element');
        loadingScreen.remove();
    }
}, 10000); // After 10 seconds

console.log('🚨 ULTIMATE loading fix armed and ready');
