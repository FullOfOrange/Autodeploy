const Docker = require('dockerode');
const docker = new Docker({
	host: '192.168.1.10',
  	port: process.env.DOCKER_PORT || 2375,
});



module.exports = {  };
