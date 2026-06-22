Origin V6 Mobile First + Formspree Fix

What changed:
1. property-pathway.html: removed repeated inline style blocks that overrode style.css.
2. assets/css/style.css: removed the old repeated mobile patch pile and added one clean mobile-first pathway section.
3. assets/js/wizard.js: replaced Netlify/root submission with Formspree endpoint https://formspree.io/f/mkolnoka.
4. assets/js/wizard.js: changed redirect from /thank-you.html to thank-you.html for GitHub Pages compatibility.

Deploy:
Upload contents directly to GitHub Pages repository root. Do not upload this folder as a nested folder.

Test:
https://catsheo-stack.github.io/OriginV6-Test/property-pathway.html?v=mobilefix1

