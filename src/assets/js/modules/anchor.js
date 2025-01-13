var JennDo = JennDo || {};

JennDo.anchor = (function () {
  function init() {
    scrollToLink();
    let hashUrl = window.location.hash;
    if (hashUrl.length > 1 && document.querySelector(hashUrl)) {
      let headerHeight = document.querySelector('.header').offsetHeight + 20;
      util.scrollTo(hashUrl, headerHeight);
    }
  }

  function scrollToLink() {
    document.querySelectorAll('a[data-anchor]').forEach((link) => {
      link.addEventListener('click', (e) => {
        let target = link.getAttribute('data-anchor');
        let linkUrl = new URL(link.href, window.location.origin);

        if (
          linkUrl.origin !== window.location.origin ||
          linkUrl.pathname !== window.location.pathname
        ) {
          return;
        }

        // close the mobile menu
        JennDo.nav.close(e);

        window.history.pushState(null, null, target);
        // Scroll to the target
        util.scrollTo(target);
        e.preventDefault();
      });
    });
  }

  return {
    init: init
  };
})();
