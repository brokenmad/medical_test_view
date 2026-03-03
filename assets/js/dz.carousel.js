const ClinicMasterCarousel = function () {

  const handleTestimonialSwiper8 = () => {
  const sliderEl = document.querySelector('.testimonial-swiper8');

  if (sliderEl) {
    const testimonialSwiper8 = new Swiper('.testimonial-swiper8', {
      loop: true,
      spaceBetween: 25,
      slidesPerView: 1.3,
      pagination: {
        el: ".testimonial-pagination-swiper2",
        type: "progressbar",
      },
      breakpoints: {
        1481: {
          slidesPerView: 1.3
        },
        1280: {
          slidesPerView: 1.6
        },
        991: {
          slidesPerView: 1.2
        },
        320: {
          slidesPerView: 1
        },
      },
    });
  }
};

  const BlogSlideshowSwiper = () => {
    const swiperEl = document.querySelector(".blog-slideshow");
    if (!swiperEl) return;

    new Swiper(".blog-slideshow", {
      loop: true,
      spaceBetween: 0,
      slidesPerView: "auto",
      speed: 1500,
      autoplay: {
        delay: 2000,
      },
      pagination: {
        el: ".swiper-pagination-two",
        clickable: true,
      },
    });
  };

  if (
    document.querySelector(".galley-thumb-swiper") &&
    document.querySelector(".galley-swiper")
  ) {
    const swiperThumbs = new Swiper(".galley-thumb-swiper", {
      loop: false,
      spaceBetween: 10,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesProgress: true,
    });

    new Swiper(".galley-swiper", {
      loop: true,
      spaceBetween: 10,
      thumbs: {
        swiper: swiperThumbs,
      },
    });
  }

  const handleServiceSwiper3 = () => {
  const sliderEl = document.querySelector('.service-swiper3');

  if (sliderEl) {
    const ServiceSwiper2 = new Swiper('.service-swiper3', {
      loop: true,
      spaceBetween: 0,
      slidesPerView: 1,
      autoplay: {
        delay: 3000,
      },
      navigation: {
        nextEl: ".service-button-next",
        prevEl: ".service-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        renderBullet: (index, className) =>
          `<span class="${className}">0${index + 1}</span>`,
      },
    });
  }
};

  return {
    load() {
      handleTestimonialSwiper8();
      BlogSlideshowSwiper();
      handleServiceSwiper3();
    },
  };
};

window.addEventListener("load", function () {
  ClinicMasterCarousel().load();
});
