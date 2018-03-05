module.exports = {
  pickedColor: function(req, res){
    if (req.isSocket) {
      var tempTable = HashMap.getTableByReq(req);
      var socketId = sails.sockets.getId(req);
      if(socketId == tempTable.playingPlayer.socketId){
        Table.pickedColor(tempTable, req.param('color'));
      }
    }
  },
  pickedPool: function(req, res){
    if (req.isSocket) {
      
    }
  }
}