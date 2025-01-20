var JennDo = JennDo || {};

JennDo.passphrase = (function () {

    const phrase = 'mrs watkins';
    const cookieName = 'passphrase-accepted-btn';

    function init() {

        var cookie = util.getCookie(cookieName);

        console.log('Cookie:', cookie);

        if(cookie) {
            hideoverlay(cookie);
            return;
        } else {
            showoverlay();
        }

        var form = document.getElementById('passphrase-form');
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            var input = form.querySelector('input').value.trim().toLowerCase();

            var buttonText = "";
            buttonText = event.submitter.innerHTML;

            console.log('Button text:', buttonText);

            if (input === phrase) {
                hideoverlay(buttonText);
                util.createCookie(cookieName, buttonText, 360);
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

    function hideoverlay(accepted) {
        document.documentElement.classList.add('u-passed');
        document.documentElement.classList.remove('u-showoverlay');


        var acceptedMsg = document.getElementById('youaccepted');
        if(acceptedMsg){
            acceptedMsg.innerHTML = 'You have accepted with <strong>' + accepted + '</strong>.';
        }
    }

  return {
    init: init,
    close: close
  };
})();
