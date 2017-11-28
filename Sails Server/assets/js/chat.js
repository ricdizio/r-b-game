$('form').submit(function(){
    socket.emit('chat', $('#m').val(), socket.id);
    $('#m').val('');
    return false;
  });
  socket.on('chat', function(id, msg){
    $('#messages').append($('<li>').text(id + ": " + msg));
  });