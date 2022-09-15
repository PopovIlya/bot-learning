const TelegramApi = require('node-telegram-bot-api')
const{gameOptions, gameRepeatOptions} = require('./options')

const token = '5790208049:AAEZnEgakIiVVIAP3a5GnsRGyWxCBx0U5X0'

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Загадываю число от 0 до 9');
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}

const start = async () => {

    bot.setMyCommands([
        {command:'/start', description:'Приветствие'},
        {command:'/info', description:'Информация'},
        {command: '/game', description: 'Игра угадай число'},
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        try {
            if (text === '/start') {
                await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/5d6/2dd/5d62dd00-c5fc-42b9-8553-08295df0b0a0/11.webp');
                return bot.sendMessage(chatId, 'Начинаем');
            }
            if (text === '/info') {
                return bot.sendMessage(chatId, 'Тебя зовут ' + msg.from.first_name);
            }

            if (text === '/game') {
                return startGame(chatId);
            }
            return bot.sendMessage(chatId, 'Попробуй переформулировать свой вопрос');
        } catch (e) {
            return bot.sendMessage(chatId, 'Произошла ошибка');
        }
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === '/again') {
            return startGame(chatId);
        }

        if (data === chats[chatId]) {
            return await bot.sendMessage(chatId, 'Угадал, цифра ' + chats[chatId], gameRepeatOptions);
        } else {
            return await bot.sendMessage(chatId, 'Не угадал, цифра ' + chats[chatId], gameRepeatOptions);
        }
    })
}

start()