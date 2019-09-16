const {__repodir} = require('../options/global.js');

const Docker = require('dockerode');
const docker = new Docker({socketPath: '/var/run/docker.sock'});

const tar = require('tar-fs');

/**
 * Bulid docker with 'Dockerfile' in repository (path '/')
 * @param {String: repository name} repository 
 */
const bulidDocker = (repository) => {
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
				resolve()
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
		docker.run(repository, [], [process.stdout, process.stderr],{	
			Tty:false,
			PortBindings: { "3000/tcp": [{ "HostPort": "3000" }] },
			name: repository
		},(err, data, container) => {
			console.log(container);
			resolve(container);
		});
	})
}
/**
 * Remove docker container by repository name
 * @param {String: repository name} repository 
 */
const removeDocker = (repository) => {
	return new Promise((resolve) => {
		getContainerId(repository).then(id => {
			console.log(id);
			docker.getContainer(id)
			.stop()
			.then((container)=>{
				container.remove().then(() => {
					console.log('remove',container)
					resolve();
				});
			});
		})
	});
}
/**
 * Get container id by repository name
 * @param {String: repository name} repository 
 */
const getContainerId = (repository) => {
	return new Promise((resolve,reject) => {
		docker.listContainers((err, containers) => {
			containers.forEach((container) => {
				let i = container.Names.findIndex((name) => {
					return name === `/${repository}`;
				})
				console.log(i);
				resolve(containers[i].Id);
			})
		})
	})
}
module.exports = { bulidDocker, removeDocker ,runDocker };