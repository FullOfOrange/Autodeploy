
const __PARENT_DIR = "../../";
const fs = require('fs');

const express = require('express');
const app = express();
const port = 20000;

app.use(express.json());
app.post('/', function(req,res) {
	const repo = req.body.repository.name;
	const status_dir = fs.statSync(__PARENT_DIR+repo);
	
	console.log(status_dir);

	res.send(repo);
});
app.listen(port, function() {
	console.log('ex-app listen port : '+ port);
});
