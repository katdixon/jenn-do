var JennDo = JennDo || {};

JennDo.main = (function () {
  function init() {
    // not currently needed
  }

  return {
    init: init
  };
})();

window.onload = () => {
  JennDo.anchor.init();
  JennDo.cursor.init();
  JennDo.gsap.init();
  JennDo.header.init();
  JennDo.nav.init();
  //JennDo.video.init();
};
