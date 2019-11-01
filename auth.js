//basic layout for ajax with spotify's examples
//need to change redirect_URI after launch website

https://accounts.spotify.com/authorize?client_id=603ba6b52bf24da0a23b5db603d64c25&redirect_uri=http://localhost:3000/&scope=playlist-modify-public,playlist-modify-private,user-read-private,user-read-email&response_type=token

$(document).ready(function () {
    //console.log(window.location.hash);
    function accessTokenCheckAndStore() {
        const hashToken = window.location.hash;
        if (hashToken) {
            accessToken = hashToken.slice(1);
            console.log(accessToken);
        };
    };

    accessTokenCheckAndStore();

     $.ajax({
        url: 'https://api.spotify.com/v1/me',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        success: function (response) {
            console.log(response);
        }

    });

});