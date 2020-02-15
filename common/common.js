const API = require('../api/api');
const User = require('../database/user');
const Photo = require('../database/photo');

const public = async (msg, isphoto) => {
	let users = User.all();
	let photo = null;
	if (isphoto) photo = await Photo.latest();
	users = await users;

	users.forEach(user => {
		API.telegram.sendMessage(user.user_id, msg, API.Extra.HTML());
		if (isphoto && photo)
			API.telegram.sendPhoto(user.user_id, photo.photo_id);
	});
};

module.exports = { public: public };
