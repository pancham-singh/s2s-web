#!/usr/bin/env node

const chalk = require("chalk");
const args = process.argv;

const help = () => {
  console.log(`
${chalk.yellow("Usage:")}

Commands:

build : Create production build of the app
start : Start development server on env.PORT (default 3000)
`);
};

if (args.length < 3) {
  console.error(chalk.red("Invalid Usage."));
  help();
}

const command = args[2];
const justBuildIt = Boolean(process.env.I_AM_STUPID);

switch (command) {
  case "start":
    require("../builder/scripts/start");
    break;

  case "build":
    require("../builder/scripts/build");
    break;

  default:
    console.error(chalk.red(`Unknown Command: ${command}`));
    help();
}
