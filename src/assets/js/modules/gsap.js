var JennDo = JennDo || {};

JennDo.gsap = (function () {
  function init() {
    initSmoothScroll();
  }

  function initSmoothScroll() {
    gsap.registerPlugin(ScrollSmoother, ScrollTrigger);

    // create the scrollSmoother before your scrollTriggers
    ScrollSmoother.create({
      smooth: 1, // how long (in seconds) it takes to "catch up" to the native scroll position
      effects: true, // looks for data-speed and data-lag attributes on elements
      smoothTouch: 0 // much shorter smoothing time on touch devices (default is NO smoothing on touch devices)
    });

    //gsap causes the assets to jump, this is added to allow for the jump to have a transition and then is removed
    setTimeout(() => {
      const scrollers = document.querySelectorAll('[data-speed]');
      scrollers.forEach((scroller) =>
        scroller.removeAttribute('gsap-parallax')
      );
    }, 200);
  }

  return {
    init: init
  };
})();
