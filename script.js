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
