const express = require('express');
const uuid = require('uuid');

const app = express();
const id = uuid.v4();
const port = 20000;

app.get('/', function(req,res) {
	res.send(id);
});
app.listen(port, function() {
	console.log('ex-app listen port : '+ port);
});
