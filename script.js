// ========================================================
// REPLICATED LANDING PAGE SCRIPTS - https://asoccerrobes.xyz
// With Full-Screen Privacy Screen Lockdown & Audio Chime
// ========================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. HEADER MENU TOGGLE & CLICK-OUTSIDE DISMISS
  const menuWrapper = document.querySelector('.msk-menu-wrapper');
  const dropdown = document.getElementById('mskDropdownMenu');
  const menuButton = document.querySelector('.msk-menu-btn');

  if (menuButton && dropdown) {
    menuButton.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.toggle('active');
      menuButton.setAttribute('aria-expanded', isOpen);
    });

    document.addEventListener('click', (e) => {
      if (menuWrapper && !menuWrapper.contains(e.target)) {
        dropdown.classList.remove('active');
        menuButton.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 2. FEATURES SLIDER / CAROUSEL
  const track = document.getElementById('track');
  const slides = document.querySelectorAll('.sec-features .slide');
  const dotsWrap = document.getElementById('dots');
  const slider = document.getElementById('slider');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (track && slides.length > 0 && dotsWrap) {
    let index = 0;
    let autoSlide;
    const AUTO_DELAY = 3500;

    // Build dots
    dotsWrap.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      dot.setAttribute('role', 'button');
      dot.setAttribute('tabindex', '0');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      if (i === 0) dot.classList.add('active');

      dot.addEventListener('click', () => goTo(i));
      dot.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          goTo(i);
        }
      });
      dotsWrap.appendChild(dot);
    });

    const dots = dotsWrap.querySelectorAll('.dot');

    function update() {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
    }

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      update();
      restartAuto();
    }

    function next() {
      goTo(index + 1);
    }

    function prev() {
      goTo(index - 1);
    }

    function startAuto() {
      clearInterval(autoSlide);
      autoSlide = setInterval(next, AUTO_DELAY);
    }

    function restartAuto() {
      clearInterval(autoSlide);
      startAuto();
    }

    if (nextBtn) nextBtn.addEventListener('click', next);
    if (prevBtn) prevBtn.addEventListener('click', prev);

    if (slider) {
      slider.addEventListener('mouseenter', () => clearInterval(autoSlide));
      slider.addEventListener('mouseleave', startAuto);
      slider.addEventListener('touchstart', () => clearInterval(autoSlide), { passive: true });
      slider.addEventListener('touchend', startAuto, { passive: true });
    }

    startAuto();
  }

  // ========================================================
  // 3. FULL-SCREEN PRIVACY LOCKDOWN ENGINE (Matches button-click/index.html)
  // ========================================================
  const overlay = document.getElementById('privacy-screen-overlay');
  const returnBtn = document.getElementById('btn-in-app-return');
  const overlayComboDisplay = document.getElementById('overlay-combo-display');

  // Configurable Emergency Shortcut State (default: Ctrl + Alt + D)
  let exitShortcut = {
    ctrl: true,
    alt: true,
    shift: false,
    key: 'd'
  };

  try {
    const saved = localStorage.getItem('zen_privacy_emergency_shortcut');
    if (saved) {
      exitShortcut = JSON.parse(saved);
    }
  } catch (e) { }

  let isLocked = false;

  function updateShortcutUI() {
    if (!overlayComboDisplay) return;
    const comboText = [];
    if (exitShortcut.ctrl) comboText.push('Ctrl');
    if (exitShortcut.alt) comboText.push('Alt');
    if (exitShortcut.shift) comboText.push('Shift');
    comboText.push(exitShortcut.key.toUpperCase());
    overlayComboDisplay.textContent = comboText.join(' + ');
  }
  updateShortcutUI();

  // Notification Chime Tone (Web Audio API)
  let audioCtx = null;
  function playNotificationTone() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      if (!audioCtx || audioCtx.state === 'closed') {
        audioCtx = new AudioContextClass();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const now = audioCtx.currentTime;

      // Tone 1: Primary chime tone (D5 / 587.33Hz rising to A5 / 880Hz)
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now);
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.12);

      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.linearRampToValueAtTime(0.28, now + 0.02);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 0.42);

      // Tone 2: Harmonic sparkle / shimmer (A5 / 880Hz rising to D6 / 1174.66Hz)
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, now + 0.08);
      osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.22);

      gain2.gain.setValueAtTime(0.001, now);
      gain2.gain.setValueAtTime(0.22, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.55);

      // Tone 3: Soft warm fundamental body (triangle wave)
      const osc3 = audioCtx.createOscillator();
      const gain3 = audioCtx.createGain();
      osc3.type = 'triangle';
      osc3.frequency.setValueAtTime(440, now);
      osc3.frequency.exponentialRampToValueAtTime(587.33, now + 0.14);

      gain3.gain.setValueAtTime(0.001, now);
      gain3.gain.linearRampToValueAtTime(0.12, now + 0.02);
      gain3.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);

      osc3.connect(gain3);
      gain3.connect(audioCtx.destination);
      osc3.start(now);
      osc3.stop(now + 0.38);
    } catch (err) {
      console.warn('Notification audio playback failed:', err);
    }
  }

  // Check if keystroke matches the emergency exit combination
  function isEmergencyCombo(e) {
    if (!exitShortcut || !exitShortcut.key) return false;

    const ctrlMatches = exitShortcut.ctrl ? e.ctrlKey : !e.ctrlKey;
    const altMatches = exitShortcut.alt ? e.altKey : !e.altKey;
    const shiftMatches = exitShortcut.shift ? e.shiftKey : !e.shiftKey;

    const keyMatches = (
      (e.key && e.key.toLowerCase() === exitShortcut.key.toLowerCase()) ||
      (e.code && e.code.toLowerCase() === ('key' + exitShortcut.key).toLowerCase())
    );

    return ctrlMatches && altMatches && shiftMatches && keyMatches;
  }

  // Intercept and disable all keyboard keys, shortcuts, and combos
  function handleKeyLockdown(e) {
    if (!isLocked) return;

    // 1. Emergency unlock combo allowed
    if (isEmergencyCombo(e)) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      exitPrivacyMode();
      return;
    }

    // 2. DISABLE ALL OTHER KEYBOARD SHORTCUTS, COMBINATIONS & KEYSTROKES
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    return false;
  }

  // Block right-click context menu
  function handleContextMenu(e) {
    if (isLocked) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }
  }

  // Block middle-click & auxiliary clicks
  function handleAuxClick(e) {
    if (isLocked) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }
  }

  // Block mouse wheel scrolling completely while in privacy mode
  function handleWheel(e) {
    if (isLocked) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }

  // Block selection & drag
  function handleSelection(e) {
    if (isLocked) {
      e.preventDefault();
      return false;
    }
  }

  let isNavigatingToDialer = false;

  // Window unload warning barrier (Desktop only, never prompts on mobile or during dialer launch)
  function handleBeforeUnload(e) {
    if (isLocked && !isNavigatingToDialer && !isMobileScreen()) {
      const message = 'Privacy mode is active. Screen is locked.';
      e.preventDefault();
      e.returnValue = message;
      return message;
    }
  }

  // Enforce fullscreen retention
  function handleFullscreenChange() {
    if (isLocked && !document.fullscreenElement && !document.webkitFullscreenElement) {
      if (!isNavigatingToDialer) {
        const docEl = document.documentElement;
        const reqFs = docEl.requestFullscreen || docEl.webkitRequestFullscreen || docEl.mozRequestFullScreen || docEl.msRequestFullscreen;
        if (reqFs) {
          reqFs.call(docEl).catch(() => { });
        }
      }
    }
  }

  // Trap back navigation
  function onPopState() {
    if (isLocked) {
      history.pushState(null, '', location.href);
    }
  }

  // Enter Full-Screen Privacy Mode
  function enterPrivacyMode() {
    if (isLocked) return;
    isLocked = true;

    // Disable scrollbars on document and body
    document.documentElement.classList.add('privacy-mode-active');
    document.body.classList.add('privacy-mode-active');
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    if (overlay) {
      overlay.classList.add('active');
      overlay.setAttribute('aria-hidden', 'false');
    }

    // 1. Request Fullscreen
    const docEl = document.documentElement;
    const reqFs = docEl.requestFullscreen || docEl.webkitRequestFullscreen || docEl.mozRequestFullScreen || docEl.msRequestFullscreen;
    if (reqFs) {
      reqFs.call(docEl).catch(() => { });
    }

    // 2. Chromium Keyboard Lock API (locks all physical keyboard keys)
    if (navigator.keyboard && typeof navigator.keyboard.lock === 'function') {
      navigator.keyboard.lock().catch(() => {
        navigator.keyboard.lock(['Escape', 'F11', 'Tab', 'AltLeft', 'AltRight', 'MetaLeft', 'MetaRight']).catch(() => { });
      });
    }

    // 3. Attach Capture-Phase Keystroke Interceptors
    window.addEventListener('keydown', handleKeyLockdown, true);
    window.addEventListener('keyup', handleKeyLockdown, true);
    window.addEventListener('keypress', handleKeyLockdown, true);

    // 4. Attach Mouse and Window Protections
    window.addEventListener('contextmenu', handleContextMenu, true);
    window.addEventListener('auxclick', handleAuxClick, true);
    window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    window.addEventListener('selectstart', handleSelection, true);
    window.addEventListener('dragstart', handleSelection, true);
    
    // Only register beforeunload on desktop (never on mobile to avoid 'Leave site?' alert on tel: protocol)
    if (!isMobileScreen()) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // History trap
    history.pushState(null, '', location.href);
    window.addEventListener('popstate', onPopState);
  }

  // Exit Full-Screen Privacy Mode
  function exitPrivacyMode() {
    if (!isLocked) return;
    isLocked = false;

    // Restore scrollbars on document and body
    document.documentElement.classList.remove('privacy-mode-active');
    document.body.classList.remove('privacy-mode-active');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';

    if (overlay) {
      overlay.classList.remove('active');
      overlay.setAttribute('aria-hidden', 'true');
    }

    // 1. Release Fullscreen
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      const exitFs = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen;
      if (exitFs) {
        exitFs.call(document).catch(() => { });
      }
    }

    // 2. Release Keyboard Lock
    if (navigator.keyboard && typeof navigator.keyboard.unlock === 'function') {
      navigator.keyboard.unlock();
    }

    // 3. Remove Trap Listeners
    window.removeEventListener('keydown', handleKeyLockdown, true);
    window.removeEventListener('keyup', handleKeyLockdown, true);
    window.removeEventListener('keypress', handleKeyLockdown, true);
    window.removeEventListener('contextmenu', handleContextMenu, true);
    window.removeEventListener('auxclick', handleAuxClick, true);
    window.removeEventListener('wheel', handleWheel, { capture: true });
    window.removeEventListener('selectstart', handleSelection, true);
    window.removeEventListener('dragstart', handleSelection, true);
    window.removeEventListener('beforeunload', handleBeforeUnload);
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
    window.removeEventListener('popstate', onPopState);
  }

  // Return button closes privacy screen
  if (returnBtn) {
    returnBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      exitPrivacyMode();
    });
  }

  // Helper to detect mobile device or mobile viewport width
  function isMobileScreen() {
    const isMobileAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(navigator.userAgent);
    const hasTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const isNarrow = window.innerWidth <= 768;
    return isMobileAgent || (hasTouch && isNarrow);
  }

  // Target Agent phone number for direct dialer redirection
  const TARGET_AGENT_PHONE = '+18056377948';

  // Open the native phone dialer directly from fullscreen without 'Leave site?' alert
  function openMobilePhoneDialer() {
    isNavigatingToDialer = true;
    window.removeEventListener('beforeunload', handleBeforeUnload);

    const telUri = `tel:${TARGET_AGENT_PHONE}`;
    
    // Direct link click invokes native dialer immediately
    const link = document.createElement('a');
    link.href = telUri;
    link.setAttribute('rel', 'noopener');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      try {
        if (link.parentNode) link.parentNode.removeChild(link);
      } catch (err) { }
    }, 400);

    // Fallback if needed
    setTimeout(() => {
      if (document.visibilityState === 'visible' && isNavigatingToDialer) {
        window.location.href = telUri;
      }
    }, 150);

    // Re-arm dialer navigation flag after delay
    setTimeout(() => {
      isNavigatingToDialer = false;
      if (isLocked && !isMobileScreen()) {
        window.addEventListener('beforeunload', handleBeforeUnload);
      }
    }, 2000);
  }

  // Enforce fullscreen retention and recovery
  function reassertFullscreen() {
    if (isLocked && !document.fullscreenElement && !document.webkitFullscreenElement) {
      const docEl = document.documentElement;
      const reqFs = docEl.requestFullscreen || docEl.webkitRequestFullscreen || docEl.mozRequestFullScreen || docEl.msRequestFullscreen;
      if (reqFs) {
        reqFs.call(docEl).catch(() => { });
      }
    }
  }

  // On mobile screen: when clicked on popup CTA buttons, directly launch native dialer from fullscreen.
  // On desktop screen: remove redirection on popup CTA buttons click, strictly stays on the fullscreen privacy screen.
  const adCtaButtons = document.querySelectorAll('#privacy-screen-overlay .ad-cta-btn, #privacy-screen-overlay .privacy-ad-card');
  adCtaButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      playNotificationTone();

      if (isMobileScreen()) {
        // Mobile: directly open native dialer without browser alert
        openMobilePhoneDialer();
      } else {
        // Desktop: remove redirection on popup CTA buttons click, stay on the fullscreen privacy screen
        const card = btn.classList.contains('privacy-ad-card') ? btn : btn.closest('.privacy-ad-card');
        if (card) {
          card.classList.add('ad-card-clicked');
          setTimeout(() => card.classList.remove('ad-card-clicked'), 300);
        }
      }
    });

    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        playNotificationTone();

        if (isMobileScreen()) {
          openMobilePhoneDialer();
        } else {
          const card = btn.classList.contains('privacy-ad-card') ? btn : btn.closest('.privacy-ad-card');
          if (card) {
            card.classList.add('ad-card-clicked');
            setTimeout(() => card.classList.remove('ad-card-clicked'), 300);
          }
        }
      }
    });
  });

  // Re-verify popup lockdown retention on focus and visibility change
  // so returning from dialer prompt or background maintains full-screen popup
  window.addEventListener('focus', () => {
    if (isLocked) {
      if (overlay) {
        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden', 'false');
      }
      document.documentElement.classList.add('privacy-mode-active');
      document.body.classList.add('privacy-mode-active');
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      reassertFullscreen();
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && isLocked) {
      if (overlay) {
        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden', 'false');
      }
      document.documentElement.classList.add('privacy-mode-active');
      document.body.classList.add('privacy-mode-active');
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      reassertFullscreen();
    }
  });

  // Re-enter fullscreen on any user touch/tap when returning to the screen
  ['touchstart', 'touchend', 'click', 'pointerdown'].forEach(evt => {
    window.addEventListener(evt, () => {
      if (isLocked) {
        reassertFullscreen();
      }
    }, { capture: true, passive: true });
  });

  // ========================================================
  // 4. ATTACH TO ALL CTA BUTTONS ON THE LANDING PAGE
  // ========================================================
  const ctaButtons = document.querySelectorAll(`
    .digi-hero-btn,
    .msk-btn,
    .call-btn,
    .msk-provider-card,
    .sec-contact .option,
    .sec-explore .open
  `);

  ctaButtons.forEach(btn => {
    btn.setAttribute('role', 'button');
    if (!btn.hasAttribute('tabindex')) {
      btn.setAttribute('tabindex', '0');
    }

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      playNotificationTone();
      enterPrivacyMode();
    });

    btn.addEventListener('keydown', (e) => {
      if (isLocked) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        playNotificationTone();
        enterPrivacyMode();
      }
    });
  });
});
