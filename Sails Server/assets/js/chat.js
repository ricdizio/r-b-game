$('#chat-form').submit(function(){
  io.socket.post('/play/chat', { message: $('#m').val() }, function (resData, jwRes) {
    jwRes.statusCode; // => 200
  });
    $('#m').val('');
    return false;
  });
  io.socket.on('chat', function(obj){
    id = obj.id;
    msg = obj.message;
  	var dt = new Date();
	  var time = dt.getHours() + ":" + dt.getMinutes();
  	var h = '<div class="box-messege"> <div class="box-title"> <span class="name-chat">' + id +  '</span>  ';
  	h = h + '<span class="time-chat">' + time +'</span> </div>';
  	h = h + '<span class="messege-chat">' + msg +'</span> </div>';
    $('#chat-list-box').append($(h));
    $("#chat-list-box").animate({ scrollTop: $('#chat-list-box')[0].scrollHeight}, 1000);
  });   
