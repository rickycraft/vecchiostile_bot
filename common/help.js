const user_help =
	'\nvedere la prossima trasferta: <b>trasferte</b>\n' +
	'vedere le prossime n trasferte: <b>trasferte n</b>\n' +
	"vedere tutte le trasferte dell'anno: <b>trasferte 0</b>\n" +
	"vedere l'ultima news: <b>ultima news</b>";

const add_help = (msg, arr) =>
	arr.commands.reduce((acc, val) => acc + '\n' + val, msg).concat('\n#####');

const trasferta =
	'inserisci trasferta\n' + '20/2/21 10:20\n' + 'dove\n' + 'messaggio\n';

const news = 'inserisci news\n' + 'messaggio\n';

const template = trasferta.concat('#####\n') + news;

module.exports = {
	user_help: user_help,
	add_help: add_help,
	template: template,
};
