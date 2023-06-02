let prevScrollpos = window.pageYOffset || 0;

AOS.init({
  offset: 120,
  delay: 0,
  duration: 600,
  easing: 'ease',
  once: false,
  mirror: false,
  anchorPlacement: 'top-bottom',
});

let mybutton = document.getElementById("myBtn");

window.onscroll = function () {
  scrollFunction();
  toggleNavbar();
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

function topFunction() {
  document.body.scrollTop = 0; // Para Safari
  document.documentElement.scrollTop = 0; // Para Chrome, Firefox, IE y Opera
  toggleNavbar();
}

function toggleNavbar() {
  var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.querySelector('.navbar').classList.remove('hidden');
  } else {
    document.querySelector('.navbar').classList.add('hidden');
  }
  prevScrollpos = currentScrollPos;
}

function collapseNavbar() {
  const navbarCollapse = document.getElementById('navbarNav');
  const navbarToggle = document.querySelector('.navbar-toggler');
  if (navbarCollapse.classList.contains('show')) {
    navbarCollapse.classList.remove('show');
    navbarToggle.setAttribute('aria-expanded', 'false');
  }
}
