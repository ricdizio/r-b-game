$('form').submit(function(){
    socket.emit('chat', $('#m').val(), socket.id);
    $('#m').val('');
    return false;
  });
  socket.on('chat', function(msg){
    $('#messages').append($('<li>').text(msg));
  });