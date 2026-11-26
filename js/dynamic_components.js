// Чекаємо, поки HTML-розмітка повністю завантажиться перед запуском слайдера.
document.addEventListener('DOMContentLoaded', function () {
  // `.reviews-swiper` — головний контейнер відгуків, який Swiper перетворює на слайдер.
  const swiper = new Swiper('.reviews-swiper', {
    a11y: {
      enabled: true,
    },
    // Автоматично перемикаємо відгуки кожні 3,5 секунди.
    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    grabCursor: true,
    keyboard: {
      enabled: true,
    },
    // Після останнього відгуку слайдер повертається до першого.
    loop: true,
    // Підключаємо кнопки з класами `.swiper-button-next` і `.swiper-button-prev`.
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    // `.swiper-pagination` містить клікабельні точки навігації.
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    spaceBetween: 30,
    slidesPerView: 1,
    breakpoints: {
      // На мобільних екранах показуємо один відгук.
      320: {
        slidesPerView: 1,
      },
      // На планшетах одночасно показуємо два відгуки.
      768: {
        slidesPerView: 2,
      },
      // На десктопах одночасно показуємо три відгуки.
      1024: {
        slidesPerView: 3,
      },
    },
  });

  // `Fancybox.bind` відкриває фото в одному альбомі за спільним значенням `data-fancybox`.
  Fancybox.bind('[data-fancybox="classroom-gallery"]', {
    // Fade робить плавний перехід між фото, а Panzoom вмикає масштабування зображень.
    Carousel: {
      transition: 'fade',
    },
    Images: {
      Panzoom: {
        maxScale: 3,
      },
    },
  });

  AOS.init({
    once: true,
    duration: 600,
    offset: 100,
    disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  });
});
