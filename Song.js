const axios = require('axios');
const fuzzy = require('fuzzy-filter');

class Song {
    constructor() {
        this.headers = {
            headers: {
                'X-Mashape-Key': '3nKKbSoBmLmsh5MTjnkFE5R6SRkRp1dtJyPjsnBx6scTyPh8Fq',
                'Accept': 'application/json'}};
        this.artists = ['justin bieber',
                        'the beatles',
                        'metallica',
                        'oasis',
                        ];//add more artists here!

        this.currentSong;
    }

    getSong(cb) {
        return axios.
        get('https://community-lyricsnmusic.p.mashape.com/songs?api_key=&artist='
            + encodeURI(this.artists[Math.floor(Math.random() * this.artists.length)]),
            this.headers)
            .then((response) => {
                const songs = response.data;
                const song = songs[Math.floor(Math.random() * songs.length)];
                this.currentSong = {
                    lyrics: song.snippet,
                    title: song.title,
                    artist: song.artist.name,
                    lyrics_url: song.url,
                }
                cb(this.currentSong, null);
            })
            .catch((response) => {
                cb(null, 'ERROR!' + response);
            });

    }

    guess(guess){
        const result = fuzzy(this.currentSong.artist + ' - '
            + this.currentSong.title, [guess]);
        if(result.length > 0){
            return true;
        }
        return false;
    }

    reset(){
        this.currentSong = undefined;
    }

}
module.exports = Song;
