/* ============================================================
   script.js — stevenq.me
   Features:
   1. Active nav link highlighting on scroll
   2. Smooth scroll
   3. Expanding project cards on click
   4. Lightbox — click any project photo to view fullscreen
   ============================================================ */


/* ============================================================
   1. ACTIVE NAV HIGHLIGHTING
   IntersectionObserver watches each section. When a section
   enters the viewport, the matching nav link gets .active
   ============================================================ */

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.remove('active'));
      const activeLink = document.querySelector(
        `.nav-links a[href="#${entry.target.id}"]`
      );
      if (activeLink) activeLink.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => navObserver.observe(section));


/* ============================================================
   2. SMOOTH SCROLL
   Handles nav link clicks and scrolls smoothly to target
   ============================================================ */

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href');
    if (targetId && targetId.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});


/* ============================================================
   3. EXPANDING PROJECT CARDS
   Click a card to toggle .expanded which reveals .card-detail
   Clicking an open card closes it. Clicking a new card
   closes the previously open one first.
   ============================================================ */

const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
  card.addEventListener('click', (e) => {
    // Don't collapse card when clicking a photo inside it
    if (e.target.tagName === 'IMG') return;

    const isExpanded = card.classList.contains('expanded');
    projectCards.forEach(c => c.classList.remove('expanded'));
    if (!isExpanded) card.classList.add('expanded');
  });
});


/* ============================================================
   4. LIGHTBOX
   Click any image inside .project-gallery to open it
   fullscreen. Click the overlay or close button to dismiss.

   HOW IT WORKS:
   - We create a lightbox overlay div once and append it to body
   - When a gallery image is clicked, we set the lightbox img src
     to match and show the overlay
   - Clicking outside the image or the X button hides it again
   ============================================================ */

// Build the lightbox HTML once
const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
lightbox.innerHTML = `
  <div id="lightbox-overlay">
    <button id="lightbox-close">&times;</button>
    <img id="lightbox-img" src="" alt="Project photo" />
  </div>
`;
document.body.appendChild(lightbox);

const lightboxEl      = document.getElementById('lightbox');
const lightboxImg     = document.getElementById('lightbox-img');
const lightboxClose   = document.getElementById('lightbox-close');

// Open lightbox when a gallery image is clicked
document.addEventListener('click', (e) => {
  if (e.target.closest('.project-gallery') && e.target.tagName === 'IMG') {
    lightboxImg.src = e.target.src;
    lightboxImg.alt = e.target.alt;
    lightboxEl.classList.add('active');
    document.body.style.overflow = 'hidden'; // prevent background scroll
  }
});

// Close on X button
lightboxClose.addEventListener('click', closeLightbox);

// Close when clicking outside the image
lightboxEl.addEventListener('click', (e) => {
  if (e.target === lightboxEl || e.target.id === 'lightbox-overlay') {
    closeLightbox();
  }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

function closeLightbox() {
  lightboxEl.classList.remove('active');
  document.body.style.overflow = ''; // restore scroll
  // Small delay before clearing src so fade-out looks clean
  setTimeout(() => { lightboxImg.src = ''; }, 300);
}


/* ============================================================
   5. FADE-IN ON SCROLL (subtle polish)
   Sections fade up as they enter the viewport
   ============================================================ */

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach(el => fadeObserver.observe(el));
