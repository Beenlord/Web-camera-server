require('dotenv').config()
const { JsonDB, Config } = require('node-json-db')
const TgApi = require('node-telegram-bot-api')
const Chalk = require('chalk')

const Env = process.env
const ChError = Chalk.bold.red
const ChWarning = Chalk.bold.hex('#FFA500')
const ChDone = Chalk.bold.green

let Error = []

const Base = new JsonDB(new Config("WebCameraBase", true, false, '/'))
const Bot = new TgApi(Env.BOT_TOKEN, { polling: true })

async function main() {

    let localConfig = {}

    try {
        const savedConfig = await Base.getData('/config')
        updateConfig(savedConfig)
    } catch(error) {
        errorPush('Ошибка при получении конфига из базы данных.', error)
        updateConfig({
            startCapture: false,
        })
    }

    Bot.on('message', msg => {

        if (msg.text?.includes('/')) {
            
        }

        errorLog()
    })

    errorLog()

    function updateConfig(opt = {}) {
        localConfig = {
            ...localConfig,
            ...opt,
        }
        Base.push('/config', localConfig)
    }
}

function errorPush(...array) {
    Error.push(array.join('\n'))
}

function errorLog() {
    if (Error.length) {
        console.log(ChWarning(`[${Error.length}]: В процессе выполнения программы были обнаужены следующие ошибки:`))
        Error.forEach((Err, ErrKey) => {
            console.log(ChError(`[${ErrKey}]: ${Err}`));
        })
    }
    Error = []
}

main()
