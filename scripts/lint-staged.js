const sgf = require('staged-git-files');
const { spawn } = require('child_process');

sgf((error, stagedFiles) => {
  if (error) {
    console.log(error);
  }

  if (!stagedFiles.length) {
    return process.exit(0);
  }

  let files = [];

  for (const stagedFile of stagedFiles) {
    files.push(` --files ${stagedFile.filename}`);
  }

  const npm = spawn('npm', ['run', 'lint', '--', 'app', ...files, ], {
    cwd: process.cwd(),
    env: process.env,
    shell: true,
  });

  let errorCount = 0;

  npm.stdout.on('data', (data) => {
    const output = data.toString();

    console.log(output);

    if (output.indexOf('ERROR') > -1) {
      const count = (output.match(/ERROR/g) || []).length;
      errorCount += count;
    }
  });

  npm.stderr.on('data', (data) => {
    // console.error(data.toString());
  });

  npm.on('close', (code) => {
    console.log(`${errorCount} errors while linting staged files!`);

    if (code && errorCount) {
      if (process.argv[2] === '--no-hard-exit') {
        return process.exit(0);
      }
      
      return process.exit(1);
    }
  });
});