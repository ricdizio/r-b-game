$('#chat-form').submit(function(){
    socket.emit('chat', $('#m').val(), socket.id);
    $('#m').val('');
    return false;
  });
  socket.on('chat', function(id, msg){
  	console.log(id);
  	var dt = new Date();
	var time = dt.getHours() + ":" + dt.getMinutes();
  	var h = '<div class="box-messege"> <div class="box-title"> <span class="name-chat">' + id +  '</span>  ';
  	h = h + '<span class="time-chat">' + time +'</span> </div>';
  	h = h + '<span class="messege-chat">' + msg +'</span> </div>';
    $('#chat-list-box').append($(h));
    $("#chat-list-box").animate({ scrollTop: $('#chat-list-box')[0].scrollHeight}, 1000);
  });   
