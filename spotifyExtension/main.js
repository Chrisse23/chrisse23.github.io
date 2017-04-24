(function(ext) {
    var audio = new Audio();
    var timeToWait = 400;
    var volumeFadeIn = false;
    var volumeFadeOut = false;
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    ext.search_songs = function(type, searchTerm, callback) {
        $.ajax({
          method: 'GET',
          url: 'https://api.spotify.com/v1/search?q=' + searchTerm,
          data: { type: type, limit: 10 }
        })
          .done(function(response) {
            var data = response[type+'s'].items;
            callback(data);
          });
    };

    ext.get_from_position = function(data, position, properties) {
        if (properties === 'artist') {
            var value = data[position][properties + 's'][0]['name'];
        } else if (properties === 'artistId') {
            var value = data[position]['artists'][0]['id'];
        } else {
            if (properties === 'låtnamn') {
                var value = data[position]['name'];
            } else if(properties === 'låten') {
                var value = data[position]['preview_url'];
            }
        }
        return(value);
    };

    ext.play_preview = function(preview_url) {
        audio.src = preview_url;
        audio.play();
    };

    ext.stop_preview = function() {
        audio.pause();
    };

    ext.has_it_ended = function() {
        return audio.ended;
    };

    ext.get_related_artists = function(id, callback) {
        $.ajax({
          method: 'GET',
          url: 'https://api.spotify.com/v1/artists/' + id + '/related-artists'
        })
          .done(function(response) {
            var data = response['artists'];
            callback(data);
          });
    };

    ext.start_from = function(seconds) {
        audio.currentTime = seconds;
    };

    ext.fade_in = function() {
        if (!volumeFadeIn) {
            audio.volume = 0;
            volumeFadeIn = true;
        }

        if (audio.volume < 1 && (audio.volume + 0.1) < 1) {
            setTimeout(function() {
                audio.volume += 0.1;
                timeToWait += 100;
                ext.fade_in();
            }, timeToWait);
        } else {
            timeToWait = 400;
            volumeFadeIn = false;
        }
    }

    ext.fade_out = function() {
        if (!volumeFadeOut) {
            audio.volume = 1;
            volumeFadeOut = true;
        }

        if (audio.volume > 0 && (audio.volume - 0.1) >= 0) {
            setTimeout(function() {
                audio.volume -= 0.1;
                timeToWait += 100;
                ext.fade_out();
            }, timeToWait);
        } else {
            timeToWait = 400;
            volumeFadeOut = false;
        }
    }

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['R', 'Sök efter %m.type som innehåller %s', 'search_songs', 'track', 'Håkan Hellström'],
            ['r', 'Hämta från variabel %s på position %n property %m.properties', 'get_from_position', ' ', 0, 'låtnamn'],
            [' ', 'Spela låt från url %s', 'play_preview', ' '],
            [' ', 'Pausa', 'stop_preview'],
            ['r', 'Har låten slutat spela', 'has_it_ended'],
            ['R', 'Relaterade artister till %s', 'get_related_artists', ' '],
            [' ', 'Starta från %n sekunder', 'start_from'],
            [' ', 'Fade in', 'fade_in'],
            [' ', 'Fade out', 'fade_out'],
        ],
        menus: {
            type: ['track', 'album', 'playlist'],
            properties: ['låtnamn', 'artist', 'låten', 'artistId']
        }
    };

    // Register the extension
    ScratchExtensions.register('Search Spotify API extension', descriptor, ext);
})({});