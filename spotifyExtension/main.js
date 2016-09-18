(function(ext) {
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
        } else {
            var value = data[position][properties];
        }
        return(value);
    };

    ext.play_preview = function(preview_url) {
        if ($('body').find('#track').length === 0) {
            $('body').append('<audio id=track src=' + preview_url + ' crossorigin=anonymous></audio>');
        }

        document.getElementById('track').play();
    };

    ext.stop_preview = function() {
        document.getElementById('track').pause();
    };

    ext.has_it_ended = function() {
        return document.getElementById('track').ended;
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['R', 'Search for a %m.type containing %s', 'search_songs', 'track', 'Arcade fire'],
            ['r', 'Get from variable %s from position %n property %m.properties', 'get_from_position', ' ', 0, 'name'],
            [' ', 'Play preview from url %s', 'play_preview', ' '],
            [' ', 'Stop preview', 'stop_preview']
            ['r', 'Has the song ended', 'has_it_ended']
        ],
        menus: {
            type: ['track', 'album', 'playlist'],
            properties: ['name', 'artist', 'preview_url']
        }
    };

    // Register the extension
    ScratchExtensions.register('Search Spotify API extension', descriptor, ext);
})({});