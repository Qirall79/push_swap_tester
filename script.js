const { exec } = require('child_process');
const fs = require('fs');

const NUMBERS_AMOUNT = 500;
const MAX_INSTRUCTIONS = 5500;
const RANGE_MIN = -9999;
const RANGE_MAX = 9999;
const EXECUTABLE_PATH = "../push_swap"
const CHECKER_PATH = "../checker_Mac"

const generateUniqueRandomNumbers = (count, min, max) => {
	const uniqueNumbers = new Set();
  
	while (uniqueNumbers.size < count) {
	  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
	  uniqueNumbers.add(randomNumber);
	}
  
	return Array.from(uniqueNumbers);
  };

  let i = 0;
  function runCommand(i) {
	process.stdout.write(`${i} `);
	const uniqueRandomNumbers = generateUniqueRandomNumbers(NUMBERS_AMOUNT, RANGE_MIN, RANGE_MAX);
	const numbers = uniqueRandomNumbers.join(' ');
  
	exec(`echo ${numbers} > numbers; ${EXECUTABLE_PATH} ${numbers} > moves && cat moves | ${CHECKER_PATH} ${numbers}`, (error, stdout, stderr) => {
	  
	  
  
	  // Read the file asynchronously inside the exec callback
	  fs.readFile("moves", 'utf-8', (readError, fileContent) => {
		if (readError) {
		  console.error('Error reading file:', readError);
		  return;
		}
  
		// Count the number of lines in the file
		const numberOfLines = fileContent.split('\n').length - 1;
		process.stdout.write(`${numberOfLines} ${stdout}`);
		process.stderr.write(`${stderr}`);
		// process.stdout.write(`\n${numbers}\n`);
		if (stdout === "KO\n" || stderr === "KO\n" || numberOfLines > MAX_INSTRUCTIONS) {
		  console.log("FAILED");
		  process.exit();
		}
  
		// Continue with the next iteration
		i++;
		if (i < 500000) {
		  runCommand(i);
		}
	  });
	});
  }
  
  runCommand(i);