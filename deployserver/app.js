const __DEPLOY_DIR = 'repos/deploy_test/'

const express = require('express');
const app = express();
const PORT = 20000;

const tar = require('tar-fs');
const Docker = require('dockerode');
const docker = new Docker({socketPath: '/var/run/docker.sock'});

const bulidDocker = () => {
	const pack = tar.pack(__DEPLOY_DIR);
	return new Promise(function(resolve,reject){
		docker.buildImage(
			pack, {t: 'login_test'}, function(err, stream) {
			if (err) {
				console.log(err);
				return;
			}
			stream.pipe(process.stdout, {end: true});
			stream.on('end', () => {
				resolve('done')
			});
		})
	});
}
app.use(express.json());
app.post('/', async function(req,res) {
	//const repo = req.body.repository.name;
	//const status_dir = fs.statSync(__PARENT_DIR+repo);
	let result = await bulidDocker();
	res.send(result);
});
app.listen(PORT, function() {
	console.log('ex-app listen port : '+ PORT);
});
