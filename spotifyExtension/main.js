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

    ext.get_from_position = function(data, position, property, callback) {
        if (property === 'artist') {
            var value = data[position][property][0]['name'];
        } else {
            var value = data[position][property];
        }
        callback(value);
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['R', 'Search for a %m.type containing %s', 'search_songs', 'track', 'Arcade fire'],
            ['R', 'Get from variable %s from position %n property %m.properties', 'get_from_position', 'response', 0, 'name']
        ],
        menus: {
            type: ['track', 'album', 'playlist'],
            properties: ['name', 'artist', 'preview_url']
        }
    };

    // Register the extension
    ScratchExtensions.register('Search Spotify API extension', descriptor, ext);
})({});