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
				reject(err);
			}
			stream.pipe(process.stdout, {end: true});
			stream.on('end', () => {
				resolve();
			});
		});
	});
}
/**
 * Run docker with 3000 port
 * @param {String: repository name} repository 
 */
const runDocker = (repository) => {
	return new Promise((resolve,reject) => {
		docker.createContainer({
			Image:repository,
			Tty:false,
			PortBindings: { "3000/tcp": [{ "HostPort": "3000" }] },
			name: repository
		},(err, container) => {
			if(err){
				reject(err);
			}
			container.start();
			resolve(container);
		});
	})
}
/**
 * Remove docker container by repository name
 * if container is not exist, this 
 * @param {String: repository name} repository 
 */
const removeDocker = (repository) => {
	return new Promise((resolve,reject) => {
		getContainerId(repository).then(id => {
			if(id){
				docker.getContainer(id).stop()
				.then((container)=>{
					container.remove().then(() => resolve());
				});
			}else{
				resolve();
			}
		});
	});
}
/**
 * Get container id by repository name
 * @param {String: repository name} repository 
 */
const getContainerId = (repository) => {
	return new Promise((resolve,reject) => {
		docker.listContainers((err, containers) => {
			if(err) {
				reject(err);
			}
			if (containers) {
				containers.forEach((container) => {
					let i = container.Names.findIndex((name) => {
						return name === `/ㅁ${repository}`;
					})
					if(i !== -1){
						resolve(containers[i].Id)
					}
				})
			}
			resolve(null);
		})
	});
}
module.exports = { bulidDocker, removeDocker ,runDocker };