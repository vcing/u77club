module.exports = {
	errorHandle: function(req,type,cb){
		return function(err,doc){
			if(err){
				req.socket.emit('system:'+type,err);
				console.log(err);
			}else{
				if(cb)cb(doc);
			}
		}
	},
	errorLog:function(text){
		console.log(text);
	}
}