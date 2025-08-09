
  // Ensure DOM loaded before running
  document.addEventListener("DOMContentLoaded", () => {
    const slideTrack = document.querySelector(".carousel-slide");
    const slides = Array.from(document.querySelectorAll(".carousel-slide img"));
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");
    const dots = Array.from(document.querySelectorAll(".dot"));
    const container = document.getElementById("carousel");

    let index = 0;
    let autoTimer = null;
    const AUTOPLAY_MS = 5000;

    // show slide by index
    function showSlide(n) {
      index = (n + slides.length) % slides.length;
      slideTrack.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d) => d.classList.remove("active"));
      if (dots[index]) dots[index].classList.add("active");
    }

    // next / prev handlers, and reset autoplay timer
    function goNext() {
      showSlide(index + 1);
      resetAutoplay();
    }
    function goPrev() {
      showSlide(index - 1);
      resetAutoplay();
    }

    prevBtn.addEventListener("click", goPrev);
    nextBtn.addEventListener("click", goNext);

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        showSlide(i);
        resetAutoplay();
      });
    });

    // autoplay
    function startAutoplay() {
      stopAutoplay();
      autoTimer = setInterval(() => showSlide(index + 1), AUTOPLAY_MS);
    }
    function stopAutoplay() {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
    }
    function resetAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    // Pause on hover (optional nice UX)
    container.addEventListener("mouseenter", stopAutoplay);
    container.addEventListener("mouseleave", startAutoplay);

    // initial render
    showSlide(0);
    startAutoplay();

    // optional: keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    });
  });