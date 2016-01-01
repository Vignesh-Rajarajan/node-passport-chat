var express= require('express'),
    app=express(),
    path= require('path'),
    cookieParser=require('cookie-parser'),
    session=require('express-session'),
    config=require('./config/config.js')
    connectMongo=require('connect-mongo')(session),
    mongoose= require('mongoose').connect(config.dbURL),
    passport= require('passport'),
    FacebookStrategy= require('passport-facebook').Strategy,
    rooms=[]

    //console.log(config.dbURL);

app.set('views',path.join(__dirname,'views'));
app.engine('html',require('hogan-express'));
app.set('view engine','html');
app.use(express.static(path.join(__dirname,'views')));
app.use(cookieParser());
//app.use(session({secret:config.sessionSecret, saveUninitialized:true, save:true}));
var env= process.env.NODE_ENV || 'development';

if(env==='development'){
	app.use(session({secret:config.sessionSecret, saveUninitialized:true, resave:true}))
}else{

	app.use(session({
	secret:config.sessionSecret,
	store: new connectMongo({
		//url:config.dbURL,
		mongoose_connection:mongoose.connection[0],
		stringify:true,
		saveUninitialized:true,
		 resave:true
	})

	}))
}

/*var userSchema= mongoose.Schema({
	name:String,
	pasword:String,
	fullname:String
})

var person=mongoose.model('user',userSchema);

var jhon= new person({
	name:'vignesh',
	password:'ghghgh',
	fullname:'vigneshhhh'
}) 

jhon.save(function(err){
	if(err){
		console.log(err);
	}
	else{
		console.log('done');
	}
})
*/

app.use(passport.initialize());
app.use(passport.session());

require('./auth/passportAuth.js')(passport, FacebookStrategy,config,mongoose)
console.log('rrrrrr'+config.host);

require('./routes/route.js')(express,app,passport,config,rooms);
console.log(path.join(__dirname,'views'));
console.log('Mode is'+env);

var abc=require('socket.io');
/*app.listen(3000,function(){
	console.log('chat cat working on port 3000');
})*/
app.set('port',process.env.PORT || 3000);
var server=require('http').createServer(app);
server.listen(app.get('port'),function(){
	console.log('Chatcat on Port:'+ server.address().port);
});
var io=abc.listen(server);
require('./socket/socket.js')(io,rooms);
