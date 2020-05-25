const ansi = require('ansi');
const readline = require('readline');
const minimist = require('minimist');
const fs = require("fs");
const cursor = ansi(process.stdout);
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const argv = minimist(process.argv.slice(2), {
    alias: {
        file: 'f',
    },
});
//создание имя файла 
var path ="";
if (argv.file){
     path = `./${argv.file}.json`;  
} else{
     path = `./result.json`;
}
//запуск игры
const game = async () => {

    let player = await askName();
    let i;
    let gameNumber = 1;
    while (i !== 'stop') { 
        cursor.hex('#ffffff').bg.blue().write(`\n[------ Игра №${gameNumber}! ------]\n\n`).bg.reset().reset();
        i = await turn1(player);
        gameNumber++;
    }
    fs.writeFile(path, JSON.stringify(player, null, 4), err => {
        if (err) {
            console.log(`Ошибка созранения в файл ${path}.`, err);
            help();
        } else {
            console.log(`\nРезультаты игры успешно сохранены в файл ${path}.`);
            help();
        }
    })
    cursor.yellow().write('\n[------ Игра окончена! ------]\n\n').reset();
    let pwin = (player.win * 100)/ player.games;
                  pwin = pwin.toFixed(2);
                  let plose = 100 - pwin;
            cursor.write(`Игрок: `).red().write(`${player.player} `).reset().write(`Игр: ${player.games} `).write(`Побед: `).hex('#09ff00').write(`${player.win} (${pwin}%) `).reset().write('Поражений: ').red().write(`${player.lose} (${plose}%)\n`).reset();
              
    return player;
    
}
//Запрос имени
const askName = () => {
    return new Promise((resolve, reject) => {
       //получение имени из OS Windows или MacOS
        var pkuser = "Ирок";
        if (process.env.USERNAME) {
            pkuser = process.env.USERNAME;
        } else if (process.env.USER){
            pkuser = process.env.USER;
        }
        //запрос имени у игрока
        rl.question(`Введите имя (${pkuser}): `, (name) =>{
            if(name == ""){
                name = pkuser;
            }
            let player = {
                player: name,
                games: 0,
                win: 0,
                lose: 0,
            };
            resolve(player);
        }); 
        })
}
//ход
const turn1 = async (player) => {
    //генерация числа
    coin = Math.floor(1 + Math.random() * (2));
    //обработка неверного ответа
    let msg = `Орел или решка? (1 - Орел, 2 - Решка, Stop - выход)`;
    let i = 'error';
    while (i == 'error') { 
        i = await getAnswer(msg, player);
        msg = 'Неверное значение, укажите одно из занчений: 1 - Орел, 2 - Решка, Stop - выход)';
    }
    return i;
}
//запрос ответа и обработка ответа
const getAnswer = (msg, player) =>{
    return new Promise((resolve, reject) => {
        rl.question(msg, (answer) => {
            
                //Проверка ответа
                if(answer.toLowerCase() === 'stop'){
                answer = answer.toLowerCase();
                resolve(answer);
                }
                if (answer == 1 || answer == 2){
                    player.games ++;
                    if(answer == coin){
                        console.log("Ура! Вы угадали.");
                        player.win ++;
                    } else {
                        console.log("Вы не угадали!");
                        player.lose ++; 
                    }
                    resolve(answer);
                    
                    } else {
                        resolve('error');
                    }
                            

        });
        
}) 
}
//Hello Message
function hello(){
    cursor.hex('#ffffff').bg.red().write('\nДобро подаловать в игру "Орел и Решка!"\n\n').bg.reset().reset();
    console.log('Для указаия файла с ответами запуститие игру с ключом --file=[filename] или -f=[filename] без расширения файла.\nПример: node index.js --file=myRecords\nУказава имя файла, он будет создан в текущей директории c расширением .json.\nЕсли имя файла не задано, то будет использовано имя "result"');   
}
//Help Message
function help(){
cursor.yellow().write('\nКоманды для управление игрой:').reset().write('\n');
cursor.hex('#09ff00').write('Start').reset().write(' - Запуск игры\n');
cursor.hex('#09ff00').write('Score').reset().write(' - Отображение статистики\n');
cursor.hex('#09ff00').write('Exit').reset().write(' - Выход из программы\n');
cursor.hex('#09ff00').write('Help').reset().write(' - Отображение этой справки\n\n');
}
hello();
help();
var score ="";
rl.on('line', async (line) =>{    
    switch (line.toLowerCase()) {
        case 'start':
        score = await game();
          break;
        case 'help':
            help();
          break;
          case 'score':
              if (score){
                  let pwin = (score.win * 100)/ score.games;
                  pwin = pwin.toFixed(2);
                  let plose = 100 - pwin;
            cursor.write(`Игрок: `).red().write(`${score.player} `).reset().write(`Игр: ${score.games} `).write(`Побед: `).hex('#09ff00').write(`${score.win} (${pwin}%) `).reset().write('Поражений: ').red().write(`${score.lose} (${plose}%)\n`).reset();
              } else{
                  console.log('Нет данных, начните игру написав Start.')
              }
            break;
        case 'exit':
            rl.close();
          break;
        default:
          console.log('Неверная команда, для справки введите Help');
      }
    
});

