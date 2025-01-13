//inspo from https://tympanus.net/codrops/2019/01/31/custom-cursor-effects/
var JennDo = JennDo || {};

let clientX = -100;
let clientY = -100;
const cursor = document.querySelector('.cursor');

JennDo.cursor = (function () {
  function init() {
    // add listener to track the current mouse position
    document.addEventListener('mousemove', (e) => {
      clientX = e.clientX;
      clientY = e.clientY;
    });

    // transform the cursor to the current mouse position
    // use requestAnimationFrame() for smooth performance
    const render = () => {
      cursor.style.transform = `translate(${clientX}px, ${clientY}px)`;
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);

    initHovers();
  }

  function initHovers() {
    const handleMouseEnter = (e) => {
      cursor.classList.add('cursor--hover');
    };

    // reset isStuck on mouseLeave
    const handleMouseLeave = () => {
      cursor.classList.remove('cursor--hover');
    };

    // add event listeners to all items
    const linkItems = document.querySelectorAll('a, button');
    linkItems.forEach((item) => {
      item.addEventListener('mouseenter', handleMouseEnter);
      item.addEventListener('mouseleave', handleMouseLeave);
    });
  }

  return {
    init: init
  };
})();
