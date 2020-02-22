const sgf = require('staged-git-files');
const fs = require('fs');

sgf((error, stagedFiles) => {
  if (error) {
    console.log(error);
  }
  
  let failedDependencies = [];

  for (const stagedFile of stagedFiles) {
    if (stagedFile.filename.indexOf('package.json') === -1) { continue; }

    const packageJson = JSON.parse(fs.readFileSync(stagedFile.filename, 'utf8'));
    const dependencies = Object.assign({}, packageJson.dependencies, packageJson.devDependencies);

    Object.keys(dependencies).forEach((dependency) => {
      const version = dependencies[dependency];
      const regex = /([~*^]|\b\.x)/;

      if(regex.test(version)){
        failedDependencies.push(dependency);
      }
    });
  }

  if(failedDependencies.length > 0){
    console.log(`Oh no! ${failedDependencies.length} dependencies do not have exact versions specified: ${failedDependencies.join(', ')}. Do not use *, ^, ~, or x in the version, you need to fix this before committing to this repo.`);
    process.exit(1);
  }

  process.exit(0);
});