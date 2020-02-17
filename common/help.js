const user_help =
	'\nvedere la prossima trasferta: <b>/prossima_trasferta</b>\n' +
	'vedere le prossime n trasferte: <b>trasferte n</b>\n' +
	"vedere tutte le trasferte dell'anno: <b>trasferte 0</b>\n" +
	"vedere l'ultima news: <b>ultima news</b>";

const template_help = '/template per vedere il template\n';

const add_help = (msg, arr) =>
	arr.commands.reduce((acc, val) => acc + '\n' + val, msg).concat('\n#####');

const trasferta =
	'inserisci trasferta\n' + '20/2/21 10:20\n' + 'dove\n' + 'messaggio\n';

const news = 'inserisci news\n' + 'messaggio\n';

const poll = 'inserisci sondaggio\n' + 'domanda\n' + 'risposte\n';

const template = trasferta.concat('#####\n') + news.concat('#####\n') + poll;

module.exports = {
	user_help: user_help,
	add_help: add_help,
	template: template,
	template_help: template_help,
};
