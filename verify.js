const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('style.css', 'utf8');
const js = fs.readFileSync('script.js', 'utf8');

console.log('HTML size:', html.length);
console.log('CSS size:', css.length);
console.log('JS size:', js.length);

// Check if privacy overlay exists
console.log('Has #privacy-screen-overlay:', html.includes('id="privacy-screen-overlay"'));
console.log('Has #privacyAdsViewport:', html.includes('id="privacyAdsViewport"'));
console.log('Has #privacyAdsTrack:', html.includes('id="privacyAdsTrack"'));
console.log('Has #btn-in-app-return:', html.includes('id="btn-in-app-return"'));
console.log('Has #overlay-combo-display:', html.includes('id="overlay-combo-display"'));

// Count ad cards
const adCards = (html.match(/class="privacy-ad-card"/g) || []).length;
console.log('Privacy ad cards count:', adCards);

// Verify CTA selectors in HTML
const selectors = [
  'digi-hero-btn',
  'msk-btn',
  'call-btn',
  'msk-provider-card',
  'option',
  'open'
];

selectors.forEach(sel => {
  const count = (html.match(new RegExp('class="[^"]*' + sel + '[^"]*"', 'g')) || []).length;
  console.log('Selector .' + sel + ' count:', count);
});

// Verify CSS rules
console.log('CSS has #privacy-screen-overlay:', css.includes('#privacy-screen-overlay'));
console.log('CSS has scrollUpwards animation:', css.includes('@keyframes scrollUpwards'));
console.log('CSS has mask-image:', css.includes('mask-image: linear-gradient'));

// Verify JS rules
console.log('JS has enterPrivacyMode:', js.includes('function enterPrivacyMode'));
console.log('JS has exitPrivacyMode:', js.includes('function exitPrivacyMode'));
console.log('JS has handleKeyLockdown:', js.includes('function handleKeyLockdown'));
console.log('JS has playNotificationTone:', js.includes('function playNotificationTone'));
console.log('JS has keyboard.lock:', js.includes('navigator.keyboard.lock'));
