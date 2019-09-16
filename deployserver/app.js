const { __repodir } = require('./options/global.js');

const { checkDir, update } = require('./libs/repository.js');
const { bulidDocker, removeDocker, runDocker } = require('./libs/docker.js');

const express = require('express');
const app = express();
const PORT = 20000;

//최초에 레포지토리 저장용 dir을 설정합니다.
checkDir(__repodir);

app.use(express.json());

//route 진행
app.post('/', async function(req,res) {
	res.send('send success');

	console.log('request drived',req.body.repository.full_name)
	const request = req.body;
	const [username,repo] = request.repository.full_name.split('/');
	
	try{
		await update(__repodir,username,repo);
		await bulidDocker(repo);
		await removeDocker(repo);
		await runDocker(repo);
		console.log('done');
	}catch(err){
		console.log(`something err: ${err}`);
	}
});
app.listen(PORT, function() {
	console.log('ex-app listen port : '+ PORT);
});
