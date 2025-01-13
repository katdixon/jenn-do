var JennDo = JennDo || {};

JennDo.header = (function () {
  const headerElement = document.querySelector('[data-header]');
  const headerElementScrolledClass = 'header--scrolled';
  const headerElementHiddenClass = 'header--hidden';
  const downwardScrollBuffer = 30;

  let lastScroll = 0;

  function init() {
    if (!headerElement) return;

    headerElement.classList.add('is-sticky');
    window.addEventListener('scroll', handleScroll); // @TODO - may throttle this
  }

  function handleScroll() {
    const allow =
      typeof window['allowHeaderMovement'] !== 'undefined'
        ? window['allowHeaderMovement']
        : true;

    if (!allow) return;

    const currentScroll = window.scrollY;

    if (currentScroll <= downwardScrollBuffer) {
      headerElement.classList.remove(headerElementScrolledClass);
      headerElement.classList.remove(headerElementHiddenClass);
      return;
    } else {
      headerElement.classList.add(headerElementScrolledClass);
    }

    const isHovering = headerElement.matches(':hover');

    if (
      currentScroll > lastScroll + downwardScrollBuffer &&
      !headerElement.classList.contains(headerElementHiddenClass) &&
      !isHovering
    ) {
      headerElement.classList.add(headerElementHiddenClass);
    } else if (
      currentScroll < lastScroll &&
      headerElement.classList.contains(headerElementHiddenClass)
    ) {
      headerElement.classList.remove(headerElementHiddenClass);
    }

    lastScroll = currentScroll;
  }

  return {
    init: init
  };
})();
