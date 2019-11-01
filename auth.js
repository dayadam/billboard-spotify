//basic layout for ajax with spotify's examples
//need to change redirect_URI after launch website
URL = "https://accounts.spotify.com/authorize?client_id=603ba6b52bf24da0a23b5db603d64c25&redirect_uri=https://www.spotify.com/us/&response_type=token&scope=user-read-private%20user-read-email"

$.ajax({
    url: 'https://api.spotify.com/v1/me',
    GET: URL
    headers: {
        'Authorization': 'Bearer ' + accessToken
    },
    success: function(response) {
        ...
    }
   