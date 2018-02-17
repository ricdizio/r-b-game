module.exports = {
    pickedColor: function(req, res){
        if (req.isSocket) {
            var tempTable = HashMap.getTableByReq(req);
            var socketId = sails.sockets.getId(req);
            Table.pickedColor(tempTable, socketId, req.param('color'));
        }
    },

}