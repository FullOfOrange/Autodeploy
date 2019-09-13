const __DEPLOY_DIR = 'repos/deploy_test/'

const tar = require('tar-fs');

const Docker = require('dockerode');
const docker = new Docker({socketPath: '/var/run/docker.sock'});

//https://github.com/apocas/dockerode/issues/432
//이곳에서 해결되었다.
const pack = tar.pack(__DEPLOY_DIR);
docker.buildImage(
	pack, {t: 'login_test'}, function(err, stream) {
	if (err) {
		console.log(err);
		return;
	}
	
	stream.pipe(process.stdout, {
		end: true
	});
	
	stream.on('end', function() {
		console.log('done');
	});
});