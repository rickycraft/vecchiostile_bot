function build(reg) {
	return RegExp(reg, 'i');
}

function add(msg) {
	return msg + '\\s+';
}

module.exports = {
	date: '\\d{1,2}/\\d{1,2}/\\d{2}',
	time: '\\d{2}:\\d{2}',
	single_word: '\\w+',
	n: '\\s*\n\\s*',
	body: '(?:\\s*\\w+)',
	s: '\\s+',
	add: add,
	build: build,
};
