// SORCE Collective - Main JavaScript

(function() {
  // Page transition system for continuous animation
  function initPageTransitions() {
    // Only enable if we have the animation container
    if (!document.getElementById('mobius-container')) return;

    function isInternalLink(link) {
      if (!link.href) return false;
      if (link.target === '_blank') return false;
      if (link.href.startsWith('mailto:')) return false;
      if (link.href.startsWith('tel:')) return false;
      if (link.href.includes('#') && link.pathname === window.location.pathname) return false;

      try {
        const url = new URL(link.href);
        return url.origin === window.location.origin;
      } catch {
        return false;
      }
    }

    async function navigateTo(url) {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Page not found');

        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Get new main content
        const newMain = doc.querySelector('.site-main');
        const currentMain = document.querySelector('.site-main');

        if (newMain && currentMain) {
          // Fade out current content
          currentMain.style.opacity = '0';
          currentMain.style.transition = 'opacity 0.15s ease';

          await new Promise(r => setTimeout(r, 150));

          // Replace content
          currentMain.innerHTML = newMain.innerHTML;

          // Update page title
          const newTitle = doc.querySelector('title');
          if (newTitle) document.title = newTitle.textContent;

          // Update URL
          history.pushState({}, '', url);

          // Fade in new content
          currentMain.style.opacity = '1';

          // Scroll to top
          window.scrollTo({ top: 0, behavior: 'instant' });

          // Re-initialize dynamic content
          initDynamicContent();
        }
      } catch (error) {
        // Fallback to regular navigation
        window.location.href = url;
      }
    }

    // Intercept clicks on internal links
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a');
      if (!link) return;
      if (!isInternalLink(link)) return;

      e.preventDefault();
      navigateTo(link.href);
    });

    // Handle browser back/forward
    window.addEventListener('popstate', function() {
      navigateTo(window.location.href);
    });
  }

  // Initialize dynamic content (call after page transitions)
  function initDynamicContent() {
    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const siteNav = document.querySelector('.site-nav');
    const headerHorseshoe = document.querySelector('.header-horseshoe');

    if (navToggle && siteNav && headerHorseshoe) {
      // Remove old listeners by cloning
      const newToggle = navToggle.cloneNode(true);
      navToggle.parentNode.replaceChild(newToggle, navToggle);

      newToggle.addEventListener('click', function() {
        siteNav.classList.toggle('active');
        newToggle.classList.toggle('active');
        headerHorseshoe.classList.toggle('nav-open');
      });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Add copy button to code blocks
    document.querySelectorAll('pre:not(.has-copy-btn)').forEach(function(block) {
      block.classList.add('has-copy-btn');
      const button = document.createElement('button');
      button.className = 'copy-code';
      button.textContent = 'Copy';
      button.style.cssText = `
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        padding: 0.25rem 0.5rem;
        font-size: 0.75rem;
        background: rgba(255,255,255,0.1);
        border: 1px solid rgba(255,255,255,0.2);
        border-radius: 4px;
        color: #fff;
        cursor: pointer;
      `;

      block.style.position = 'relative';
      block.appendChild(button);

      button.addEventListener('click', function() {
        const code = block.querySelector('code') || block;
        navigator.clipboard.writeText(code.textContent).then(function() {
          button.textContent = 'Copied!';
          setTimeout(() => button.textContent = 'Copy', 2000);
        });
      });
    });

    // External link handling
    document.querySelectorAll('a[href^="http"]').forEach(link => {
      if (!link.href.includes(window.location.hostname)) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', function() {
    initPageTransitions();
    initDynamicContent();
  });
})();
