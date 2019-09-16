const {__repodir} = require('../options/global.js');

const Docker = require('dockerode');
const docker = new Docker({socketPath: '/var/run/docker.sock'});

const tar = require('tar-fs');
/**
 * Bulid docker with 'Dockerfile' in repository (path '/')
 * @param {String: repository name} repository 
 */
const bulidDocker = (repository) => {
	console.log(repository);
	const pack = tar.pack(__repodir+'/'+repository);
	return new Promise((resolve,reject) => {
		docker.buildImage(
			pack, {t: repository}, function(err, stream) {
			if (err) {
				console.log(err);
				return;
			}
			stream.pipe(process.stdout, {end: true});
			stream.on('end', () => {
				resolve('done')
			});
		});
	});
}
/**
 * Run docker with 3000 port
 * @param {String: repository name} repository 
 */
const runDocker = (repository) => {
	return new Promise((resolve) => {
		docker.run(repository, [], [process.stdout, process.stderr],
		{	Tty:false,
			PortBindings: { "3000/tcp": [{ "HostPort": "3000" }] },
			name: repository
		},function (err, data, container) {
			resolve(container);
		});
	})
}
module.exports = { bulidDocker, runDocker };