module.exports=function(express,app,passport,config,rooms){

//var router= express.Router();
app.get('/',function(req,res,next){
	res.render('index',{});
})



function securePages(req,res,next){

	if(req.isAuthenticated()){
		next();
	}
	else{
		res.redirect('/');
	}
}

app.get('/chatrooms',securePages,function(req,res,next){
	res.render('chatroom',{user: req.user, config:config});
})

app.get('/setcolor',function(req,res,next){
	req.session.favcolor="red";
	res.send('Setting color');
})


app.get('/room/:id',securePages,function(req,res,next){

var room_name= findRoomname(req.params.id);

console.log('founddddddddddd'+room_name);

res.render('room',{user: req.user,room_number:req.params.id, room_name:room_name, config:config});


})

function findRoomname(id){

console.log('*********'+id);

var n=0;
while(n<rooms.length){
	console.log(rooms[n].room_number);
	if(rooms[n].room_number==id){

		console.log('finally gottttttttt'+rooms[n].room_name);
		return rooms[n].room_name;
		break;
	}else{
		n++;
		continue;
	}
}


}


app.get('/auth/facebook',passport.authenticate('facebook'))

app.get('/auth/facebook/callback',passport.authenticate('facebook',{
	successRedirect:'/chatrooms',
	failureRedirect:'/'

}))

app.get('/logout',function(req,res,next){
	req.logout();
	res.redirect('/');
})

app.get('/getcolor',function(req,res,next){
	req.session.favcolor="red";
	res.send('Fav color'+(req.session.favcolor===undefined?"Not set":req.session.favcolor));
})


}