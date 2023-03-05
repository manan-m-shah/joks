#!/usr/bin/env node

import { program } from "commander";
import install from "../lib/commands/install.js";
import check from "../lib/commands/check.js";

program.version('0.1.0');

program
  .command('install <package>')
  .alias('i')
  .alias('add')
  .alias('get')
  .description('install a package')
  .action(packageName => {
    // implementation for installing a package
    install(packageName)
  });

program
  .command('uninstall <package>')
  .description('uninstall a package')
  .action(packageName => {
    // implementation for uninstalling a package
    console.log(`Uninstalling package ${packageName}...`);
  });

program
    .command('check <package>')
    .description('check if a package is installed')
    .action(packageName => {
        // implementation for checking if a package is installed
        if (check(packageName)) {
            console.log(`${packageName} is installed!`);
        } else {
            console.log(`${packageName} is not installed!`);
        }
    });

program.parse(process.argv);