const puppeteer = require('puppeteer');

(async () => {
  console.log('Starting browser...');
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  // Listen to console logs
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err));

  console.log('Navigating to https://notehub-steel.vercel.app/login...');
  await page.goto('https://notehub-steel.vercel.app/login', { waitUntil: 'networkidle0' });

  console.log('Waiting for Google Login iframe to load...');
  await new Promise(r => setTimeout(r, 5000));
  
  console.log('Done capturing logs. Closing browser.');
  await browser.close();
})();
