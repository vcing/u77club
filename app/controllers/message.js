function message(){
	var app         = this.app;
	var middlewares = this.middlewares;
	var models      = this.models

	app.io.route('message',{
		create:function(req,res){
			
		}
	});
}

module.exports = message;