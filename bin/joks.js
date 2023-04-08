#!/usr/bin/env node

import { program } from "commander";
import add from "../lib/commands/add.js";
import check from "../lib/commands/check.js";
import remove from "../lib/commands/remove.js";

program.version("0.1.0");

program
  .command("add <package>")
  .alias("i")
  .alias("install")
  .alias("get")
  .description("add a package")
  .action((packageName) => {
    add(packageName);
  });

program
  .command("remove <package>")
  .alias("rm")
  .alias("uninstall")
  .alias("delete")
  .description("remove a package")
  .action((packageName) => {
    remove(packageName);
  });

program
  .command("check <package>")
  .description("check if a package is installed")
  .action((packageName) => {
    check(packageName);
  });

program.parse(process.argv);
