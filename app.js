/**
 * Hina Habiba - Official Naat Khawan Website JavaScript
 * Handles navigation, repertoire filtering, YouTube theater modal player,
 * booking validation, WhatsApp messaging, and interactive clipboard tools.
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Mobile Menu Handling ---
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active', isOpen);
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
      });
    });
  }

  // --- 2. Active Navigation Highlight & Sticky Header ---
  const siteHeader = document.getElementById('siteHeader');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Sticky header shadow effect
    if (scrollY > 40) {
      siteHeader.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
    } else {
      siteHeader.style.boxShadow = 'none';
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Active Section Spy
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 3. Kalaam Repertoire Filtering ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const kalaamCards = document.querySelectorAll('.kalaam-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      kalaamCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.classList.remove('hide');
        } else {
          card.classList.add('hide');
        }
      });
    });
  });

  // --- 4. Interactive Theater Video Modal (Streams YouTube) ---
  const videoModal = document.getElementById('videoModal');
  const modalIframe = document.getElementById('modalIframe');
  const modalVideoTitle = document.getElementById('modalVideoTitle');
  const modalYtDirectLink = document.getElementById('modalYtDirectLink');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalCloseBtn2 = document.getElementById('modalCloseBtn2');
  const modalBackdrop = document.getElementById('modalBackdrop');

  window.openVideoModal = function(videoId, title) {
    if (!videoModal || !modalIframe) return;

    if (modalVideoTitle) {
      modalVideoTitle.textContent = title || 'Hina Habiba Naat';
    }

    if (modalYtDirectLink) {
      modalYtDirectLink.href = `https://www.youtube.com/watch?v=${videoId}`;
    }

    // Set embed url with autoplay
    modalIframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    videoModal.classList.add('open');
    videoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  function closeVideoModal() {
    if (!videoModal || !modalIframe) return;
    modalIframe.src = ''; // stop playback immediately
    videoModal.classList.remove('open');
    videoModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeVideoModal);
  if (modalCloseBtn2) modalCloseBtn2.addEventListener('click', closeVideoModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeVideoModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal && videoModal.classList.contains('open')) {
      closeVideoModal();
    }
  });

  // --- 5. 1-Click Email Copying ---
  const btnCopyEmail = document.getElementById('btnCopyEmail');
  const officialEmailText = document.getElementById('officialEmailText');
  const copyTooltip = document.querySelector('.copy-tooltip');

  if (btnCopyEmail && officialEmailText) {
    btnCopyEmail.addEventListener('click', async () => {
      const email = officialEmailText.textContent.trim();
      try {
        await navigator.clipboard.writeText(email);
        if (copyTooltip) {
          copyTooltip.classList.add('show');
          setTimeout(() => {
            copyTooltip.classList.remove('show');
          }, 2000);
        }
        showFloatingNotification(`Email copied to clipboard: ${email}`);
      } catch (err) {
        showFloatingNotification(`Email: ${email}`);
      }
    });
  }

  // --- 6. Mehfil Booking & Inquiry Form Handling ---
  const inquiryForm = document.getElementById('mehfilInquiryForm');
  const formFeedback = document.getElementById('formFeedback');
  const btnSubmitWhatsApp = document.getElementById('btnSubmitWhatsApp');

  function validateInquiryForm() {
    let isValid = true;
    const requiredInputs = inquiryForm.querySelectorAll('[required]');

    requiredInputs.forEach(input => {
      const parent = input.closest('.form-group');
      if (!input.value.trim()) {
        isValid = false;
        if (parent) parent.classList.add('has-error');
      } else {
        if (parent) parent.classList.remove('has-error');
      }
    });

    return isValid;
  }

  function getFormInquiryData() {
    return {
      hostName: document.getElementById('hostName').value.trim(),
      phone: document.getElementById('contactPhone').value.trim(),
      email: document.getElementById('contactEmail').value.trim(),
      eventType: document.getElementById('eventType').value,
      eventDate: document.getElementById('eventDate').value,
      city: document.getElementById('eventCity').value.trim(),
      audience: document.getElementById('expectedAudience').value,
      notes: document.getElementById('specialNotes').value.trim()
    };
  }

  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!validateInquiryForm()) {
        formFeedback.className = 'form-feedback error';
        formFeedback.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Please fill in all required fields indicated above.';
        return;
      }

      const data = getFormInquiryData();
      const refId = 'HH-' + Math.floor(1000 + Math.random() * 9000);

      // Simulation of submission
      formFeedback.className = 'form-feedback success';
      formFeedback.innerHTML = `
        <strong><i class="fa-solid fa-circle-check"></i> JazakAllah Khair, ${escapeHtml(data.hostName)}!</strong><br>
        Your inquiry for <strong>${escapeHtml(data.eventType)}</strong> on <strong>${escapeHtml(data.eventDate)}</strong> in <strong>${escapeHtml(data.city)}</strong> has been registered with reference ID: <strong>#${refId}</strong>.<br>
        Management will contact you at <em>${escapeHtml(data.phone)}</em> within 24 hours.
      `;

      showFloatingNotification(`Inquiry #${refId} registered successfully!`);
      inquiryForm.reset();
    });
  }

  // WhatsApp Pre-filled Event Dispatch
  if (btnSubmitWhatsApp) {
    btnSubmitWhatsApp.addEventListener('click', () => {
      const data = getFormInquiryData();
      
      const whatsappText = `Assalam o Alaikum Hina Habiba Management,
I would like to inquire about booking Sana Khawan Hina Habiba for our upcoming Mehfil.

*Organizer / Host:* ${data.hostName || 'Organizer'}
*Event Type:* ${data.eventType || 'Mehfil-e-Naat'}
*Date:* ${data.eventDate || 'To be confirmed'}
*City / Venue:* ${data.city || 'Pakistan'}
*Phone:* ${data.phone || 'N/A'}
*Email:* ${data.email || 'N/A'}
*Expected Audience:* ${data.audience || 'Standard'}
*Notes / Kalaam Requests:* ${data.notes || 'None'}

Please let us know about date availability and booking formalities. JazakAllah Khair!`;

      const encodedText = encodeURIComponent(whatsappText);
      const whatsappUrl = `https://wa.me/923000000000?text=${encodedText}`;
      window.open(whatsappUrl, '_blank');
    });
  }

  // --- 7. FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });

        // Toggle current item
        item.classList.toggle('active', !isActive);
      });
    }
  });

  // --- 8. Helper Notification Function ---
  function showFloatingNotification(message) {
    const alertEl = document.getElementById('floatingAlert');
    if (!alertEl) return;
    alertEl.textContent = message;
    alertEl.className = 'floating-alert success show';
    setTimeout(() => {
      alertEl.classList.remove('show');
    }, 3500);
  }

  function escapeHtml(string) {
    if (!string) return '';
    return String(string)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

});
