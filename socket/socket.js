module.exports= function(io,rooms){
	//console.log('im in socket.jss file');
var chatrooms= io.of('/roomlist').on('connection',function(socket){

	console.log('Connection Establisshed On server');
    socket.emit('roomupdate',JSON.stringify(rooms));
	socket.on('newroom',function(data){
		rooms.push(data);
		console.log(rooms);
		socket.broadcast.emit('roomupdate',JSON.stringify(rooms));
		socket.emit('roomupdate',JSON.stringify(rooms));

	})
})

var messages=io.of('/messages').on('connection',function(socket){
	console.log('connected to chat room');
	socket.on('joinchat',function(data){
		socket.username=data.user;
		socket.userPic=data.userPic;
		socket.join(data.room);
	})
})

}