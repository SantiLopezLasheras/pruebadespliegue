const TelegramBot = require("node-telegram-bot-api");
const core = require("@actions/core");

const token = core.getInput("telegram_token");
const ChatID = core.getInput("telegram_id_user");

const bot = new TelegramBot(token, { polling: true });

try {
  const message = `
  S'ha realitzat un push en la branca main que ha provocat l'execució del workflow nom_repositori_workflow amb els següents resultats:\n
  - linter_job: resultat associat
  - cypress_job: resultat associat
  - add_badge_job: resultat associat
  - deploy_job: resultat associat`;

  bot.sendMessage(ChatID, message);
  core.setOutput("msg", "Mensaje enviado correctamente");
} catch (e) {
  core.setFailed(e.message);
}
