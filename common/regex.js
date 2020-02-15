const build = reg => RegExp(reg, 'i');
const add = msg => msg + '\\s+';

module.exports = {
	date: '\\d{1,2}/\\d{1,2}/\\d{2}',
	time: '\\d{2}:\\d{2}',
	single_word: '\\S+',
	n: '\\s*\n\\s*',
	body: '(?:\\s*\\S+)',
	s: '\\s+',
	add: add,
	build: build,
};
