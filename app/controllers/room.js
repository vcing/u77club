function room(){
	var app         = this.app;
	var middlewares = this.middlewares;
	var models      = this.models

	app.io.route('room',{
		create:function(req,res){
			var options = {
				name:req.param('name'),
				description:req.param('description'),
				private:req.param('private') || false,
				password:req.param('password') || false,
				owner:req.session.user
			}
			var room = new models.room(options);
			room.save(function(err){
				if(err)console.log(err);
			});
			res.status(200).json('hehe');
		},
		list:function(req,res){
			var rooms = models.room.find().select('_id name').exec(function(err,rooms){
				req.socket.emit('room:list',rooms);
			});
		},
		join:function(req,res){
			models.room.findById(req.param('_id')).exec(function(err,room){
				if(err)console.log(err);
				req.socket.join(room._id);
				app.io.to(room._id).emit('room:join',req.session.user);
			});
		},
		leave:function(req,res){
			models.room.find({_id:req.param('_id')}).exec(function(err,room){
				if(err)console.log(err);
				req.socket.leave(room._id);
				app.io.to(room._id).emit('room:leave',req.session.user);
			});
		},
		delete:function(req,res){

		}
	});
}

module.exports = room;