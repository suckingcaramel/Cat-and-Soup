(function() {
  const popupOverlay = document.getElementById('popupOverlay');
  const popupContent = document.getElementById('popupContent');
  const closePopupBtn = document.getElementById('closePopup');

  if (!popupOverlay || !popupContent || !closePopupBtn) return;

  document.querySelectorAll('.btn-open-popup').forEach(btn => {
    btn.addEventListener('click', () => {
      const rect = btn.getBoundingClientRect();
      const { offsetWidth: w = 200, offsetHeight: h = 150 } = popupContent;
      const top = rect.bottom + window.scrollY + 5;
      const left = rect.left + window.scrollX + rect.width / 2 - w / 2;
      popupContent.style.top = `${top}px`;
      popupContent.style.left = `${left}px`;
      popupOverlay.style.display = 'block';
    });
  });

  closePopupBtn.addEventListener('click', () => {
    popupOverlay.style.display = 'none';
  });
})();

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

