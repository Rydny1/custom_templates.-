document.addEventListener('DOMContentLoaded', function () {
  // Set Current Year in Footer
  document.getElementById('current-year').textContent = new Date().getFullYear();

  // --- Navbar Scroll Effect ---
  const navbar = document.getElementById('main-navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }
    });
  }

  // --- Single-Page App Navigation ---
  const pageLinks = document.querySelectorAll('.page-link');
  const pages = document.querySelectorAll('.page-content');
  const offcanvasElement = document.getElementById('mobileMenu');
  let mobileMenu = null;
  if (offcanvasElement) {
    mobileMenu = new bootstrap.Offcanvas(offcanvasElement);
  }
  const navLinks = document.querySelectorAll('.nav-link');

  function showPage(pageId) {
    // Hide all pages
    pages.forEach(page => {
      page.classList.remove('active');
    });

    // Show the target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
      targetPage.classList.add('active');
      window.scrollTo(0, 0); // Scroll to top
    }

    // Update active nav link
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.dataset.page === pageId) {
        link.classList.add('active');
      }
    });

    // Close mobile menu if open
    if (mobileMenu && offcanvasElement.classList.contains('show')) {
      mobileMenu.hide();
    }
  }

  // Add click listeners to all page links
  pageLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const pageId = this.dataset.page;
      if (pageId) {
        showPage(pageId);
        // Manually trigger fade-in for newly shown sections
        // This is a failsafe in case observer misses
        const newSections = document.querySelectorAll(
          `#${pageId} .fade-in-section:not(.is-visible)`
        );
        newSections.forEach(section => {
          // A small delay ensures the page is "visible" before animation
          setTimeout(() => {
            section.classList.add('is-visible');
          }, 100);
        });
      }
    });
  });

  // --- Intersection Observer for Fade-in Animations ---
  const sections = document.querySelectorAll('.fade-in-section');

  const observerOptions = {
    root: null, // relative to the viewport
    rootMargin: '0px',
    threshold: 0.1, // 10% of the item is visible
  };

  const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Stop observing once it's visible
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  sections.forEach(section => {
    observer.observe(section);
  });
});
