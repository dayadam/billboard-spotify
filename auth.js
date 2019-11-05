//http://accounts.spotify.com/authorize?client_id=603ba6b52bf24da0a23b5db603d64c25&redirect_uri=http://127.0.0.1:5500/&scope=playlist-modify-public,playlist-modify-private,user-read-private,user-read-email&response_type=token

$(document).ready(function () {




  function accessTokenCheckAndStore() {
    const hashVar = window.location.hash;
    if (hashVar) {
      return (accessToken = hashVar
        .slice(1) //cutting up query parameters of hash response key and putting them in an object
        .split("&")
        .reduce(function (initial, item) {
          if (item) {
            let parts = item.split("=");
            initial[parts[0]] = decodeURIComponent(parts[1]);
          }
          return initial;
        }, {}));
      //window.location.hash = '';
    }
  }
  accessTokenCheckAndStore();
  let currentUserId;
  function getUserId() {
    return $.ajax({
      //make sure you return the promise to the getUserId function in order to handle it, otherwise getUserId does not resvole to a function, it resolves to undefined
      url: "https://api.spotify.com/v1/me",
      type: "GET",
      beforeSend: function (xhr) {
        xhr.setRequestHeader(
          "Authorization",
          "Bearer " + accessToken.access_token
        );
      }, // in the accessToken object which is from cutting up the has response, access_token is the access token.
      success: function (data) {
        currentUserId = data.id;
      }
    });
  }
  getUserId();
  //.then(postPlaylist);
  let playlistId;
  let jsonPlaylistPost = JSON.stringify({
    name: "playlistName"
  });
  function postPlaylist() {
    return $.ajax({
      url: `https://api.spotify.com/v1/users/${currentUserId}/playlists`,
      type: "POST",
      data: jsonPlaylistPost,
      dataType: "json",
      contentType: "application/json",
      beforeSend: function (xhr) {
        xhr.setRequestHeader(
          "Authorization",
          "Bearer " + accessToken.access_token
        );
      }, // in the accessToken object which is from cutting up the has response, access_token is the access token.
      success: function (response) {
        playlistId = response.id;
      }
    });
  }

  // Submit click --> hide index/show results




  let songsList;
  function billboardSearch() {
    return $.ajax({
      url:
        "https://billboardapi.jacoblamont.now.sh/api/songs?chartName=r-b-hip-hop-songs&date=2018-01-01",
      type: "GET",
      success: function (response) {
        console.log(response)
        songsList = response.songs;
      }
    });
  }
  billboardSearch().then(createSongIdList);
  let track;
  let artist;
  let songsIdList = [];
  function createSongIdList() {
    for (i = 0; i < songsList.length; i++) {
      track = encodeURIComponent(songsList[i].title);
      artist = encodeURIComponent(songsList[i].artist);
      searchSong().then(function (answer) {
        if (answer.tracks.items.length != 0) {
          songsIdList.push(answer.tracks.items[0].id); //only taking top search result
        }
      });
    }
  }
  function searchSong() {
    return $.ajax({
      url: `https://api.spotify.com/v1/search?q=${track}+${artist}&type=track`,
      type: "GET",
      beforeSend: function (xhr) {
        xhr.setRequestHeader(
          "Authorization",
          "Bearer " + accessToken.access_token
        );
      } //could add in validation -- if listing has album, artist, song, year, etc
    });
  }

  let songsIdListJSON = [];
  let songsIdListJSONObj = {};
  function createPlaylistAddJSON() {
    songsIdList.forEach(function (element) {
      return songsIdListJSON.push("spotify:track:" + element);
    });
    songsIdListJSONObj = JSON.stringify({ uris: songsIdListJSON });
    return new Promise(function (resolve, reject) {
      resolve(songsIdListJSONObj);
    });
  }
  function addTracks() {
    return $.ajax({
      url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      type: "POST",
      data: songsIdListJSONObj,
      dataType: "json",
      contentType: "application/json",
      beforeSend: function (xhr) {
        xhr.setRequestHeader(
          "Authorization",
          "Bearer " + accessToken.access_token
        );
      }
    });
  }
  // setTimeout(function () {
  //   createPlaylistAddJSON().then(addTracks);
  // }, 5000);

  $('#submit').on('click', function () {
    event.preventDefault();

    $('.index').css({ 'display': 'none' });
    $('#results').css({ 'visibility': 'visible' });
    console.log(songsList);

    $(".cover").attr("src", songsList[0].cover);

    $(".dateChanged").text(userDate);




    // console.log("switched")
    for (i = 0; i < 100; i++) {
      $("#resultsTable").append('<tr><td class="song">' + songsList[i].title + '</td>' + '<td class="song">' + songsList[i].artist + '</td></tr>');

    };
    for (i = 0; i < 100; i++) {
      console.log("hi");
      //$("#resultsTable").append("<tr><td> hi </td></tr>");
    };
  });
});
