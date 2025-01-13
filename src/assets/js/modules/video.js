var JennDo = JennDo || {};

JennDo.video = (function () {
  var players = {};

  /*
        The Youtube integration isn't finished  / is a previous implementation 
    */

  const urlsplit = {
    vimeo: ['/video/', 'vimeo.com/'],
    youtube: ['youtu.be/', '/embed/']
  };

  const urlquery = {
    vimeo: [],
    youtube: ['v', 'h', 'z']
  };

  function init() {
    let initYoutube = false;
    let initVimeo = false;

    document.querySelectorAll('.js-videoEmbed').forEach((video) => {
      var videoProvider = 'vimeo';

      if (video.hasAttribute('data-video-provider')) {
        videoProvider = video.getAttribute('data-video-provider').toLowerCase();
      }

      if (videoProvider.indexOf('vimeo') > -1) {
        video.classList.add('js-vimeoEmbed');
        initVimeo = true;
      } else if (videoProvider.indexOf('youtube') > -1) {
        video.classList.add('js-youtubeEmbed');
        initYoutube = true;
      }
    });

    if (document.getElementsByClassName('js-startEmbed').length > 0)
      startEmbed();
    if (initYoutube) loadYT();
    if (initVimeo) loadVimeo();

    //if (document.getElementsByClassName('js-vimeoEmbed').length > 0) loadVimeo();
    //if (document.getElementsByClassName('js-startEmbed').length > 0) startEmbed();
  }

  function startEmbed() {
    document.querySelectorAll('.js-startEmbed').forEach((self) => {
      self.addEventListener('click', (e) => {
        e.preventDefault();
        const videoEmbed = self.parentNode.querySelector('.js-videoEmbed');
        var domID = videoEmbed.getAttribute('id');
        pauseVideo(domID);
      });
    });

    document.querySelectorAll('.js-videoAndText').forEach((self) => {
      self.addEventListener('click', (e) => {
        const videoEmbed = self.querySelector('.js-videoEmbed');
        var domID = videoEmbed.getAttribute('id');
        pauseVideo(domID);
      });
    });

    document.querySelectorAll('.js-videoControls').forEach((self) => {
      self.addEventListener('click', (e) => {
        const domID = self.getAttribute('data-videoid');
        pauseVideo(domID);
      });
    });
  }

  function loadVimeo() {
    var tag = document.createElement('script');
    tag.src = 'https://player.vimeo.com/api/player.js';
    tag.scriptsrc = 'https://player.vimeo.com/api/player.js';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    tag.onload = function () {
      vimeoReady();
    };
  }

  const optionsEmbed = {
    id: 1,
    height: '427',
    width: '760',
    autoplay: 'false',
    responsive: false
  };

  const optionsAutoplay = {
    id: 1,
    height: '900',
    width: '1600',
    autoplay: 'true',
    responsive: false,
    background: true
  };

  function vimeoReady() {
    var debounceResize = util.debounce(resizeContainers, 200);
    window.addEventListener('resize', debounceResize);
    //resizeContainers();

    document
      .querySelectorAll('.js-vimeoEmbed')
      .forEach((video) => loadVimeoIframe(video));
  }

  function loadVimeoIframe(video) {
    let videoUrl = video.getAttribute('data-video-url');
    let videoID = '';
    videoID = getIDFromPath(urlsplit.vimeo, videoUrl);

    var autoplay = false;
    if (video.getAttribute('data-video-autoplay') != null) {
      autoplay =
        video.getAttribute('data-video-autoplay').toLowerCase() == 'true';
    }

    let domID = video.getAttribute('id');
    var options = autoplay ? optionsAutoplay : optionsEmbed;
    options.id = videoID;
    options.controls = false;
    options.chromecast = false; // disable chromecast
    players[domID] = new Vimeo.Player(domID, options);
    players[domID].on('loaded', function () {
      var controls = document.querySelector(
        '.js-videoControls[data-videoid="' + domID + '"]'
      );
      if (controls) controls.classList.remove('u-invisible');

      //document.querySelector(`#${domID}`).nextSibling.querySelector('img').style.display = 'none';

      resizeOneContainer(video);

      if (!autoplay) {
        showPlay(video);
      }
    });

    players[domID].on('play', function () {
      if (autoplay) {
        showAutoPlay(video);
      }
    });
  }

  function pauseVideo(domID) {
    var theVideo = document.getElementById(domID);
    var hasControls = theVideo.classList.contains('js-videoWithControls');

    players[domID].getPaused().then(function (paused) {
      if (!paused) {
        theVideo.parentNode
          .querySelector('.js-startEmbed')
          .classList.remove('u-playing');
        players[domID].pause();
      } else {
        theVideo.parentNode
          .querySelector('.js-startEmbed')
          .classList.add('u-playing');
        players[domID].play();

        if (hasControls) {
          theVideo.classList.add('video-embed--initated');
        }
      }
    });
  }

  function resizeOneContainer(video) {
    let theHeight = video.offsetHeight;
    let theWidth = video.offsetWidth;

    let videoWidth = theWidth;
    let videoHeight = theHeight;

    //16:9 = height = 56.25% of width
    //16:9 = width = 177.78% of height

    let styleString = '';

    if (theHeight / theWidth > 0.5625) {
      //this container is more square than 16:9
      //force video height to be as tall as container
      //force video width to be width * 1.7778

      videoWidth = Math.ceil(videoHeight * 1.7778);
    } else {
      //this container is more letterbox than 16:9
      //force video width to be as wide as container
      //force video height to be width * 0.5625
      videoHeight = Math.ceil(videoWidth * 0.5625);
    }

    styleString =
      'width: ' + videoWidth + 'px; height: ' + videoHeight + 'px; ';

    if (video.querySelector('iframe')) {
      video.querySelector('iframe').setAttribute('style', styleString);
    }
  }

  function resizeContainers() {
    document.querySelectorAll('.js-vimeoEmbed').forEach((video) => {
      //video.setAttribute("style","");

      setTimeout(() => {
        resizeOneContainer(video);
      }, 20);
    });
  }

  function showPlay(iframe) {
    iframe.parentNode.querySelector('.js-startEmbed').classList.add('u-loaded');
  }

  function showAutoPlay(iframe) {
    iframe.parentNode.querySelector('.js-startEmbed').classList.add('u-loaded');
    const videoPlaceholder = iframe.parentNode.querySelector('.js-startEmbed');

    //wait til it starts playing and then remove the stuffs
    videoPlaceholder.classList.add('video-embed__placeholder--hide');
  }

  function loadYT() {
    // 2. This code loads the IFrame Player API code asynchronously.
    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
  }

  // 3. This function creates an <iframe> (and YouTube player)
  //    after the API code downloads.

  const optionsWideYT = {
    height: '427',
    width: '760',
    videoId: 1,
    autoplay: 0,
    events: {}
  };

  window.onYouTubeIframeAPIReady = function () {
    document.querySelectorAll('.js-youtubeEmbed').forEach((video) => {
      let videoUrl = video.getAttribute('data-video-url');
      let videoID = '';

      videoID = getIDFromParam(urlquery.youtube, videoUrl);

      if (videoID == null || !videoID.length) {
        videoID = getIDFromPath(urlsplit.youtube, videoUrl);
      }

      let domID = video.getAttribute('id');
      var options = optionsWideYT;
      options.videoId = videoID;

      options.events = {
        onReady: onPlayerReady
      };

      players[domID] = new YT.Player(domID, options);
    });
  };

  // 4. The API will call this function when the video player is ready.
  window.onPlayerReady = function (event) {
    //do something
    for (const [key, value] of Object.entries(players)) {
      if (value == event.target) {
        showPlay(document.getElementById(key));
      }
    }
  };

  window.startVideoYT = function (domID) {
    var player = players[domID];
    player.playVideo();
  };

  window.stopVideoYT = function () {
    //player.stopVideo();
  };

  function getIDFromParam(paramArr, string) {
    let theId = null;
    paramArr.forEach((param) => {
      if (theId !== null && theId.length > 0) {
        return;
      } else {
        theId = util.getParameterFromString(param, string);
      }
    });
    return theId;
  }

  function getIDFromPath(splitArr, string) {
    let theId = null;
    splitArr.forEach((split) => {
      if (theId !== null && theId.length > 0) {
        return;
      } else if (string.indexOf(split) > -1) {
        let urlArr = string.split(split);
        theId = urlArr[urlArr.length - 1];

        if (theId.indexOf('?') > -1) {
          theId = theId.split('?')[0];
        }
      }
    });
    return theId;
  }

  return {
    init: init
  };
})();
