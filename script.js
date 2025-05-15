

// максимальный угол наклона в градусах
const MAX_TILT = 12;

document.querySelectorAll('.card-container').forEach(card => {
  // при движении мыши внутри карточки
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    // координаты курсора внутри карточки
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // нормализуем в диапазон [-1, 1]
    const dx = (x / rect.width)  * 2 - 1;  
    const dy = (y / rect.height) * 2 - 1;
    // считаем угол наклона
    const tiltX =  dy * MAX_TILT;  // наклон по X (вверх/вниз)
    const tiltY = -dx * MAX_TILT;  // наклон по Y (влево/вправо)
    // применяем трансформацию
    card.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.03)`;
  });

  // при уходе курсора — сбрасываем
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)';
  });

  // плавный вход
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.2s ease-out';
  });
});






document.addEventListener('DOMContentLoaded', () => {
  const awards         = document.querySelector('.awards');
  const iconsContainer = awards.querySelector('.icons-container');
  const kitties        = Array.from(awards.querySelectorAll('.kitty'));

  // Общий пул
  const config = [
    { cls: 'star',  src:'img/star.png',  count: 5 },
    { cls: 'fish',  src:'img/fish.png',  count: 4 },
    { cls: 'heart', src:'img/heart.png', count: 4 },
    { cls: 'paw',   src:'img/paw.png',   count: 5 }
  ];

  function makeAll(cfg) {
    return cfg.flatMap(({cls,src,count}) =>
      Array.from({ length: count }, () => {
        const img = document.createElement('img');
        img.src = src;
        img.className = `icon ${cls}`;
        img.style.opacity = 0;
        iconsContainer.append(img);
        return img;
      })
    );
  }
  const allIcons = makeAll(config);

  function isInside(x, y, rect) {
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  }

  // Размещение одной иконки
  function placeIcon(icon, zone, placed, kittyRects, contRect) {
    const { xMin, xMax, yMin, yMax } = zone;
    const minSeparation = 80;  // увеличили до 80px
    let x, y, tries = 0;

    do {
      x = xMin + Math.random() * (xMax - xMin);
      y = yMin + Math.random() * (yMax - yMin);

      // не на котиках
      if (kittyRects.some(r => isInside(x, y, r))) continue;

      // не накладываем на любую уже поставленную
      if (placed.some(p => Math.hypot(p.x - x, p.y - y) < minSeparation)) {
        tries++;
        if (tries < 30) continue;  // даём до 30 попыток
      }
      break;
    } while (true);

    // сохраняем координаты
    placed.push({ x, y });

    // трансформация
    const scale = 0.5 + Math.random() * 0.5;
    const cls   = icon.classList[1];
    const rot   = (cls === 'fish' || cls === 'heart')
                  ? Math.random()*40 - 20
                  : Math.random()*360;

    icon.style.left      = `${x - contRect.left}px`;
    icon.style.top       = `${y - contRect.top}px`;
    icon.style.transform = `translate(-50%,-50%) rotate(${rot}deg) scale(${scale})`;
    icon.style.opacity   = 1;
  }

  awards.addEventListener('mouseenter', () => {
    const pad  = 20;
    const rect = awards.getBoundingClientRect();
    const midX = rect.left + rect.width / 2;

    const leftZone =  { xMin: rect.left + pad,       xMax: midX - pad,
                        yMin: rect.top  + pad,       yMax: rect.top + rect.height - pad };
    const rightZone = { xMin: midX     + pad,       xMax: rect.left + rect.width - pad,
                        yMin: rect.top  + pad,       yMax: rect.top + rect.height - pad };

    const kittyRects = kitties.map(k => k.getBoundingClientRect());
    const placed     = [];

    allIcons.forEach(icon => {
      const zone = (Math.random() < 0.5) ? leftZone : rightZone;
      placeIcon(icon, zone, placed, kittyRects, rect);
    });
  });

  awards.addEventListener('mouseleave', () => {
    allIcons.forEach(icon => icon.style.opacity = 0);
  });
});




// script.js

const translations = {
  en: {
    // header nav
    'nav-registration': 'REGISTRATION',   
    'nav-news':         'NEWS',
    'nav-youtube':      'YOUTUBE',
    'nav-wiki':         'WIKI',
    'nav-instagram':    'INSTAGRAM',
    'nav-download':     'DOWNLOAD',

    // hero
    'hero-title':       'Cats & Soup',

    // purchase buttons (span внутри каждой ссылки)
    'btn-google':       'DOWNLOAD ON GOOGLE PLAY',
    'btn-apple':        'DOWNLOAD ON APP STORE',
    'btn-uptodown':     'DOWNLOAD ON UPTODOWN',
    'btn-aptoide':      'DOWNLOAD ON APTOIDE',
    'btn-netflix':      'DOWNLOAD THE NETFLIX VERSION',

    // explore section
    'explore-title':    'The first choice of many cat lovers! Cute game about cats!',
    'explore-text':     'Peaceful forest where cats cook soup in a relaxing idle game for cat lovers. ' +
                        'Cartoon graphics showcase various cat breeds in a fairy forest. ' +
                        'Players can dress, photograph, feed cats in mini-games, and give them names. ' +
                        'Enjoy relaxing ASMR cooking and nature sounds along with customizable background music. ' +
                        'A simple, calm economic simulator where cats autonomously gather resources, unlock recipes and buildings — perfect for fans of economic sims and animal restaurants.',

    // testimonials
    'test-1-title':     'Ghostly visitors👻',
    'test-1-text':      'At night, ghostly creatures appear in the game, which bring additional recipe points. ' +
                        'This adds an element of surprise and encourages players to enter the game at different times of day.',
    'test-2-title':     'A fish pond for the kitties🐟',
    'test-2-text':      'In the game, you can build a fish pond that serves solely as a resting place for the SEALs. ' +
                        'This emphasizes concern for the well-being of the characters and adds depth to the gameplay.',
    'test-3-title':     'Complex economic mechanics💰',
    'test-3-text':      'The game incorporates complex resource management mechanics where improving ingredients affects the cost of all dishes of a certain type. ' +
                        'This requires a strategic approach to development and planning.',

    // cards
    'card-1-title':     'Cat rooms',
    'card-1-text':      'Create your own cat room!',
    'card-2-title':     'Events',
    'card-2-text':      'Different decor for different holidays!',
    'card-3-title':     'Rest and work',
    'card-3-text':      'Rest is just as important as hard work!',
    'card-4-title':     'Seasons of the year',
    'card-4-text':      'Experience all four seasons together!',

  },
  ru: {
    // header nav
    'nav-registration': 'РЕГИСТРАЦИЯ',
    'nav-news':         'НОВОСТИ',
    'nav-youtube':      'ЮТУБ',
    'nav-wiki':         'ВИКИ',
    'nav-instagram':    'ИНСТАГРАММ',
    'nav-download':     'СКАЧАТЬ',

    // hero
    'hero-title':       'Cats & Soup',

    // purchase buttons
    'btn-google':       'СКАЧАТЬ В GOOGLE PLAY',
    'btn-apple':        'СКАЧАТЬ В APP STORE',
    'btn-uptodown':     'СКАЧАТЬ НА UPTODOWN',
    'btn-aptoide':      'СКАЧАТЬ НА APTOIDE',
    'btn-netflix':      'СКАЧАТЬ ВЕРСИЮ NETFLIX',

    // explore section
    'explore-title':    'Первый выбор многих любителей кошек! Милая игра про котов!',
    'explore-text':     'Мир спокойного леса, где коты готовят суп в расслабляющей Idle‑игре для любителей кошек. ' +
                        'Мультяшная графика покажет разные породы в волшебном лесу. ' +
                        'Игроки могут одевать, фотографировать, кормить котов в мини‑играх и давать им имена. ' +
                        'Наслаждайтесь расслабляющим ASMR‑готовкой и природными звуками вместе с настраиваемой фоновой музыкой. ' +
                        'Простая, спокойная экономическая симуляция, где коты автономно собирают ресурсы, открывают рецепты и строения — идеально для фанатов экономических симов и игр про рестораны.',

    // testimonials
    'test-1-title':     'Призрачные гости👻',
    'test-1-text':      'По ночам в игре появляются призрачные существа, принося дополнительные очки рецептов. ' +
                        'Это добавляет элемент неожиданности и привлекает игроков заходить в игру в разное время суток.',
    'test-2-title':     'Рыбный пруд для котиков🐟',
    'test-2-text':      'В игре можно построить рыбный пруд, который служит лишь местом отдыха для котиков. ' +
                        'Это подчеркивает заботу о благополучии персонажей и добавляет глубины игровому процессу.',
    'test-3-title':     'Сложная экономика💰',
    'test-3-text':      'Игра включает сложные механики управления ресурсами, где улучшение ингредиентов влияет на стоимость всех блюд определенного типа. ' +
                        'Это требует стратегического подхода к развитию и планированию.',

    // cards
    'card-1-title':     'Комнаты для котов',
    'card-1-text':      'Создайте собственную комнату для котиков!',
    'card-2-title':     'События',
    'card-2-text':      'Разный декор для разных праздников!',
    'card-3-title':     'Отдых и работа',
    'card-3-text':      'Отдых не менее важен, чем усердная работа!',
    'card-4-title':     'Времена года',
    'card-4-text':      'Переживайте все четыре сезона вместе!',


  }
};

const btnEn = document.getElementById('btn-en');
const btnRu = document.getElementById('btn-ru');

function switchLanguage(lang) {
  const dict = translations[lang];
  Object.keys(dict).forEach(key => {
    const el = document.getElementById(key);
    if (el) el.textContent = dict[key];
  });

  // обновляем стили кнопок
  if (lang === 'en') {
    btnEn.classList.add('active');
    btnRu.classList.remove('active');
    document.documentElement.lang = 'en';
  } else {
    btnRu.classList.add('active');
    btnEn.classList.remove('active');
    document.documentElement.lang = 'ru';
  }
}

// вешаем обработчики
btnEn.addEventListener('click', () => switchLanguage('en'));
btnRu.addEventListener('click', () => switchLanguage('ru'));

// стартовый язык
document.addEventListener('DOMContentLoaded', () => switchLanguage('en'));
