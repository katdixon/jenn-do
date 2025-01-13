var JennDo = JennDo || {};

JennDo.accordion = (function () {
  const Accordion = '.accordion';
  const AccordionSection = '.accordion__section';
  const AccordionTitle = '.accordion__expander';
  const AccordionPanel = '.accordion__panel';
  var isMobile;

  function init() {
    initAccordion();
    resizeAccordion();

    var debounceResize = util.debounce(resizeAccordion, 500);
    window.addEventListener('resize', debounceResize);
  }

  function initAccordion() {
    //add aria-hidden to all
    //add aria-labelled by etc to all

    document.querySelectorAll(Accordion).forEach((currentAccordion) => {
      let index = 0;
      currentAccordion
        .querySelectorAll(AccordionSection)
        .forEach((theSection) => {
          const theTitle = theSection.querySelector(AccordionTitle);
          const thePanel = theSection.querySelector(AccordionPanel);

          theTitle.getAttribute('id', 'accordion__expander' + index);
          theTitle.getAttribute('aria-controls', 'accordion__panel' + index);

          thePanel.getAttribute('id', 'accordion__panel' + index);
          thePanel.getAttribute(
            'aria-labelledby',
            'accordion__expander' + index
          );

          if (theSection.classList.contains('accordion__section--show')) {
            thePanel.setAttribute('aria-hidden', 'false');
          } else {
            thePanel.setAttribute('aria-hidden', 'true');
          }

          theTitle.addEventListener('click', (e) =>
            clickEvent(e, theSection, thePanel)
          );
          index++;
        });
    });
  }

  function clickEvent(e, theSection, thePanel) {
    if (theSection.classList.contains('accordion__section--show')) {
      theSection.classList.remove('accordion__section--show');
      thePanel.setAttribute('aria-hidden', 'true');
    } else {
      theSection.classList.add('accordion__section--show');
      thePanel.setAttribute('aria-hidden', 'false');
    }
    e.preventDefault();
  }

  function resizeAccordion() {
    if (isMobile != isMobileView()) {
      isMobile = isMobileView();
      //if mobile, close all. if desktop, open all
      if (isMobile) {
        document.querySelectorAll(
          '.accordion__section--show[data-closemobile=true] ' + AccordionTitle
        ).click;
        //$('.accordion__section--show[data-closemobile=true]').find(AccordionTitle).trigger('click');
      } else {
        document.querySelectorAll(
          '.accordion__section--show[data-closemobile=true]:not(.accordion__section--show) ' +
            AccordionTitle
        ).click;
        //$('.accordion__section[data-closemobile=true]:not(.Accordion-section--show)').find(AccordionTitle).trigger('click');
      }
    }
  }

  function isMobileView() {
    return window.innerWidth < 1025 || window.innerHeight < 700;
  }

  return {
    init: init
  };
})();
