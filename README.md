# wikiMaps

## About

An application for users to create, share, and edit lists of locations, using Javascript, Express, and the Google Maps API.

## Setup

The database and application are being hosted on Heroku - the website is accessible at https://shrouded-shelf-81582.herokuapp.com/.

You can register as a new user or use a sample user with some data, george@test.com (password: password).

## Features

### Dynamic Mapping
- Users can start creating lists (or edit an existing one) and instantly add, edit, and delete points with Ajax-generated list table connected to the map and database updates.

### User Dashboards
- Personal user pages featuring profile information, lists created and contributed to, bookmarked lists, and public activity feed, with labelled and scrollable divs.

### Activity Feeds
- A social network-style timeline featuring all recent public activity, including new lists and contributions, combined and sorted by most recent activity, with links to lists.

### 3 Privacy Settings
- Users can choose whether their lists can be edited by other users, viewed (only) by the public, or viewable only to themselves.

### Google Maps customization
- When viewing lists, Google Maps markers drop into place and are labelled by letter along with their associated table row.  Google Search Box also allows easy addition of points with autocomplete of places and addresses.

### Easy forms and buttons
- Users have clear and simple buttons and icons to bookmark, create, edit, and delete lists, as well as Bootstrap pop-up forms for logging in, registering, and starting new lists.

## Dependencies

- Node 5.10.x or above
- NPM 3.8.x or above
