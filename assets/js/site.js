
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const closeMenu = document.getElementById('closeMenu');
if(menuBtn && mobileMenu) menuBtn.addEventListener('click', () => mobileMenu.hidden = false);
if(closeMenu && mobileMenu) closeMenu.addEventListener('click', () => mobileMenu.hidden = true);
