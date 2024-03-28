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
  if (prevScrollpos > currentScrollPos && window.innerWidth <= 991) {
    document.querySelector('.navbar').classList.remove('hidden');
  } else if (window.innerWidth <= 991) {
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

function calculateDaysAgo(articleDate) {
  var currentDate = new Date();
  var targetDate = new Date(articleDate);
  var timeDiff = currentDate.getTime() - targetDate.getTime();
  var daysAgo = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return daysAgo;
}


function formatDaysAgo(days) {
  switch (true) {
    case days < 1:
      return 'Hoy';
    case days < 7:
      return days + (days === 1 ? ' día' : ' días') + ' atrás';
    case days < 30:
      return Math.floor(days / 7) + (Math.floor(days / 7) === 1 ? ' semana' : ' semanas') + ' atrás';
    case days < 365:
      return Math.floor(days / 30) + (Math.floor(days / 30) === 1 ? ' mes' : ' meses') + ' atrás';
    default:
      return Math.floor(days / 365) + (Math.floor(days / 365) === 1 ? ' año' : ' años') + ' atrás';
  }
}


fetch('./assets/json/es.json')
  .then(response => response.json())
  .then(data => {
    const articles = data.articles;
    const list = document.querySelector('#article-list');

    // Loop through the articles and generate list items
    articles.forEach(article => {
      const listItem = document.createElement('a');
      listItem.classList.add('list-group-item', 'list-group-item-action');

      const contentDiv = document.createElement('div');
      contentDiv.classList.add('d-flex', 'w-100', 'justify-content-between');

      const title = document.createElement('h5');
      title.classList.add('mb-1');
      title.textContent = article.title;

      const daysAgoSmall = document.createElement('small');
      daysAgoSmall.textContent = formatDaysAgo(calculateDaysAgo(article.date));

      contentDiv.appendChild(title);
      contentDiv.appendChild(daysAgoSmall);

      listItem.appendChild(contentDiv);

      const descP = document.createElement('p');
      descP.classList.add('mb-1');
      descP.textContent = article.desc;
      listItem.appendChild(descP);

      const smallPrint = document.createElement('small');
      smallPrint.classList.add('text-body-secondary');
      smallPrint.textContent = article.tags;
      listItem.appendChild(smallPrint);

      listItem.href = article.url;
      listItem.target = '_blank';

      list.appendChild(listItem);
    });
  })
  .catch(error => console.error('Error fetching JSON:', error));

