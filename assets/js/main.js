let prevScrollpos = window.pageYOffset || 0;

AOS.init({
  offset: 120,
  delay: 0,
  duration: 600,
  easing: 'ease',
  once: true,
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

function applyTranslations(data) {

  const htmlElmt = document.querySelector('html');
  const titleElmt = document.querySelector('title');
  const authorNameSpan = document.querySelector('span.h3.fw-bold.d-block.d-lg-none#author-name');
  const sectionHeader = document.querySelector('div.section-header.text-brand');
  const firstEyeSpan = document.querySelector('#first-eye-h2');
  const cv = document.querySelector('.home-buttons #cv');

  htmlElmt.lang = data["html-lang"];
  titleElmt.innerText = data.title;
  authorNameSpan.innerText = data["author-name"];
  sectionHeader.innerText = data["blog-section"];
  firstEyeSpan.innerHTML = data["first-eye"];
  cv.setAttribute('href', data["cv-url"]);

  for (const key in data.translations) {
    const element = document.getElementById(key);
    if (element) {
      element.innerText = data.translations[key];
    } else {
      console.warn(`Element with ID ${key} not found.`);
    }
  }
}

let currentLangCode = ''

document.addEventListener('DOMContentLoaded', function () {
  const userLanguage = navigator.language || navigator.userLanguage;
  const langCode = userLanguage.startsWith('es') ? 'es' : 'en';

  const languageButtons = document.querySelectorAll('.dropdown-item');

  renderTagsSections(langCode);
  // fetchAndRenderArticles(langCode);

  languageButtons.forEach(button => {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      const langCode = button.getAttribute('data-lang-code');

      if (currentLangCode !== langCode) {
        renderTagsSections(langCode);
        // fetchAndRenderArticles(langCode);
      }
    });

  });
});

function renderTagsSections(langCode) {
  const langFile = `./assets/json/${langCode}.json`;

  fetch(langFile)
    .then(response => response.json())
    .then(data => {
      applyTranslations(data);
      const articles = data.articles;
      const categories = data.categories;
      const accordion = document.querySelector('#tagAccordion');

      accordion.innerHTML = '';

      categories.forEach((category, index) => {
        const accordionItem = document.createElement('div');
        accordionItem.classList.add('accordion-item');

        const accordionHeader = document.createElement('h2');
        accordionHeader.classList.add('accordion-header');

        const button = document.createElement('button');
        button.classList.add('accordion-button');
        button.setAttribute('type', 'button');
        button.setAttribute('data-bs-toggle', 'collapse');
        button.setAttribute('data-bs-target', `#collapse${index}`);
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-controls', `collapse${index}`);
        button.textContent = "#" + category;

        const collapseDiv = document.createElement('div');
        collapseDiv.id = `collapse${index}`;
        collapseDiv.classList.add('accordion-collapse', 'collapse');
        collapseDiv.setAttribute('data-bs-parent', '#tagAccordion');

        if (index === 0) {
          collapseDiv.classList.add('show');
        }

        const accordionBody = document.createElement('div');
        accordionBody.classList.add('accordion-body');
        accordionBody.innerHTML = `<ol class="list-group" id="article-list-${index}"></ol>`;

        collapseDiv.appendChild(accordionBody);
        accordionHeader.appendChild(button);
        accordionItem.appendChild(accordionHeader);
        accordionItem.appendChild(collapseDiv);
        accordion.appendChild(accordionItem);

        const daysAgoStrings = data.formatDaysAgo;

        articles.forEach(article => {
          if (article.tags === category) {
            const listItem = document.createElement('a');
            listItem.classList.add('list-group-item', 'list-group-item-action', langCode);

            const contentDiv = document.createElement('div');
            contentDiv.classList.add('d-flex', 'w-100', 'justify-content-between');

            const title = document.createElement('h5');
            title.classList.add('mb-1', 'articleTitle');
            title.textContent = article.title;

            const daysAgoSmall = document.createElement('small');
            daysAgoSmall.textContent = formatDaysAgo(calculateDaysAgo(article.date), daysAgoStrings, langCode);

            contentDiv.appendChild(title);
            contentDiv.appendChild(daysAgoSmall);

            listItem.appendChild(contentDiv);

            const descP = document.createElement('p');
            descP.classList.add('mb-1', 'articleSubTitle');
            descP.textContent = article.desc;
            listItem.appendChild(descP);

            const smallPrint = document.createElement('small');
            smallPrint.classList.add('text-body-secondary');
            smallPrint.classList.add('articleTags');
            smallPrint.textContent = "#" + article.tags;
            listItem.appendChild(smallPrint);

            listItem.href = article.url;
            listItem.target = '_blank';

            const articleList = document.querySelector(`#article-list-${index}`);
            articleList.appendChild(listItem);

          }
        });
      });
    })
    .catch(error => console.error('Error loading JSON file:', error));
}


function calculateDaysAgo(articleDate) {
  var currentDate = new Date();
  var targetDate = new Date(articleDate);
  var timeDiff = currentDate.getTime() - targetDate.getTime();
  var daysAgo = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return daysAgo;
}

function formatDaysAgo(days, strings, langCode) {

  if (langCode == "es") {
    switch (true) {
      case days < 1:
        return strings.today;
      case days < 7:
        return strings.ago + days + (days === 1 ? strings.day : strings.days);
      case days < 30:
        return strings.ago + Math.floor(days / 7) + (Math.floor(days / 7) === 1 ? strings.week : strings.weeks);
      case days < 365:
        return strings.ago + Math.floor(days / 30) + (Math.floor(days / 30) === 1 ? strings.month : strings.months);
      default:
        return strings.ago + Math.floor(days / 365) + (Math.floor(days / 365) === 1 ? strings.year : strings.years);
    }
  } else {
    switch (true) {
      case days < 1:
        return strings.today;
      case days < 7:
        return days + (days === 1 ? strings.day : strings.days) + strings.ago;
      case days < 30:
        return Math.floor(days / 7) + (Math.floor(days / 7) === 1 ? strings.week : strings.weeks) + strings.ago;
      case days < 365:
        return Math.floor(days / 30) + (Math.floor(days / 30) === 1 ? strings.month : strings.months) + strings.ago;
      default:
        return Math.floor(days / 365) + (Math.floor(days / 365) === 1 ? strings.year : strings.years) + strings.ago;
    }
  }
}
