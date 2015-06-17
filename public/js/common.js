window.socket = io();

function test_create_room(){
	socket.emit('room:create',{name:'test',description:'test room'});
}

function test_list_room(){
	socket.emit('room:list',{});
}

function test_subscribe_room(){
	socket.emit('room:subscribe',{_id:'55811420f55c83f7756b8422'});
}

function test_join_room(){
	socket.emit('room:join',{name:'test',_id:'55811420f55c83f7756b8422'});
}

function test_send_message(){
	socket.emit('message:new',{_id:'55811420f55c83f7756b8422',content:'test message'});
}

function test_list_message(){
	socket.emit('message:list',{_id:'55811420f55c83f7756b8422'});
}

