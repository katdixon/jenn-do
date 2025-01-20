var JennDo = JennDo || {};

JennDo.passphrase = (function () {

    const phrase = 'mrs watkins';
    const cookieName = 'passphrase-accepted';

    function init() {

        var cookie = util.getCookie(cookieName);

        if(cookie === 'true') {
            hideoverlay();
            return;
        } else {
            showoverlay();
        }

        var form = document.getElementById('passphrase-form');
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            var input = form.querySelector('input').value.trim().toLowerCase();
            if (input === phrase) {
                hideoverlay();
                util.createCookie(cookieName, true, 360);
            } else {
                var errorMessage = form.querySelector('.error-message');
                if (!errorMessage) {
                    errorMessage = document.createElement('div');
                    errorMessage.className = 'error-message';
                    form.appendChild(errorMessage);
                }
                errorMessage.textContent = 'Incorrect passphrase';
            }
        });
    }

    function showoverlay() {
        document.documentElement.classList.add('u-showoverlay');
        document.documentElement.classList.remove('u-passed');
    }

    function hideoverlay() {
        document.documentElement.classList.add('u-passed');
        document.documentElement.classList.remove('u-showoverlay');
    }

  return {
    init: init,
    close: close
  };
})();
