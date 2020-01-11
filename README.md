# Billboard Playlist Generator on Spotify

## Description 

This is a client-side only web applicattion that generates a playlist of the Billboard Hot 100 songs for a given date on a user's Spotify account. The application uses several AJAX requests in order to link the two APIs together. 

## Table of Contents

* [Installation](#installation)
* [Built With](#built-with)

## Organization of the Application

The app has a signup/login area where users can create accounts. BCryptJS hashes and salts the passwords for secure password storage on the MySQL database. A local Passport strategy creates an express session which authenticates and stores the user's account information. The application takes in a search term from the user and searches the Gamestop website and Xbox One Marketplace, and then scrapes those sites using cheerio and displays the results to the user with React. The user can also view previous search results they have saved. 

## Installation

This application can run on any web browser. 

## Usage 

Give the application authorization to post a playlist to your Spotify account with the "Connect with Spotify" button. Input the date you want to create a playlist for in the "Select a Date:" area, and click submit. A playlist of the most popular songs on that date will now be in your Spofity account. 

## Built With

* [Spotify API](https://developer.spotify.com/discover/) - Spotify API
* [billboard-top-100](https://www.npmjs.com/package/billboard-top-100) - Node.js API to retrieve top songs, albums, and artists from Billboard's charts
* [Bulma](https://bulma.io/) - CSS framework based on Flexbox

## Credits

* **Charles Cotton** - *UI* - [Charles Cotton](https://github.com/charlie-cyber)
* **Adam Day** - *Frontend logic* - [Adam Day](https://github.com/dayadam)
* **Robert Pierce** - *UI* - [Robert Pierce](https://github.com/pierceforfears)
* **Triston Tetley** - *Frontend logic* - [Triston Tetley](https://github.com/tristontetley)

## Acknowledgments

* Thanks to all the open source contributors that helped with the building blocks of this project. 
