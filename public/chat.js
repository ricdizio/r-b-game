$('form').submit(function(){
    socket.emit('chat', $('#m').val());
    $('#m').val('');
    return false;
  });
  socket.on('chat', function(msg){
    console.log(msg);
    $('#messages').append($('<li>').text(msg));
    window.scrollTo(0, document.body.scrollHeight);
  });