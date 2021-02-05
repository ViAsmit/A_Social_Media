[![Visits Badge](https://badges.pufler.dev/visits/ViAsmit/A_Social_Media)](https://badges.pufler.dev) [![Created Badge](https://badges.pufler.dev/created/ViAsmit/A_Social_Media)](https://badges.pufler.dev) [![Updated Badge](https://badges.pufler.dev/updated/ViAsmit/A_Social_Media)](https://badges.pufler.dev)

# [A Social Media](https://xunbao.elementsculmyca.com/)
[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/uses-html.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/uses-css.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/uses-js.svg)](https://forthebadge.com)


## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
  * [Usage](#usage)
* [Frontend](#frontend)
    * [Angular](#angular)
* [Backend](#backend)
    * [Express](#express)
    * [MongoDB](#mongodb)
* [Screenshots](#screenshots)
* [Authors](#authors)
* [Contributing](#contributing)
* [License](#license)

## About the Project
[A_Social_Media](http://whispering-hollows-06439.herokuapp.com/) is a fully-functional Social Media Plarform, integrated with :

1. MongoDB - for storing data in Back-End.
2. Express, for Back-End prgramming
3. Angular, for Single-Page Fnrontend Application. 

### Built With
*   Node.js
*   Express
*   Angular
*   MongoDB

[Back to Table of Contents](#table-of-contents)

## Getting Started
### Prerequisites
* Node.js
* Angular
* MongoDB
* Express


### Installation



* Backend

  * Node.js
  
    ```
    $ sudo apt install nodejs
    $ sudo apt install npm
    $ npm install -g express
    ```
    
  * Angular
    
    ```
    $ npm install -g @angular/cli
    ```
  
  
  * MongoDB

    ```
    $ npm install mongod
    $ sudo systemctl start mongod
    ```
  

### Usage

* To Run Server
    
    ``` 
    $ npn start
    ```
    
    
* To Run Angular Page

    ``` 
    $ cd angular
    $ ng serve
    ```
    
[Back to Table of Contents](#table-of-contents)

## Frontend

* #### Angular
    Angular is an application design framework and development platform for creating efficient and sophisticated single-page apps.
    It uses modern web platform capabilities to deliver app-like experiences. High performance, offline, and zero-step installation.
    
    * ###### Why Angular ?
      * Cross Platform - Progressive Web Apps, Native and Desktop
      * Easy Code Generation & Code Splitting
      * Ridiculously fast
      * Simple and powerful template syntax.
    

## Backend

* #### Express
    Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
    
    * ###### Why Express ?
        *  Ridiculously fast
        *  creating a robust API is quick and easy.
        *  provides a thin layer of fundamental web application features
        *  Incredibly versatile
        *  Easy to Integrate with Node frameworks
        
* #### MongoDB
    MongoDB is a source-available cross-platform document-oriented database program. Classified as a NoSQL database program, MongoDB uses JSON-like documents with     optional schemas. MongoDB is developed by MongoDB Inc. and licensed under the Server Side Public License (SSPL).
    
    * ###### Why MongoDB ?
      * Multi-cloud database service available on AWS, Google Cloud, and Azure.
      * Rich JSON Documents
      * Powerful query language

## Features

* #### Customer Module
    *  Registration and login for Customer
    *  Customer can Modify his/her profile
    *  Customer can select One Way/Round Trip and Multi City Trip
    *  Customer can have a access of own activity dashboard
    *  Customer can view own trip history
    *  Customer will receive notification for each activity related to him/her.
    *  Customer can pay fare online or offline mode as per the policy
    *  Customers can schedule immediate/later ride as per their convenience
    *  Customer can view the rating of any Driver/Cab
    *  Customer can give the rating for Cab and Driver related to him/her

* #### Vendor/Driver Module
    *  Registration and login for Vendor/Driver
    *  Vendor/Driver can Modify his/her profile
    *  Vendor/Driver can have a access of own activity dashboard
    *  Vendor/Driver can view own schedule ( upcoming rides).
    *  Vendor/Driver will receive notification for each activity related to him/her.
    *  Vendor/Driver can view their ride history (Past Completed Ride).
    *  Vendor/Driver can select the area as per their convenience.(From where they want expect ride)
    *  Vendor/Driver can view the rating of Customer
    *  Vendor/Driver can give the rating for Customer after completing the ride.

* #### Admin Module
  
    *  Enable and Disable Customer/Driver
    *  Admin can have a access for complete dashboard activities
    *  Admin can add/modify the Customer/Driver Details
    *  Admin will receive notification for each activity
    *  Admin can generate weekly/monthly report from activity dashboard
    *  Admin can view total revenue w.r.t. Customer or Driver
    *  Admin can modify fare structure
    *  Admin can modify pickup locations



[Back to Table of Contents](#table-of-contents)
## Screenshots

![alt text](Screenshots/Home.JPG)

![alt text](Screenshots/CustomerProfile.JPG)

![alt text](Screenshots/IncompleteBooking.JPG)

![alt text](Screenshots/UpcomingRides.JPG)

![alt text](Screenshots/VendorRegistration.JPG)

![alt text](Screenshots/VendorBookings.JPG)

![alt text](Screenshots/AdminMainPage.JPG)

![alt text](Screenshots/AdminRideCalculation.JPG)

![alt text](Screenshots/AdminVendors.JPG)
