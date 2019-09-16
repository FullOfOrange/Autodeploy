const fs = require('fs');
const git = require('simple-git');
/**
 * Check repository directory is exist and
 * Create directory when can't approach repository dir 
 * @param {String: path} path 
 */
const checkDir = (path) => {
    return new Promise((resolve) => {
        fs.stat(path,(err) => {
            if(err){
                fs.mkdirSync(path,{recursive: true});
				console.log(`make ${path} dir`);
			}
			console.log(`check ${path} dir`)
            resolve();
        })
    })
}
/**
 * Update repository
 * (connect to clone & pull)
 * @param {String} path 
 * @param {String} user 
 * @param {String} repo 
 */
const update = async (path,user,repo) => {
	try{
		fs.statSync(path+'/'+repo);
		await pull(path,repo);
	}catch(err){
		await clone(path,user,repo);
	}
}
/**
 * Clone repository to get repository
 * @param {String} path 
 * @param {String} user 
 * @param {String} repo 
 */
const clone = (path,user,repo) => {
    return new Promise((resolve,reject) => {
        git(path)
        .clone(`https://github.com/${user}/${repo}`,repo,(err,data) => {
            if(err) { resolve(err) }
            resolve(data);
        });
    })
}
/**
 * Pull repository to update repository
 * @param {String} path 
 * @param {String} repo 
 */
const pull = (path,repo) => {
    return new Promise((resolve,reject) => {
        git(path+'/'+repo)
        .pull((err,update) => {
            if(err) { resolve(err) }
			if(update && update.summary.changes) { resolve(update) }
			//for debug;
			resolve('none');
        })
    });
}
module.exports = { checkDir, update }