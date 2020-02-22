const path  = require('path');
const readline = require('readline');
const stylelint  = require('stylelint');

const cliParameter = process.argv[2];
const green = '\x1b[32m%s\x1b[0m';

let options = {
  fix: false,
  files: path.join(__dirname, "../src/theme/**/*.scss"),
  formatter: "string"
};

stylelint
  .lint(options)
  .then((data) =>  {
    if (data.errored === false) { return; }

    if (cliParameter === '-f') {
      options.fix = true;
      stylelint
        .lint(options)
        .catch();

      return;
    }
    console.log(data.output);

    if (cliParameter === '-h') {
      const red = "\x1b[31m";
      console.log(red, 'You are not in accordance with the CSS linter rules. If you want to fix them automatically type:');
      console.log(green, " npm run order-css:fix\n");

      return process.exit(1);
    }

    startDialog();
  });

function startDialog() {
  const cliQuestion = 'Do you want to fix it? (y for yes)';
  const interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  interface.question(`\x1b[33m${cliQuestion}\x1b[0m\n`, (answer) => {
    if (`${answer}` !== 'y') {
      interface.close();

      return;
    };

    options.fix = true;
    stylelint
      .lint(options)
      .then(() => {
        interface.close();
      })
      .catch(() => {
        interface.close();
      });

    console.log(green, 'fixed');
  });
}
