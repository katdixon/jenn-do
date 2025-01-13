/*
 * @fileOverview util - a collection of JavaScript utilities
 * @author Matt Begent
 * @version 1.0.0
 */

var util = (function (window, document) {
  'use strict';

  return {
    createCookie: function (name, value, days) {
      var expires = '';

      if (days) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = '; expires=' + date.toGMTString();
      }

      document.cookie = name + '=' + value + expires + '; path=/';
    },

    getCookie: function (name) {
      var nameEQ = name + '=';
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    },

    deleteCookie: function (name) {
      u.createCookie(name, '', -1);
    },

    getParameterByName: function (name) {
      name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
      var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
        results = regex.exec(location.search);
      return results === null
        ? ''
        : decodeURIComponent(results[1].replace(/\+/g, ' '));
    },

    getParameterFromString: function (name, urlstring) {
      name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
      var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
        results = regex.exec(urlstring);
      return results === null
        ? ''
        : decodeURIComponent(results[1].replace(/\+/g, ' '));
    },

    removeUrlParameter: function (param, url) {
      if (url === undefined) {
        url = location.href;
      }

      var urlparts = url.split('?');

      if (urlparts.length >= 2) {
        var prefix = encodeURIComponent(param) + '=';
        var pars = urlparts[1].split(/[&;]/g);

        //reverse iteration as may be destructive
        for (var i = pars.length; i-- > 0; ) {
          //idiom for string.startsWith
          if (pars[i].lastIndexOf(prefix, 0) !== -1) {
            pars.splice(i, 1);
          }
        }

        url = urlparts[0] + '?' + pars.join('&');
        return url;
      } else {
        return url;
      }
    },

    updateUrlParameter(param, value) {
      let url = location.search;
      let regex = new RegExp('(' + param + '=)[^\&]+');
      return url.replace(regex, '$1' + value);
    },

    debounce: function (fn, delay) {
      var timer = null;

      return function () {
        var context = this;
        var args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
          fn.apply(context, args);
        }, delay);
      };
    },

    template: function (templateMarkup, data) {
      for (var object in data)
        templateMarkup = templateMarkup.replace(
          new RegExp('{{' + object + '}}', 'gi'),
          data[object]
        );
      return templateMarkup;
    },

    viewportWidth: function () {
      return Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0
      );
    },

    viewportHeight: function () {
      return Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      );
    },

    log: function (e) {
      if (window.console && window.console.log) {
        window.console.log(e);
      }
    },

    loadJS: function (src) {
      var script = document.createElement('script');
      script.src = src;
      document.body.appendChild(script);
    },

    cssPropertyValueSupported: function (prop, value) {
      var d = document.createElement('div');
      d.style[prop] = value;
      return d.style[prop] === value;
    },

    objectFit: function () {
      var canIUseObjectFit = util.cssPropertyValueSupported(
        'object-fit',
        'contain'
      );

      if (!canIUseObjectFit) {
        $('.u-objectFit').each(function () {
          $(this).addClass('u-imageCentered').removeClass('u-objectFit');
        });
      }
    },

    isOldIE: function () {
      if (
        navigator.userAgent.indexOf('MSIE') !== -1 ||
        navigator.appVersion.indexOf('Trident/') > -1
      ) {
        return true;
      } else {
        return false;
      }
    },

    isAnyIE: function () {
      if (
        navigator.userAgent.indexOf('MSIE') !== -1 ||
        navigator.appVersion.indexOf('Trident/') > -1 ||
        navigator.appVersion.indexOf('Edge/') > -1
      ) {
        return true;
      } else {
        return false;
      }
    },

    stopVideo: function (element) {
      if (element == null || element == undefined) return;

      var iframes = element.querySelectorAll('iframe');
      var videos = element.querySelectorAll('video');

      [...iframes].forEach((iframe) => {
        let iframeSrc = iframe.src;
        iframe.src = iframeSrc;
      });

      [...videos].forEach((video) => {
        video.pause();
      });
    },
    devPrint: function (text) {
      var devToolbar = document.getElementById('dev-toolbar');
      if (devToolbar) {
        devToolbar.innerHTML = text + '<br>' + devToolbar.innerHTML;
      }
    },
    scrollTo: function (elem, offset = 0) {
      gsap.registerPlugin(ScrollToPlugin);

      let scrollTopAmount = 0;

      if (offset == 0) {
        offset = document.querySelector('.header').offsetHeight;
      }

      if (elem !== '#') {
        scrollTopAmount = util.offset(elem).top - parseInt(offset);
      }

      gsap.to(window, { duration: 0.5, scrollTo: scrollTopAmount });
    },
    scrollToLink(selector) {
      if (!document.querySelectorAll(selector).length) return;
      document.querySelectorAll(selector).forEach((link) =>
        link.addEventListener('click', (e) => {
          let elem = e.target.getAttribute('href');

          if (elem == null) {
            elem = e.target.closest('a').getAttribute('href');
          }

          util.scrollTo(elem);
          e.preventDefault();
        })
      );
    },
    offset(selector) {
      var rect = document.querySelector(selector).getBoundingClientRect();

      return {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX
      };
    },
    getSiblings(elem) {
      return Array.prototype.filter.call(
        elem.parentNode.children,
        function (sibling) {
          return sibling !== elem;
        }
      );
    },
    findAncestor(el, sel) {
      while (
        (el = el.parentElement) &&
        !(el.matches || el.matchesSelector).call(el, sel)
      );
      return el;
    }
  };
})(window, document);
