var JennDo = JennDo || {};

JennDo.nav = (function () {
  var lastFocus;
  var overlayOpen = false;

  const navOpenClasses = ['u-openNav', 'noscroll-tablet'];
  const navSelector = 'nav';
  const elements = {
    html: null,
    body: null
  };

  function init() {
    if (!document.querySelectorAll('.' + navSelector).length) return;

    // set elements
    elements.html = document.getElementsByTagName('html')[0];
    elements.body = document.body;
    elements.navArrows = document.querySelectorAll('.nav__arrow');

    var debounceResize = util.debounce(resizeNav, 500);
    window.addEventListener('resize', debounceResize);

    document.querySelectorAll('.nav__arrow').forEach((btn) =>
      btn.addEventListener('click', (e) => {
        e.preventDefault();

        let btnParent = btn.parentNode;

        if (btnParent.classList.contains('active')) {
          btnParent.classList.remove('active');
        } else {
          document
            .querySelectorAll('.nav__has-children.active')
            .forEach((submenuactive) =>
              submenuactive.classList.remove('active')
            );
          btnParent.classList.add('active');
        }
      })
    );

    document.querySelectorAll('.js-toggle-menu').forEach((parent) =>
      parent.addEventListener('click', (e) => {
        if (elements.body.classList.contains('u-openNav')) {
          close(e);
        } else {
          open(e);
        }
      })
    );
  }

  function resizeNav() {
    document.querySelectorAll('.nav__cross').forEach((btn) => {
      if (btn.classList.contains('active')) {
        btn.classList.remove('active');
      }
    });
  }

  function open(e) {
    genericOpenTasks(e, navOpenClasses);
    document.querySelector('.' + navSelector).scrollTop = 0;
  }

  function close(e) {
    if (e.keyCode && e.keyCode !== 27) {
      return;
    }

    elements.body.classList.remove(...navOpenClasses);
    elements.html.classList.remove(...navOpenClasses);
    overlayOpen = false;

    //remove eventlistener
    document.removeEventListener('keydown', close);

    if (lastFocus) {
      lastFocus.focus();
    }

    e.preventDefault();
  }

  function genericOpenTasks(e, classes) {
    if (!overlayOpen) {
      //add eventListener
      document.addEventListener('keydown', close);
    }

    overlayOpen = true;
    lastFocus = document.activeElement;
    elements.body.classList.add(...classes);
    elements.html.classList.add(...classes);
    e.preventDefault();
  }

  return {
    init: init,
    close: close
  };
})();
