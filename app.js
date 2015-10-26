var express = require ('express');
var app = express();
var bodyParser = require('body-parser');
var mongojs = require('mongojs');
var passport = require('passport');
var expressValidator = require('express-validator');
var db = mongojs('clientkeeper', ['clients']);

//set static folder
app.use(express.static(__dirname+ '/public'));
app.use(bodyParser.json());

app.use(expressValidator({
  errorFormatter: function(param, msg) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg
    };
  }
}));


//show all clients
app.get('/clients', function(req, res){
	console.log('request for clients recieved');
	db.clients.find().sort({first_name: 1}, function(err, docs){
		if(err){
			res.send(err);
		} else {
			console.log('sending data');
			res.json(docs);
		}
	});
});

//add a client
app.post('/clients', function(req, res){
	console.log("aaaaaaaaaaaaaaaa");

	// var firstname = req.body.first_name;
	// var lastname = req.body.last_name;
	// var email = req.body.email;
	// var phone = req.body.phone;

 //    console.log(firstname + " " + lastname + " " + email +" "+ phone);


	req.checkBody('first_name', 'Firstname field is required').notEmpty();
	req.checkBody('last_name', 'Lastname field is required').notEmpty();
	req.checkBody('email', 'Must be valid email address').isEmail();
	req.checkBody('phone', 'Phone field is required').notEmpty();


    // check the validation object for errors
	var errors = req.validationErrors();

	console.log(errors);
	console.log("mirt");

	if(errors){
		//res.send("errorrrrr", errors);
		console.log('error'); 
	}
	else{
		console.log("no error");
		db.clients.insert(req.body, function(err, doc){
			if(err){
				res.send(err);
			} else {
				console.log('Cliend Added');
				res.json(doc);
			}
		});
	}











});


//select show one client
app.get('/clients/:id', function(req, res){
	var id = req.params.id;

	db.clients.findOne({_id: mongojs.ObjectId(id)}, function(err, doc){
		if(err){
			res.send(err);
		} else {
			res.json(doc);
		}	
	})
});

//update the selected client
app.put('/clients/:id', function(req, res){
	var id = req.params.id;

	db.clients.findAndModify({query: {_id: mongojs.ObjectId(id)}, update:{
		$set: {
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			email: req.body.email,
			phone: req.body.phone
		}},
		new: true
	}, function(err, doc){
		res.json(doc);

	});
});

//delete the selected client
app.delete('/clients/:id', function(req, res){
	var id = req.params.id;
	db.clients.remove({_id: mongojs.ObjectId(id)}, function(err, doc){
		if(err){
			res.send(err);
		} else {
			console.log('client removed');
			res.json(doc);
		}	
	});
})

app.listen(3000);

console.log("ready on port 3000");