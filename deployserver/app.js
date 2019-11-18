const express = require('express');
const app = express();
const PORT = 3000;

const Docker = require('dockerode');
const docker = new Docker({
	host: '192.168.1.10',
  	port: process.env.DOCKER_PORT || 2375,
});

docker.listContainers((e) => {
	console.log(e);
})

app.use(express.json());
app.get('/', async function(req,res) {});

app.listen(PORT, function() {
	console.log('ex-app listen port : '+ PORT);
});