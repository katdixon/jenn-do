var JennDo = JennDo || {};

JennDo.main = (function () {
  function init() {

  }




  return {
    init: init
  };
})();

window.onload = () => {
  JennDo.passphrase.init();
  JennDo.anchor.init();
  JennDo.cursor.init();
  JennDo.gsap.init();
  JennDo.header.init();
  JennDo.nav.init();
  //JennDo.video.init();
};
