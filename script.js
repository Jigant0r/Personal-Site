/* ============================================================
   script.js — stevenq.me
   Features:
   1. Active nav link highlighting on scroll
   2. Smooth scroll (browsers that need a JS fallback)
   3. Expanding project cards on click
   4. Skill progress bar animation on scroll into view
   ============================================================ */


/* ============================================================
   1. ACTIVE NAV HIGHLIGHTING
   As the user scrolls, we check which section is currently
   in view and highlight the matching nav link.

   HOW IT WORKS:
   - IntersectionObserver watches each <section> element
   - When a section crosses the viewport threshold, we find
     the nav <a> whose href matches that section's id
   - We remove .active from all nav links, then add it to
     the matching one
   ============================================================ */

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Remove active from all links
      navLinks.forEach(link => link.classList.remove('active'));

      // Find the link that matches this section's id
      const activeLink = document.querySelector(
        `.nav-links a[href="#${entry.target.id}"]`
      );
      if (activeLink) activeLink.classList.add('active');
    }
  });
}, {
  // Trigger when section is at least 40% visible
  threshold: 0.4
});

sections.forEach(section => navObserver.observe(section));


/* ============================================================
   2. SMOOTH SCROLL
   Modern browsers handle smooth scroll via CSS, but this
   JS fallback handles the nav link clicks explicitly and
   also closes any open project cards when jumping sections.
   ============================================================ */

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href');

    // Only handle internal anchor links
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
   Each project card gets a click listener. Clicking a card
   toggles it open to reveal more detail content.

   HOW IT WORKS:
   - Cards have a .card-detail div that's hidden by default
   - On click, we toggle the .expanded class on the card
   - CSS handles the animation (max-height transition)
   - Clicking an already-open card closes it
   - Clicking a new card closes the previously open one
   ============================================================ */

const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
  card.addEventListener('click', () => {
    const isExpanded = card.classList.contains('expanded');

    // Close all cards first
    projectCards.forEach(c => c.classList.remove('expanded'));

    // If the clicked card wasn't already open, open it
    if (!isExpanded) {
      card.classList.add('expanded');
    }
  });
});


/* ============================================================
   4. SKILL PROGRESS BAR ANIMATION
   Progress bars start at 0 width and animate to their
   target width when they scroll into view.

   HOW IT WORKS:
   - Each .progress-bar has a data-width attribute (e.g. "85")
   - IntersectionObserver watches the .skills-grid container
   - When it enters the viewport, we set each bar's width
     to its data-width value, triggering the CSS transition
   - We only animate once (observer disconnects after firing)
   ============================================================ */

const skillsGrid = document.querySelector('.skills-grid');
const progressBars = document.querySelectorAll('.progress-bar');

if (skillsGrid && progressBars.length > 0) {
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger each bar slightly for a nicer effect
        progressBars.forEach((bar, index) => {
          setTimeout(() => {
            const targetWidth = bar.getAttribute('data-width');
            bar.style.width = targetWidth + '%';
          }, index * 120);
        });

        // Only animate once
        skillObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  skillObserver.observe(skillsGrid);
}


/* ============================================================
   5. FADE-IN ON SCROLL (bonus — subtle polish)
   Sections fade in as they enter the viewport.
   Adds a .visible class which CSS transitions handle.
   ============================================================ */

const fadeElements = document.querySelectorAll('section');

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

fadeElements.forEach(el => fadeObserver.observe(el));
