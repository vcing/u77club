
function test_create_room(){
	socket.emit('room:create',{name:'test',description:'test room'});
}

function test_list_room(){
	socket.emit('room:list');
}

function test_subscribe_room(){
	socket.emit('room:subscribe',{_id:'55819ca049d4c3fe7afba875'});
}

function test_join_room(){ 
	socket.emit('room:join',{name:'test',_id:'55819ca049d4c3fe7afba875'});
}

function test_leave_room(){
	socket.emit('room:leave',{name:'test',_id:'55819ca049d4c3fe7afba875'});
}

function test_send_message(){
	socket.emit('message:new',{_id:'55819ca049d4c3fe7afba875',content:'test message'});
}

function test_list_message(){
	socket.emit('message:list',{_id:'55819ca049d4c3fe7afba875'});
}

function test_list_connection(){
	socket.emit('connection:list');
}

function test_private_message(){
	socket.emit('message:private',{_id:'55819a5b422e8fef7a070099',content:'呵呵呵'});
}

//.

socket.on('connection:list',function(data){
	data = JSON.parse(data);
	console.log(data);
	window.list = data;
});

