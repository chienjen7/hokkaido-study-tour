document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Header Scrolled class toggle
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Scroll Spy & Active Nav Links
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('nav a');
  
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  });

  // 3. Intersection Observer for Fade-in & Slide-in animations
  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        animationObserver.unobserve(entry.target); // Trigger only once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  // Observe Timeline Items
  const timelineItems = document.querySelectorAll('.timeline-item');
  timelineItems.forEach(item => {
    animationObserver.observe(item);
  });

  // Observe Stats Items
  const statItems = document.querySelectorAll('.stat-item');
  statItems.forEach(item => {
    animationObserver.observe(item);
  });

  // 4. Numerical Count-Up Animation (support integers and floats)
  const statsSection = document.getElementById('stats');
  let animated = false;

  const countUp = (element) => {
    const rawTarget = element.getAttribute('data-target');
    const isFloat = rawTarget.includes('.');
    const target = isFloat ? parseFloat(rawTarget) : parseInt(rawTarget, 10);
    const duration = 2000; // Animation duration in ms
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out cubic formula
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      let currentVal = easeProgress * target;

      if (isFloat) {
        // limit to 2 decimal places for floats
        element.textContent = currentVal.toFixed(2);
      } else {
        element.textContent = Math.floor(currentVal).toLocaleString();
      }

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        element.textContent = isFloat ? target.toFixed(2) : target.toLocaleString();
      }
    };

    requestAnimationFrame(updateCount);
  };

  const startStatsAnimation = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => countUp(counter));
        animated = true; // Run only once
        startStatsAnimation.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });

  if (statsSection) {
    startStatsAnimation.observe(statsSection);
  }

  // 5. RWD Premium Modal & Drawer Logic
  const modalOverlay = document.getElementById('modal-overlay');
  const modalClose = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalContent = document.getElementById('modal-content');
  const expandButtons = document.querySelectorAll('.expand-btn');

  const openModal = (title, contentHTML) => {
    modalTitle.textContent = title;
    modalContent.innerHTML = contentHTML;
    modalOverlay.classList.add('active');
    
    // Lock body scroll and prevent bounce on iOS
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modalOverlay.classList.remove('active');
    // Restore scroll
    document.body.style.overflow = '';
  };

  expandButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.visit-card');
      const title = card.querySelector('.card-overlay h3').textContent;
      const contentHTML = card.querySelector('.card-details-data').innerHTML;
      
      openModal(title, contentHTML);
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      // Close only if clicked on the blurred overlay, not inside container
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  // Close modal on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
});
