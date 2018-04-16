var socket = io();
//update the interface to the current step
socket.on('welcome', function(currentStep) {

  setStep(currentStep);
});

$(document).ready(function() {

  socket.emit('newUser');

  //disable scroll refresh
  $(document).on('touchmove', function(e) {

    e.preventDefault();
  }
  );

});
socket.on('setUserStep', function(step) {

  setStep(step);
});

function setStep(step) {

  if (step == 0) {

    setWelcome();
  } else if (step == 100) {

    //begin to load video
    downloadVideo();

    yellowSreen();
  } else if (step > 0 && step < 10) {

    buzzerTransition(step);

    if (step == 1) {

      setPage('page-question');
    }

  } else if (step == 10) {

    setCanvas();
    touchMove();

  } else if (step == 20) {


    setPage('page-video');
  } else if (step == 21) {

    playVideo();
  }
}

function setPage(newPage) {

  $('.page').animate({
    'opacity': 0
  }, 500, function() {

    $('.page').css('display', 'none');

    $('.' + newPage).animate({
      'opacity': 1
    }, 500, function() {

      $('.' + newPage).css('display', 'block');
    });

  });



}

/**
 * VIDEO
 */

function playVideo() {

  console.log('play video');
  $('#vid').css('display', 'block');
  $('.page-video').css('background-color', 'black');
  $('#vid').get(0).play();
}

function downloadVideo() {

  $('.page-video').append('<video muted playsinline src="../video/vid.mp4" id="vid" preload="auto"></video>');


  console.log('load video');

  video = $('#vid').get(0).load();
  //check if the video is ready to play
  checkVideo();
}

var isLoaded = 0;

function checkVideo() {


  video = $('#vid').get(0)

  console.log(video.readyState);

  if (video.readyState === 1) {

    video.pause();
  }

  if (video.readyState === 4) {

    console.log('Video is loaded !');

    //stop the loop
    isLoaded = 1;
    //pause the video
    video.pause();
    //user feedback the video is ready
    readyToPlay();
  }

  setTimeout(function() {

    if (!isLoaded) {
      checkVideo();
    }

  }, 500);
}

function readyToPlay(video) {

  $('.page-video').css('background-color', 'green');
}
/**
 * DRAW
 */

function setCanvas() {

  setPage('page-draw');

  //get canvas
  var cvs = $('#cvs').get(0);

  //set size of canvas
  cvs.width = $('.page-draw').width();
  cvs.height = $('.page-draw').height();
}


function touchMove() {

  var fx = [];
  var fy = [];
  var cvs = $('#cvs').get(0);
  var ctx = cvs.getContext('2d');

  ctx.lineJoin = "round";

  var cvsLeft = $('#cvs').position().left;
  var cvsTop = $('#cvs').position().top;

  $('#cvs').on('touchstart touchmove', function(e) {

    fx.push(e.touches[0].pageX - cvsLeft);
    fy.push(e.touches[0].pageY - cvsTop);

    draw(ctx, fx, fy);
  });

  $('#cvs').on('touchend', function() {

    fx = [];
    fy = [];
  });

  $('.btnRemove').on('touchstart', function() {

    clearctx(ctx);
  });

  $('.btnSend').on('touchstart', function() {

    sendImage(cvs, ctx);
  });

  $('.send-button').click(function() {

    var imgSend = cvs.toDataURL('image/png');

    //clearctx(ctx);
    socket.emit('sendImage', {
      img: imgSend
    });
  });
}


function draw(ctx, fx, fy) {

  ctx.strokeStyle = "white";
  ctx.lineWidth = 5;

  for (var i = 0; i < fx.length; i++) {

    ctx.beginPath();

    if (i) {

      ctx.moveTo(fx[i - 1], fy[i - 1]);
    } else {

      ctx.moveTo(fx[i] - 1, fy[i] - 1);
    }

    ctx.lineTo(fx[i], fy[i]);
    ctx.closePath();
    ctx.stroke();
  }
}

function clearctx(ctx) {

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}


/**
 * QUESTION
 */


function buzzerTransition(step) {

  $(".over").css({
    "display": "block",
    "background-color": "black"
  });

  $('.over').animate({
    opacity: 1
  }, 500, function() {

    $('.over').animate({
      opacity: 0
    }, 500, function() {

      $('.over').css({
        "display": "none",
        "background-color": "transparent"
      });
    });
  });
}

$(".buzzer-button").click(function() {

  var currentColor = $(this).css("background-color");

  var btn = $(this);

  btn.css("opacity", "0.5");

  $(".over").css({
    "display": "block",
    "background-color": currentColor
  });

  $(".over").animate({
    opacity: 1
  }, 700, function() {

    btn.css("opacity", "1");
  });
});


/**
 * WELCOME
 */

function setWelcome() {

  $('.fs-button').css({
    'top': ($(document).height() / 2) - ($('.fs-button').height() / 2),
    'left': ($(document).width() / 2) - ($('.fs-button').width() / 2),
    'display': 'block'
  });

  $('.fs-button').click(function() {

    toggleFullScreen(document.body);
    $(this).addClass('fs-ok');
  });
}

function yellowSreen() {
  $('.page-welcome').children().remove();

  $('.page-welcome').css('background-color', 'yellow');
}





function toggleFullScreen(elem) {
  // ## The below if statement seems to work better ## if ((document.fullScreenElement && document.fullScreenElement !== null) || (document.msfullscreenElement && document.msfullscreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
  if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
    if (elem.requestFullScreen) {
      elem.requestFullScreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullScreen) {
      elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  } else {
    if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}

/**
 * GET BROWSER
 */
var browser = function() {
  // Return cached result if avalible, else get result then cache it.
  if (browser.prototype._cachedResult)
    return browser.prototype._cachedResult;

  // Opera 8.0+
  var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

  // Firefox 1.0+
  var isFirefox = typeof InstallTrigger !== 'undefined';

  // Safari 3.0+ "[object HTMLElementConstructor]"
  var isSafari = /constructor/i.test(window.HTMLElement) || (function(p) {
    return p.toString() === "[object SafariRemoteNotification]";
  })(!window['safari'] || safari.pushNotification);

  // Internet Explorer 6-11
  var isIE = /*@cc_on!@*/ false || !!document.documentMode;

  // Edge 20+
  var isEdge = !isIE && !!window.StyleMedia;

  // Chrome 1+
  var isChrome = !!window.chrome && !!window.chrome.webstore;

  // Blink engine detection
  var isBlink = (isChrome || isOpera) && !!window.CSS;

  return browser.prototype._cachedResult = isOpera ? 'Opera' :
    isFirefox ? 'Firefox' :
      isSafari ? 'Safari' :
        isChrome ? 'Chrome' :
          isIE ? 'IE' :
            isEdge ? 'Edge' :
              isBlink ? 'Blink' :
                "Don't know";
};
