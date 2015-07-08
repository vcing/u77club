var _ = require('lodash');

function admin(){
	var app          = this.app;
	var middlewares  = this.middlewares;
	var models       = this.models;
	var type         = 'admin';
	var common       = this.common;
	var addOnline    = common.addOnline;
	var removeOnline = common.removeOnline;
	var onlineList   = common.onlineList;
	var errorHandle  = common.errorHandle;

	app.get('/'+type+'/deleteall',function(req,res){
		models.room.remove({},function(){});
		models.message.remove({},function(){});
		models.user.remove({},function(){});
		models.usermessage.remove({},function(){});
		models.roomPermission.remove({},function(){});
		res.send('ok');
	});
}

module.exports = admin;