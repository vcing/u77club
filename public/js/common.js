window.socket = io();

function test_create_room(){
	socket.emit('room:create',{name:'test',description:'test room'});
}

function test_list_room(){
	socket.emit('room:list',{});
}

function test_join_room(){
	socket.emit('room:join',{name:'test',_id:'55800d37e25684b76ca0b16f'});
}