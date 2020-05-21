const ansi = require('ansi');
const cursor = ansi(process.stdout);
cursor.hex('#ffffff').bg.red().write('Hello World!\n').hex('#09ff00').bg.reset().write('How Are You?').reset().write('\n');
