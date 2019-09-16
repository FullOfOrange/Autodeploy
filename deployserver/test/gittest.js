const __REPO_PATH = './repos';

const fs = require('fs');
const git = require('simple-git');

/**
 * Check repository directory is exist and
 * Create directory when can't approach repository dir 
 * @param {repository path} path 
 */
const checkRepoDir = (path) => {
    return new Promise((resolve) => {
        fs.stat(path,(err) => {
            if(err){
                let result = fs.mkdirSync(path,{recursive: true});
                resolve([result,err]);
            }
            resolve();
        })
    })
}
const cloneRepo = (path,user,repo) => {
    return new Promise((resolve,reject) => {
        git(path)
        .clone(`https://github.com/${user}/${repo}`,repo,(err,data) => {
            if(err) { resolve(err) }
            resolve(data);
        });
    })
}
const pullRepo = (path,repository) => {
    return new Promise((resolve,reject) => {
        git(path+'/'+repository)
        .pull((err,update) => {
            if(err) { resolve(err) }
            if(update && update.summary.changes) { resolve(update) }
        })
    });
}
let USER_NAME = 'fulloforange';
let REPO_NAME = 'deploy_test';

(async function(){
    try{
        await checkRepoDir(__REPO_PATH);
        await cloneRepo(__REPO_PATH,USER_NAME,REPO_NAME);
        await pullRepo(__REPO_PATH,REPO_NAME);
    } catch(err) {
        console.log(err);
    }
    
})();


