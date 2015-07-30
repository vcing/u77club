var _           = require('lodash');

function active(){
	var app          = this.app;
	var middlewares  = this.middlewares;
	var models       = this.models;
	var type         = 'active';
	var common       = this.common;
	var addOnline    = common.addOnline;
	var removeOnline = common.removeOnline;
	var onlineList   = common.onlineList;
	var errorHandle  = common.errorHandle;
	var emit		 = common.emit;
	var join		 = common.join;
	var leave		 = common.leave;

	app.io.route(type,{
		new:function(req,res){
			var options = {
				room:req.param('_id'),
				sender:req.session.user._id,
				content:req.param('content')
			}
			var active = new models.active(options);
			active.save(errorHandle(req,type,function(){
				var _options = {
					room:req.param('_id'),
					sender:req.session.user._id,
					content:'',
					active:active._id
				}
				var msg = new models.message(_options);
				msg.save(errorHandle(req,type,function(){
					app.io.to(req.param('_id')).emit(type+':new',{
						sender:req.session.user,
						room:msg.room,
						date:msg.date,
						content:msg.content,
						active:active._id,
						_id:msg._id
					});
				}));
			}));
		},
		list:function(req,res){
			if(req.param('roomId')){
				models.active.findByRoom(req.param('roomId')).then(function(actives){
					req.socket.emit(type+':list',{_id:req.param('roomId'),actives:actives});
				});	
			}else if(req.param('userId')){
				models.active.findBySender(req.param('userId')).then(function(actives){
					req.socket.emit(type+':list',{_id:req.param('userId'),actives:actives});
				});
			}
		},
		info:function(req,res){

		},
		support:function(req,res){

		},
		repost:function(req,res){

		},
		collect:function(req,res){

		},
		comment:function(req,res){

		}
	});
}

module.exports = active;