//basic layout for ajax with spotify's examples
//need to change redirect_URI after launch website

https://accounts.spotify.com/authorize?client_id=603ba6b52bf24da0a23b5db603d64c25&redirect_uri=http://localhost/billboard-spotify/&scope=playlist-modify-public,playlist-modify-private,user-read-private,user-read-email&response_type=token

// /#access_token=BQAQA0tn9H1CGvHDHUoTrog0DhVIi0GVxE4-G6ivwkc2cjs1qd_XiNMRNrHV1bNIN6W-FIRnVmD5yrWF6J_X2xMZP8XqTpcErjkgrc9dmIBQSb2p1RRPZ_-Z3gacyvZ_cnMzVE7Q33c-6L4geXwaUr1iTzOdDTIyjQ67xgd7-GlSXX0rU5kxCJOP-VV83ODKYLuwKmIsb-PrOmVuf_snug&token_type=Bearer&expires_in=3600

$(document).ready(function () {

    console.log(window.location.hash);
    //let accessToken;

    function accessTokenCheckAndStore() {
        const hashVar = window.location.hash;
        if (hashVar) {
            return accessToken = hashVar.slice(1) //cutting up query parameters of hash response key and putting them in an object
                .split('&')
                .reduce(function (initial, item) {
                    if (item) {
                        let parts = item.split('=');
                        initial[parts[0]] = decodeURIComponent(parts[1]);
                    }
                    return initial;
                }, {});
            //window.location.hash = '';
            console.log(accessToken);
            console.log(accessToken.access_token);
        };
    };

    accessTokenCheckAndStore();

    let currentUserId;

    let jsonPlaylistPost = JSON.stringify({
        "name": "playlistName"
    });

    console.log(jsonPlaylistPost);

    function getUserId() {
        return $.ajax({ //make sure you return the promise to the getUserId function in order to handle it, otherwise getUserId does not resvole to a function, it resolves to undefined
            url: "https://api.spotify.com/v1/me",
            type: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken.access_token); }, // in the accessToken object which is from cutting up the has response, access_token is the access token. 
            success: function (data) {
                console.log(data);
                currentUserId = data.id;
                console.log(currentUserId);
            }
        });
    };

    let playlistId;

    getUserId();
    //.then(postPlaylist) //promise handling-- need userId from above request before creating playlists on their account
    //.then(getPlaylist);

    function postPlaylist() {
        return $.ajax({
            url: `https://api.spotify.com/v1/users/${currentUserId}/playlists`,
            type: "POST",
            data: jsonPlaylistPost,
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken.access_token); }, // in the accessToken object which is from cutting up the has response, access_token is the access token. 
            success: function (response) {
                console.log('Woo! :)');
                console.log(response.id);
                playlistId = response.id;
            },
            error: function () {
                console.log();
                console.error("error");
            }
        });
    };

    function getPlaylist() {
        $.ajax({
            url: `https://api.spotify.com/v1/playlists/${playlistId}`,
            type: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken.access_token); }, // in the accessToken object which is from cutting up the has response, access_token is the access token. 
            success: function (response) {
                console.log('Woooop! :)');
                console.log(response);
                //playlistId = response.id;
            },
            error: function () {
                console.log();
                console.error("errorrrrr");
            }
        });
    };

    let songsList;

    function billboardSearch() {
        return $.ajax({
            url: "https://billboardapi.jacoblamont.now.sh/api/songs?chartName=hot-100&date=2018-01-01",
            type: "GET",
            success: function (response) {
                console.log('Woooop! :)');
                //playlistId = response.id;
                songsList = response.songs;
                //console.log(songsList);
            },
            error: function () {
                console.log();
                console.error("errorrrrr");
            }
        });
    };

    function logSong() {
        console.log(typeof songsIdList);
        console.log(songsIdListJSONObj);
    };

    billboardSearch()
        .then(createSongIdList)
        .then(createPlaylistAddJSON)
        .then(logSong);

    let track;
    let artist;
    let songsIdList = [""];
    console.log(typeof songsIdList);

    //let songsIdList = ["7sO5G9EABYOXQKNPNiE9NR", "4PpuH4mxL0rD35mOWaLoKS", "3hBXvHLlTHvnbwrPbeoyAj", "0tYHqwTW4s6VuPWDSD7n7K", "6V4KHt9xu4TPEnDFoBeacT", "3T6MAweakkNrMYs8jZIWtg", "32lItqlMi4LBhb4k0BaSaC", "2yQZwi1P8AkkxxFhQ8rMEK", "609qKv3KPAbdtp0LQH2buA", "4EpLU30bi1KNWkBTfgZkoK", "54p39OJ544KF6iFeCzbVjs", "3wGXyJGsCf1myH5MooQIqE", "0SqmAwQrNyypiTroSwVjbX", "52ioLaTnO2J7BWY8UN2n9D", "7CEJH5Ed7FBbXF6CqBQPlJ", "5w3NgfV8v1nNZFLUBlGHIL", "2hl6q70unbviGo3g1R7uFx", "4vaxvNDaLSoD36iZX515ug", "6waqLPcT6ruMhmd36OhmFO", "0tgVpDi06FyKpA1z0VMD4v"];

    function createSongIdList() {
        songsList.forEach(function (element) {
            track = encodeURIComponent(songsList[songsList.indexOf(element)].title);
            artist = encodeURIComponent(songsList[songsList.indexOf(element)].artist);
            searchSong(songsList.indexOf(element)); //need to handle promise in order to get ordering correct?
        });
        new Promise(function (resolve, reject) {
            resolve(songsIdList);
        });
    };

    function searchSong(item) {
        return $.ajax({
            url: `https://api.spotify.com/v1/search?q=${track}+${artist}&type=track`,
            type: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken.access_token); }, // in the accessToken object which is from cutting up the has response, access_token is the access token. 
            success: function (response) { //could add in validation -- if listing has album, artist, song, year, etc
                //console.log('Woooop! :)');
                //console.log(response);
                //console.log(response.tracks.items[0].id);
                try {
                    if (response.tracks.items[0] != undefined) {
/*                         console.log(item);
                        console.log(typeof songsIdList);
                        console.log(typeof response.tracks.items[0].id); */
                        songsIdList.push(response.tracks.items[0].id); // need to stringify? reults maybe key value pair
                    }; //only taking top search result
                }
                catch (error) {
                    console.error(error);
                }
            },
            error: function () {
                console.log();
                console.error("errorrrrr");
            }
        });
    };

    let songsIdListJSON = [""];
    let songsIdListJSONObj = {};

    function createPlaylistAddJSON() {
        console.log(songsIdList.length);
        songsIdList.forEach(function (element) {
            console.log("hi");
            console.log(songsIdList);
            console.log(element);
            return songsIdListJSON.push("spotify:track:" + element);
        });
        songsIdListJSONObj = JSON.stringify({ "uris": songsIdListJSON });
        console.log(songsIdList);
        console.log(songsIdListJSON);
        return songsIdListJSONObj;
    };




});