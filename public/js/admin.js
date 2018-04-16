var socket = io.connect('http://10.192.250.101:8080');

socket.on('welcome', function(step) {

  $('.admin-content').css('opacity', '1')
  $('.wait').remove();
  setColorButton(step);
});

$(document).ready(function() {

  $('.wait').css({
    top: ($(document).height() / 2) - ($('.wait').height() / 2)
  });

  socket.emit('newAdmin');
});

$('.step-button').click(function() {

  setStep($(this).attr('step'));

  setColorButton($(this).attr('step'));
});

function setStep(newStep) {

  socket.emit('setStep', {
    step: newStep
  });
}

function setColorButton(step) {

  $('.step-button').css('background-color', 'lightGrey');
  $('button[step="' + step + '"]').css('background-color', 'green');

}
