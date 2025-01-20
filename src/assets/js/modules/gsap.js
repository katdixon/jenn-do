var JennDo = JennDo || {};

JennDo.gsap = (function () {

  var theScroller = null;
  var isMobile = window.innerWidth <= 768;

  function init() {
    initSmoothScroll();
  }

  function initSmoothScroll() {
    gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
    window.addEventListener('resize', resizefunc);

    if (!isMobile) {
      createSmoothScroll();
    }



    //gsap causes the assets to jump, this is added to allow for the jump to have a transition and then is removed
    setTimeout(() => {
      const scrollers = document.querySelectorAll('[data-speed]');
      scrollers.forEach((scroller) =>
        scroller.removeAttribute('gsap-parallax')
      );
    }, 200);
  }


  function resizefunc() {
    var wasMobile = isMobile;
    isMobile = window.innerWidth <= 768;

    if (isMobile && !wasMobile) {
    if (theScroller) {
      theScroller.kill();
      theScroller = null;
    }
    } else if (!isMobile && wasMobile) {
    if (!theScroller) {
      createSmoothScroll();
    }
    }
  }


  function createSmoothScroll(){
    // create the scrollSmoother before your scrollTriggers
    theScroller = ScrollSmoother.create({
      smooth: 0.2, // how long (in seconds) it takes to "catch up" to the native scroll position
      effects: true, // looks for data-speed and data-lag attributes on elements
      smoothTouch: 0 // much shorter smoothing time on touch devices (default is NO smoothing on touch devices)
    });
  }

  return {
    init: init
  };
})();
