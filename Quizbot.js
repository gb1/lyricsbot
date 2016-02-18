const Botkit = require('Botkit');
const Jukebox = require('./Song');
const Song = new Jukebox();

const controller = Botkit.slackbot({debug: false});

process.env.token = 'xoxb-22034265987-9iSg5xYvlHDCtOZXfpegWd5I';

controller.spawn({token: process.env.token}).startRTM();


controller.hears(['play'], ['direct_mention'], (bot, message) => {
    if (Song.currentSong === undefined) {
        Song.getSong((song) => {
            bot.reply(message, song.lyrics);
        });
    }
});

controller.hears(['give up'], ['direct_mention'], (bot, message) => {
    if (Song.currentSong !== undefined) {
        bot.reply(message, "Ya, that was a hard one, maybe some Justin Bieber next time?");
        bot.reply(message, "*the answer was:*");
        bot.reply(message, Song.currentSong.artist + ' - ' + Song.currentSong.title);
        bot.reply(message, Song.currentSong.lyrics_url);
        Song.reset();
    }
});

controller.hears(['.*'], ['direct_mention'], (bot, message) => {
    if (Song.currentSong !== undefined) {
        if (Song.guess(message.text)) {
            bot.api.reactions.add({
                timestamp: message.ts,
                channel: message.channel,
                name: 'metal'});
            bot.reply(message, "Correct  + " + message.user)
            bot.reply(message, Song.currentSong.artist + ' - ' + Song.currentSong.title);
            bot.reply(message, Song.currentSong.lyrics_url);
            Song.reset();
        } else {
            console.log(message);
            bot.reply(message, "<@" + message.user + ">")
            bot.reply(message, {text: 'It\'s good but it\'s not right'});
        }
    }
});