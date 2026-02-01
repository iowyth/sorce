// SORCE Collective - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Mobile navigation toggle
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');
  const headerHorseshoe = document.querySelector('.header-horseshoe');

  if (navToggle && siteNav && headerHorseshoe) {
    navToggle.addEventListener('click', function() {
      siteNav.classList.toggle('active');
      navToggle.classList.toggle('active');
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
  document.querySelectorAll('pre').forEach(function(block) {
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

  // Wiki navigation: scroll to top when clicking sidebar links
  const wikiNav = document.querySelector('.wiki-nav');
  if (wikiNav) {
    wikiNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function() {
        // Small delay to allow page load, then scroll to top
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 50);
      });
    });
  }
});
