const ClinicMaster = (function () {
  "use strict";

  const handleSetCurrentYear = () => {
    try {
      const currentYear = new Date().getFullYear();
      const elements = document.getElementsByClassName("current-year");
      for (const element of elements) {
        element.innerHTML = currentYear;
      }
    } catch (err) {
      console.error("handleSetCurrentYear error:", err);
    }
  };

  const handleDzNumber = () => {
    try {
      const dzNumbers = document.querySelectorAll(".dz-number");
      if (!dzNumbers.length) return;

      dzNumbers.forEach((element) => {
        if (element.dataset.listenerAttached) return;

        element.addEventListener("input", () => {
          const numericVal = element.value.replace(/\D/g, "");
          element.value = numericVal.slice(0, 10);
        });

        element.dataset.listenerAttached = "true";
      });
    } catch (err) {
      console.error("Error in handleDzNumber:", err);
    }
  };

  const handleBoxHover = () => {
    try {
      const wrappers = document.querySelectorAll(".box-hover-wrapper");
      if (!wrappers.length) return;

      wrappers.forEach((wrapper) => {
        wrapper.addEventListener("mouseover", (e) => {
          try {
            const card = e.target.closest(".box-hover");
            if (!card || !wrapper.contains(card)) return;

            wrapper
              .querySelectorAll(".box-hover.active")
              .forEach((c) => c.classList.remove("active"));
            card.classList.add("active");
          } catch (err) {
            console.error("handleBoxHover mouseover error:", err);
          }
        });
      });
    } catch (err) {
      console.error("handleBoxHover error:", err);
    }
  };

  const handleCounter = () => {
    const counters = document.querySelectorAll(".value");
    if (!counters.length) return;

    const DURATION = 1200;

    const runCounter = (counter) => {
      const target = Number(counter.dataset.value);
      if (isNaN(target)) return;

      const startTime = performance.now();

      const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / DURATION, 1);

        counter.innerText = Math.floor(progress * target);

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.innerText = target;
        }
      };

      requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    counters.forEach((counter) => observer.observe(counter));
  };

  const handleNavScroller = () => {
    try {
      let previousScroll = 0;
      window.addEventListener("scroll", () => {
        try {
          const screenWidth = window.innerWidth;
          if (screenWidth > 768) return;

          const body = document.body;
          const extraNav = document.querySelector(".extra-nav");
          if (!extraNav) return;

          const scrollTop =
            window.scrollY || document.documentElement.scrollTop;
          const innerHeight = window.innerHeight;
          const scrollHeight = body.scrollHeight;

          if (scrollTop + innerHeight >= scrollHeight)
            extraNav.classList.add("bottom-end");
          else extraNav.classList.remove("bottom-end");

          if (scrollTop > previousScroll) extraNav.classList.add("active");
          else extraNav.classList.remove("active");

          previousScroll = scrollTop;
        } catch (err) {
          console.error("handleNavScroller scroll error:", err);
        }
      });
    } catch (err) {
      console.error("handleNavScroller error:", err);
    }
  };

  const handleCustomSelects = () => {
    try {
      document.querySelectorAll(".dynamic-select").forEach((selectEl) => {
        initCustomSelect(selectEl);
      });
    } catch (err) {
      console.error("handleCustomSelects error:", err);
    }
  };

  const initCustomSelect = (selectEl) => {
    try {
      if (!selectEl) return;

      const selectId =
        selectEl.id || `select-${Math.random().toString(36).substr(2, 9)}`;
      const customSelectDiv = document.createElement("div");
      customSelectDiv.id = `custom-${selectId}`;
      customSelectDiv.className = "custom-select";

      const selectedDiv = document.createElement("div");
      selectedDiv.className = "select-selected";
      const defaultOption =
        selectEl.querySelector("option[selected]") || selectEl.options[0];
      selectedDiv.textContent = defaultOption?.textContent || "";

      const labelText = selectEl.parentElement?.dataset?.label || "";
      if (labelText) {
        const label = document.createElement("span");
        label.textContent = labelText;
        selectedDiv.appendChild(label);
      }

      customSelectDiv.appendChild(selectedDiv);

      const itemsDiv = document.createElement("div");
      itemsDiv.className = "select-items select-hide";
      customSelectDiv.appendChild(itemsDiv);

      Array.from(selectEl.options).forEach((option) => {
        const optionDiv = document.createElement("div");
        optionDiv.className = "select-item";
        optionDiv.dataset.value = option.value;
        optionDiv.textContent = option.textContent;
        if (option.selected) optionDiv.classList.add("active");

        optionDiv.addEventListener("click", () => {
          try {
            selectedDiv.childNodes[0].textContent = optionDiv.textContent;
            selectEl.value = optionDiv.dataset.value;
            selectEl.dispatchEvent(new Event("change"));
            selectEl.dispatchEvent(new Event("click"));

            itemsDiv
              .querySelectorAll(".select-item")
              .forEach((item) => item.classList.remove("active"));
            optionDiv.classList.add("active");

            itemsDiv.classList.add("select-hide");
            selectedDiv.classList.remove("select-active");
          } catch (err) {
            console.error("custom select click error:", err);
          }
        });

        itemsDiv.appendChild(optionDiv);
      });

      selectEl.style.display = "none";
      selectEl.parentNode?.insertBefore(customSelectDiv, selectEl.nextSibling);

      selectedDiv.addEventListener("click", (e) => {
        e.stopPropagation();
        itemsDiv.classList.toggle("select-hide");
        selectedDiv.classList.toggle("select-active");
      });

      document.addEventListener("click", (e) => {
        if (!customSelectDiv.contains(e.target)) {
          itemsDiv.classList.add("select-hide");
          selectedDiv.classList.remove("select-active");
        }
      });
    } catch (err) {
      console.error("initCustomSelect error:", err);
    }
  };

  const handleAccordion = (container = document) => {
    try {
      const accordionContainers = container.querySelectorAll(".myAccordion");

      accordionContainers.forEach((accordion) => {
        if (accordion.dataset.bound === "true") return;
        accordion.dataset.bound = "true";

        accordion.addEventListener("click", (e) => {
          try {
            const header = e.target.closest(".accordion-header");
            if (!header || !accordion.contains(header)) return;

            const item = header.parentElement;
            const content = item.querySelector(".accordion-content");
            const arrow = header.querySelector(".arrow");
            const isOpen = header.classList.contains("open");

            accordion.querySelectorAll(".accordion-header").forEach((h) => {
              if (h !== header) {
                h.classList.remove("open");
                h.querySelector(".arrow")?.classList.remove("active");
                const c = h.parentElement.querySelector(".accordion-content");
                if (c) c.style.maxHeight = null;
              }
            });

            if (!isOpen) {
              header.classList.add("open");
              if (content)
                content.style.maxHeight = content.scrollHeight + "px";
              arrow?.classList.add("active");
            } else {
              header.classList.remove("open");
              if (content) content.style.maxHeight = null;
              arrow?.classList.remove("active");
            }
          } catch (err) {
            console.error("handleAccordion click error:", err);
          }
        });
      });

      container.querySelectorAll(".accordion-header.open").forEach((header) => {
        try {
          const content =
            header.parentElement.querySelector(".accordion-content");
          const arrow = header.querySelector(".arrow");
          if (content) content.style.maxHeight = content.scrollHeight + "px";
          arrow?.classList.add("active");
        } catch (err) {
          console.error("handleAccordion init error:", err);
        }
      });
    } catch (err) {
      console.error("handleAccordion error:", err);
    }
  };

  const handleVideoPopup = () => {
    try {
      const dialog = document.getElementById("videoDialog");
      const container = document.getElementById("videoContainer");
      const closeBtn = document.getElementById("closeBtn");
      const videoWrapper = document.body;

      if (!dialog || !container || !closeBtn) return;

      const ALLOWED_HOSTS = [
        "www.youtube.com",
        "youtube.com",
        "youtu.be",
        "player.vimeo.com",
        "vimeo.com",
      ];

      const isSafeURL = (url) => {
        try {
          const parsed = new URL(url, window.location.origin);
          return ALLOWED_HOSTS.includes(parsed.hostname);
        } catch {
          return false;
        }
      };

      const openVideo = (type, src) => {
        try {
          container.textContent = "";

          if (type === "youtube" || type === "vimeo") {
            if (!isSafeURL(src)) return;
            const iframe = document.createElement("iframe");
            iframe.src = src + "?autoplay=1";
            iframe.allow = "autoplay; encrypted-media; fullscreen";
            iframe.allowFullscreen = true;
            iframe.loading = "lazy";
            container.appendChild(iframe);
          }

          if (type === "mp4") {
            const video = document.createElement("video");
            video.controls = true;
            video.autoplay = true;

            const source = document.createElement("source");
            source.src = src;
            source.type = "video/mp4";

            video.appendChild(source);
            container.appendChild(video);
          }

          dialog.style.display = "flex";
        } catch (err) {
          console.error("openVideo error:", err);
        }
      };

      const closeVideo = () => {
        try {
          container.textContent = "";
          dialog.style.display = "none";
        } catch (err) {
          console.error("closeVideo error:", err);
        }
      };

      const onOpenVideo = (e) => {
        try {
          const button = e.target.closest("button[data-type][data-src]");
          if (!button) return;
          openVideo(
            button.getAttribute("data-type"),
            button.getAttribute("data-src")
          );
        } catch (err) {
          console.error("onOpenVideo error:", err);
        }
      };

      videoWrapper.addEventListener("click", onOpenVideo);
      closeBtn.addEventListener("click", closeVideo);

      return () => {
        videoWrapper.removeEventListener("click", onOpenVideo);
        closeBtn.removeEventListener("click", closeVideo);
      };
    } catch (err) {
      console.error("handleVideoPopup error:", err);
    }
  };

  const handleCountdown = () => {
    try {
      const counter = document.querySelector("#countdown");
      if (!counter) return;

      const countDownClock = (number = 100, format = "seconds") => {
        try {
          const d = document;
          const daysElement = d.querySelector("#countdown .days");
          const hoursElement = d.querySelector("#countdown .hours");
          const minutesElement = d.querySelector("#countdown .minutes");
          const secondsElement = d.querySelector("#countdown .seconds");
          let countdown;

          const convertFormat = (format) => {
            switch (format) {
              case "seconds":
                return timer(number);
              case "minutes":
                return timer(number * 60);
              case "hours":
                return timer(number * 60 * 60);
              case "days":
                return timer(number * 60 * 60 * 24);
            }
          };

          const timer = (seconds) => {
            const now = Date.now();
            const then = now + seconds * 1000;

            countdown = setInterval(() => {
              try {
                const secondsLeft = Math.round((then - Date.now()) / 1000);
                if (secondsLeft <= 0) {
                  clearInterval(countdown);
                  return;
                }
                displayTimeLeft(secondsLeft);
              } catch (err) {
                console.error("timer interval error:", err);
              }
            }, 1000);
          };

          const displayTimeLeft = (seconds) => {
            try {
              daysElement.textContent = Math.floor(seconds / 86400);
              hoursElement.textContent = Math.floor((seconds % 86400) / 3600);
              minutesElement.textContent = Math.floor(
                ((seconds % 86400) % 3600) / 60
              );
              secondsElement.textContent =
                seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60;
            } catch (err) {
              console.error("displayTimeLeft error:", err);
            }
          };

          convertFormat(format);
        } catch (err) {
          console.error("countDownClock error:", err);
        }
      };

      countDownClock(20, "days");
    } catch (err) {
      console.error("handleCountdown error:", err);
    }
  };

  const handleBeforeAfterSlider = () => {
    try {
      document.querySelectorAll(".before-after-slider").forEach((container) => {
        try {
          const slider = container.querySelector(".slider");
          if (!slider) return;

          slider.addEventListener("input", (e) => {
            try {
              container.style.setProperty("--position", `${e.target.value}%`);
            } catch (err) {
              console.error("beforeAfterSlider input error:", err);
            }
          });
        } catch (err) {
          console.error("beforeAfterSlider container error:", err);
        }
      });
    } catch (err) {
      console.error("handleBeforeAfterSlider error:", err);
    }
  };

  const splitTextIntoCharacters = () => {
    try {
      document.querySelectorAll(".word-rotate").forEach((el) => {
        try {
          const text = el.textContent || "";
          if (!text) return;

          const chars = text.split("");
          const step = 360 / chars.length;
          const container = el.closest(".word-rotate-box, .word-rotate-box2");
          if (!container) return;

          chars.forEach((char, i) => {
            const span = document.createElement("span");
            span.className = "text-char";
            span.style.setProperty("--char-rotate", `${i * step}deg`);
            span.textContent = char;
            container.appendChild(span);
          });

          el.remove();
        } catch (err) {
          console.error("splitTextIntoCharacters inner error:", err);
        }
      });
    } catch (err) {
      console.error("splitTextIntoCharacters error:", err);
    }
  };

  const handleDzLoader = () => {
    try {
      if (handleDzLoader.hasRun) return;
      handleDzLoader.hasRun = true;

      const loaderTimeout = setTimeout(() => {
        const loaderItems = document.querySelectorAll(".dz-loader-info *");
        if (loaderItems.length) {
          loaderItems.forEach((el) => {
            el.style.transition = "transform 0.5s ease, opacity 0.5s ease";
            el.style.transform = "translateY(-100px)";
            el.style.opacity = "0";
          });
        }

        const svg = document.getElementById("svg");
        if (svg) {
          svg.style.transition = "d 0.5s ease";
          svg.setAttribute("d", "M0 502S175 272 500 272s500 230 500 230V0H0Z");

          setTimeout(() => {
            svg.setAttribute("d", "M0 2S175 1 500 1s500 1 500 1V0H0Z");
          }, 500);
        }

        const dzLoaderWrap = document.querySelector(".dz-loader");
        if (dzLoaderWrap) {
          dzLoaderWrap.style.transition = "transform 5s ease";
          dzLoaderWrap.style.transform = "translateY(-1500px)";
        }

        clearTimeout(loaderTimeout);
      }, 1500);
    } catch (err) {
      console.error("Error in dzLoader:", err);
    }
  };

  const handleFlatpickr = () => {
    if (document.querySelector(".flatpickr1")) {
      flatpickr(".flatpickr1", {});
    }

    if (document.querySelector(".time-picker")) {
      flatpickr(".time-picker", {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        defaultDate: "13:45",
      });
    }
  };

  /* Function ============ */
  return {
    init() {
      handleSetCurrentYear();
      handleDzNumber();
      handleBoxHover();
      handleCounter();
      handleNavScroller();
      handleCustomSelects();
      handleAccordion();
      handleVideoPopup();
      handleCountdown();
      handleBeforeAfterSlider();
      splitTextIntoCharacters();
      handleDzLoader();
      handleFlatpickr();
    },

    load() {},

    resize() {},
  };
})();

document.addEventListener("DOMContentLoaded", function () {
  ClinicMaster.init();
});

window.addEventListener("load", function () {
  ClinicMaster.load();
  const dzPreloader = document.getElementById("dzPreloader");
  setTimeout(function () {
    if (dzPreloader) {
      dzPreloader.remove();
    }
  }, 1000);
  document.body.addEventListener("keydown", function () {
    document.body.classList.add("show-focus-outline");
  });
  document.body.addEventListener("mousedown", function () {
    document.body.classList.remove("show-focus-outline");
  });
});

window.addEventListener("resize", function () {
  ClinicMaster.resize();
});
