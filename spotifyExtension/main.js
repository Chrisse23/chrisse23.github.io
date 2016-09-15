(function(ext) {
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    ext.search_songs = function(type, searchTerm, callback) {
        console.log(searchTerm);
        $.ajax({
          method: 'GET',
          url: 'https://api.spotify.com/v1/search?q=' + searchTerm,
          data: { type: type, limit: 10 }
        })
          .done(function(response) {
            var data = response[type+'s'].items;
            var formatedResponse = '';

            for (var i = 0; i < data.length; i++) {
                var duration = data[i].duration_ms / 60000;
                formatedResponse += 'Track: ' + data[i].name + ' Artist/band: ' + data[i].artists[0].name + ' Duration: ' + duration;
            };

            callback(formatedResponse);
          });
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['R', 'Search for a %m.type containing %s', 'search_songs', 'track', 'Arcade fire']
        ],
        menus: {
            type: ['track', 'album', 'playlist']
        }
    };

    // Register the extension
    ScratchExtensions.register('Search Spotify API extension', descriptor, ext);
})({});