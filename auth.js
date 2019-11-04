https://accounts.spotify.com/authorize?client_id=603ba6b52bf24da0a23b5db603d64c25&redirect_uri=http://localhost/billboard-spotify/&scope=playlist-modify-public,playlist-modify-private,user-read-private,user-read-email&response_type=token

$(document).ready(function () {

    let currentUserId;
    let playlistId;

    accessTokenCheckAndStore();
    getUserId()
        .then(postPlaylist)
        .then(billboardSearch)
        .then(createSongIdList)
        .then(createPlaylistAddJSON)
        .then(addTracks)

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
        };
    };
    function getUserId() {
        return $.ajax({ //make sure you return the promise to the getUserId function in order to handle it, otherwise getUserId does not resvole to a function, it resolves to undefined
            url: "https://api.spotify.com/v1/me",
            type: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken.access_token); }, // in the accessToken object which is from cutting up the has response, access_token is the access token. 
            success: function (data) {
                currentUserId = data.id;
            }
        });
    };

    function postPlaylist() {
        return $.ajax({
            url: `https://api.spotify.com/v1/users/${currentUserId}/playlists`,
            type: "POST",
            data: JSON.stringify({
                "name": "ttName"
            }),
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken.access_token); }, // in the accessToken object which is from cutting up the has response, access_token is the access token. 
            success: function (response) {
                playlistId = response.id;
            }
        });
    };

    function billboardSearch() {
        return $.ajax({
            url: "https://billboardapi.jacoblamont.now.sh/api/songs?chartName=hot-100&date=2007-01-01",
            type: "GET",
            success: function (response) {
                return response.songs;
            }
        });
    };

    async function createSongIdList(songsList) {
        const songsIdList = await Promise.all(songsList.songs.map(function(el) {
            const query = encodeURIComponent(`${el.title}+${el.artist}`)
            return $.ajax({
                url: `https://api.spotify.com/v1/search?q=${query}&type=track`,
                type: "GET",
                beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken.access_token); }//could add in validation -- if listing has album, artist, song, year, etc
            }).then(function (answer) {
                if (answer.tracks.items.length != 0) {
                    return answer.tracks.items[0].id; //only taking top search result
                }
            });
        }));

        return songsIdList.filter(function(el){ return el !== undefined})

        // const promises = songsList.songs.map(el => searchSong(encodeURIComponent(el.title), encodeURIComponent(el.artist)))
        // await Promise.all(promises)

        // for (i = 0; i < songsList.length; i++) {
        //     const track = encodeURIComponent(songsList[i].title);
        //     const artist = encodeURIComponent(songsList[i].artist);
        //     songsIdList.push(searchSong(track, artist))
        // };
        // return promises
    };

/*     function searchSong(track, artist) {
        $.ajax({
            url: `https://api.spotify.com/v1/search?q=${track}+${artist}&type=track`,
            type: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken.access_token); }//could add in validation -- if listing has album, artist, song, year, etc
        }).then(function (answer) {
            if (answer.tracks.items.length != 0) {
                return answer.tracks.items[0].id; //only taking top search result
            };
        });
    }; */

    function createPlaylistAddJSON(songsIdList) {
        console.log(songsIdList)
        // let songsIdListJSON = [];
        // let songsIdListJSONObj = {};

        // songsIdList.forEach(function (element) {
        //     return songsIdListJSON.push("spotify:track:" + element);
        // });
        // songsIdListJSONObj = JSON.stringify({ "uris": songsIdListJSON });

        // return new Promise(function (resolve, reject) {
        //     resole(songsIdListJSONObj);
        // });

        const formattedSongsList = {
            uris: []
        }
        songsIdList.forEach(function (element) {
            formattedSongsList.uris.push("spotify:track:" + element);
        });
        return JSON.stringify(formattedSongsList);
    };

    function addTracks(formattedSongsList) {
        console.log(formattedSongsList);
        return $.ajax({
            url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
            type: "POST",
            data: formattedSongsList,
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken.access_token); }
        });
    };
});
