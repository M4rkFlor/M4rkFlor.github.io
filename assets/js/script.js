// Function to set the theme and update UI
$(function() {
    
 function setTheme(theme) {
    document.body.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
    var switchThemeBtn = document.getElementById('switchTheme');
    if (switchThemeBtn) {
        switchThemeBtn.innerHTML = theme === 'dark' ?  '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-stars-fill"></i>';
    }
    //console.log(`Switched to ${theme} theme`);
}

var currentTheme = localStorage.getItem('theme') || 'dark';
setTheme(currentTheme);

// Event listener for the switch theme button
var switchThemeBtn = document.getElementById('switchTheme');
if (switchThemeBtn) {
    switchThemeBtn.addEventListener('click', () => {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(currentTheme);
    });
}

//AOS Initiliaze
AOS.init();

// Fixed Header & back to top button on Scroll
window.addEventListener('scroll', () => {
    // fixed header
    // const header = document.getElementById('header');
    // if (window.scrollY > 30 && !header.classList.contains('fixed-top')) {
    //     header.classList.add('fixed-top');
    //     document.getElementById('offcanvasNavbar').classList.add('fixedHeaderNavbar');
    // } else if (window.scrollY <= 30 && header.classList.contains('fixed-top')) {
    //     header.classList.remove('fixed-top');
    //     document.getElementById('offcanvasNavbar').classList.remove('fixedHeaderNavbar');
    // }

    //backtotop
    const backToTopButton = document.getElementById("backToTopButton");
    if (window.scrollY > 400 && backToTopButton.style.display === 'none') {
        backToTopButton.style.display = 'block';
    } else if (window.scrollY <= 400 && backToTopButton.style.display === 'block') {
        backToTopButton.style.display = 'none';
    }
});




//jumping to top function
function scrollToTop(){
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}


  

/*--------- Light Box ------------*/


// Get elements
const lightbox = document.getElementById("lightbox-modal");
const lightboxImg = document.getElementById("lightbox-img");
const closeBtn = document.querySelector(".close");
const projectCardImages = document.querySelectorAll(".lightbox-image");

// Function to get the navbar dynamically
function getNavbar() {
    return document.querySelector(".fixed-top");
}

// Function to get scrollbar width
function getScrollbarWidth() {
    // Create a temporary div element
    const div = document.createElement('div');
    div.style.overflow = 'scroll'; // Force scrollbar to appear
    div.style.width = '100px';
    div.style.height = '100px';
    div.style.position = 'absolute';
    div.style.top = '-9999px'; // Hide off-screen
    document.body.appendChild(div);
    const scrollbarWidth = div.offsetWidth - div.clientWidth; // Calculate scrollbar width
    document.body.removeChild(div); // Remove the temporary element
    return scrollbarWidth;
}

// Function to toggle scroll behavior
function toggleScroll(shouldDisable) {
    const body = document.body;
    const scrollbarWidth = getScrollbarWidth(); // Get the scrollbar width

    if (shouldDisable) {
        // Disable scrolling
        body.style.overflow = 'hidden'; // Prevent scrolling
        body.style.paddingRight = `${scrollbarWidth}px`; // Adjust for scrollbar width
    } else {
        // Enable scrolling
        body.style.overflow = ''; // Re-enable scrolling
        body.style.paddingRight = ''; // Reset padding
    }
}

// Open lightbox on each image click
projectCardImages.forEach(image => {
    image.onclick = function() {
        lightbox.style.display = "block"; // Show the lightbox
        setTimeout(() => {
            lightbox.style.opacity = 1; // Fade in the modal
        }, 10); // Small timeout to trigger the CSS transition

        lightboxImg.src = this.src;
        toggleScroll(true); // Disable scrolling

        const navbar = getNavbar(); // Get the navbar
        if (navbar) {
            navbar.classList.add("hidden"); // Change navbar position
        }

        // Fade in the image
        setTimeout(() => {
            lightboxImg.style.opacity = 1; // Fade in the image slowly
        }, 10); // Small timeout to trigger the CSS transition
    };
});

// Close lightbox on close button or click outside image
closeBtn.onclick = function() {
    closeLightbox();
};

lightbox.onclick = function(event) {
    if (event.target === lightbox) {
        closeLightbox();
    }
};

// Close lightbox on pressing Escape key
document.onkeydown = function(event) {
    if (event.key === "Escape") {
        closeLightbox();
    }
};



// Function to close lightbox
function closeLightbox() {
    const navbar = getNavbar(); // Get the navbar dynamically

    lightboxImg.style.opacity = 0; // Fade out the image quickly
    lightbox.style.opacity = 0; // Fade out the modal quickly

    // Set a timeout to wait for the fade-out to complete
    setTimeout(() => {
        lightbox.style.display = "none"; // Hide lightbox after fade out
        toggleScroll(false); // Re-enable scrolling
        
        if (navbar) {
            navbar.classList.remove("hidden"); // Restore navbar position after fade out
        }
    }, 300); // Match this to the fade-out duration
}
});
