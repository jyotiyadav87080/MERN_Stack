import chalk from "chalk";
console.log(chalk.redBright("Hello, Node.js World!"));
console.log(chalk.blueBright("Hello, Node.js World!"));
console.log(chalk.greenBright("Hello, Node.js World!"));
console.log(chalk.yellowBright("Hello, Node.js World!"));

// const chalk = require("chalk");
// console.log(chalk.red("Hello, Node.js World!"));

import { add, subtract } from "./4_math.js";
console.log(add(5, 3));
console.log(subtract(5,3));