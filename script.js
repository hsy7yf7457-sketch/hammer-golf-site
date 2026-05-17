/* ============================================================
   Hammer Golf — site script
   - Mobile nav toggle
   - Courses carousel: arrows, dots, scroll-snap sync
   - Footer year
   ============================================================ */

(function () {
  "use strict";

  document.getElementById("year").textContent = new Date().getFullYear();

  // ---------- Mobile nav ----------
  const navToggle = document.querySelector(".nav-toggle");
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      const open = document.body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    document.querySelectorAll("#mobile-nav a").forEach((a) =>
      a.addEventListener("click", () => {
        document.body.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  // ---------- Home / scroll-to-top ----------
  // Any in-page link to #top scrolls all the way to scrollY=0 without
  // leaving "#top" lingering in the address bar.
  document.querySelectorAll('a[href="#top"]').forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    })
  );

  // ---------- Courses carousel ----------
  const carousel = document.querySelector("[data-carousel]");
  if (!carousel) return;

  const track = carousel.querySelector("[data-track]");
  const prevBtn = carousel.querySelector("[data-prev]");
  const nextBtn = carousel.querySelector("[data-next]");
  const dotsList = document.querySelector("[data-dots]");
  const cards = Array.from(track.children);

  function getStep() {
    if (cards.length < 2) return track.clientWidth;
    const first = cards[0].getBoundingClientRect();
    const second = cards[1].getBoundingClientRect();
    return Math.max(1, second.left - first.left);
  }

  function getInnerWidth() {
    const cs = getComputedStyle(track);
    const padL = parseFloat(cs.paddingLeft) || 0;
    const padR = parseFloat(cs.paddingRight) || 0;
    return Math.max(0, track.clientWidth - padL - padR);
  }

  function getMaxScroll() {
    return Math.max(0, track.scrollWidth - track.clientWidth);
  }

  function getVisibleCount() {
    const step = getStep();
    if (step <= 0) return 1;
    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = Math.max(0, step - cardWidth);
    const inner = getInnerWidth();
    // N cards (with N-1 gaps between them) fit if
    //   N * cardWidth + (N - 1) * gap <= inner
    // => N <= (inner + gap) / step
    return Math.max(1, Math.floor((inner + gap) / step));
  }

  function getPageCount() {
    return Math.max(1, cards.length - getVisibleCount() + 1);
  }

  function buildDots() {
    if (!dotsList) return;
    dotsList.innerHTML = "";
    const pages = getPageCount();
    for (let i = 0; i < pages; i++) {
      const dot = document.createElement("li");
      dot.setAttribute("role", "button");
      dot.setAttribute("tabindex", "0");
      dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
      dot.addEventListener("click", () => scrollToIndex(i));
      dot.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          scrollToIndex(i);
        }
      });
      dotsList.appendChild(dot);
    }
    updateDots();
  }

  // Use a proportional mapping between scrollLeft and page index so the
  // active dot tracks reality even when scrollLeft gets clamped by the
  // browser (e.g. when track padding pushes the effective max scroll
  // below pageCount * step).
  function currentIndex() {
    const pages = getPageCount();
    if (pages <= 1) return 0;
    const max = getMaxScroll();
    if (max <= 0) return 0;
    return Math.min(
      pages - 1,
      Math.max(0, Math.round((track.scrollLeft / max) * (pages - 1)))
    );
  }

  function updateDots() {
    if (!dotsList) return;
    const idx = Math.min(currentIndex(), dotsList.children.length - 1);
    Array.from(dotsList.children).forEach((d, i) =>
      d.classList.toggle("is-active", i === idx)
    );
  }

  function scrollToIndex(i) {
    const pages = getPageCount();
    if (pages <= 1) return;
    const clamped = Math.max(0, Math.min(i, pages - 1));
    const max = getMaxScroll();
    const target = (clamped / (pages - 1)) * max;
    track.scrollTo({ left: target, behavior: "smooth" });
  }

  prevBtn?.addEventListener("click", () => scrollToIndex(currentIndex() - 1));
  nextBtn?.addEventListener("click", () => scrollToIndex(currentIndex() + 1));

  let ticking = false;
  track.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateDots();
      ticking = false;
    });
  });

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildDots, 120);
  });

  buildDots();
})();
