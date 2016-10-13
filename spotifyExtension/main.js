(function(ext) {
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    var audio = new Audio();

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
            var value = data[position][properties];
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

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['R', 'Search for a %m.type containing %s', 'search_songs', 'track', 'Håkan Hellström'],
            ['r', 'Get from variable %s from position %n property %m.properties', 'get_from_position', ' ', 0, 'name'],
            [' ', 'Play preview from url %s', 'play_preview', ' '],
            [' ', 'Stop preview', 'stop_preview'],
            ['r', 'Has the song ended', 'has_it_ended'],
            ['R', 'Related artists to %s', 'get_related_artists', ' ']
        ],
        menus: {
            type: ['track', 'album', 'playlist'],
            properties: ['name', 'artist', 'preview_url', 'artistId']
        }
    };

    // Register the extension
    ScratchExtensions.register('Search Spotify API extension', descriptor, ext);
})({});