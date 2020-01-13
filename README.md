# Billboard Playlist Generator on Spotify

## Description 

This is a client-side only web application that generates a playlist of the Billboard Hot 100 songs for a given date on a user's Spotify account. The application uses several AJAX requests in order to link the two APIs together. 

## Organization of the Application

The application uses Bulma for the user interface. JQuery helps with AJAX requests and DOM manipulation. A custom made server handles the Billboard API requests. When the user submits a date, the application makes a request to the Billboard API to get the popular songs on that date. The application then gets Spotify's identification of those songs, and creates a playlist with those songs. Concurrency flows heavily through the application and is generally handled with promises. 

## Installation

This application can run on any web browser. 

## Usage 

Give the application authorization to post a playlist to your Spotify account with the "Connect with Spotify" button. Input the date you want to create a playlist for in the "Select a Date:" area, and click submit. A playlist of the most popular songs on that date will now be in your Spofity account. 

## Built With

* [Spotify API](https://developer.spotify.com/discover/) - Spotify API
* [billboard-top-100](https://www.npmjs.com/package/billboard-top-100) - Node.js API to retrieve top songs, albums, and artists from Billboard's charts
* [Bulma](https://bulma.io/) - CSS framework based on Flexbox
* [jQuery](https://jquery.com/) - Fast, small, and feature-rich JavaScript library

## Credits

* **Charles Cotton** - *UI* - [Charles Cotton](https://github.com/charlie-cyber)
* **Adam Day** - *Frontend logic* - [Adam Day](https://github.com/dayadam)
* **Robert Pierce** - *UI* - [Robert Pierce](https://github.com/pierceforfears)
* **Triston Tetley** - *Frontend logic* - [Triston Tetley](https://github.com/tristontetley)

## Acknowledgments

* Thanks to all the open source contributors that helped with the building blocks of this project. Thanks to Jacob Lamont for helping create a server for the Billboard API. 
