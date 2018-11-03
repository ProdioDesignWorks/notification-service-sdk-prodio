
  

  

  

# prodio-notification-service-sdk

  

  

  

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

  

  

  

`prodio-notification-service-sdk` is an  node js client for the  `prodio-notification-service API`. Integrate in to any application to send emails, sms, and push app notifications to both mobile phones and web browsers.

  

  

  

# Philosophy

  

  

This project is started with an aim to reduce implementing and re-architecting common product features/requirements like notification service & thus increasing productivity and more focus on business goals. Goal of this service is to bundle and provide common features related to notification services like sending emails, sms, notifications to users, notification logs and history, events and templates creation for easier integration with web and mobile Apps.

  

  

  

# Features!
  
* Register users and store all user tokens
* Send emails ( sendInBlue )
* Template types ( email, sms and app notification )
* Link templates with events
* Send Push notifications by triggering events

# Prerequisite:
 * Clone this repository on your server git clone https://github.com/ProdioDesignWorks/prodio-notification-service.git
 * Navigate to your repo cd prodio-notification-service
 * Install dependencies npm install
 * Start service node . or npm start or node server/server.js
 * Open http://localhost:3000/explorer/ in your browser
 * If you've pm2 installed then use this pm2 start server/server.js --name="NOTIFICATION_SERVICE"

# Note:
`prodio-notification-service` uses loopback as the core framework for developing API's, so all customisations, configurations, middlewares, events, and db connectors can be used which you would have used in loopback.

# Installation

$ npm install prodio-notification-service-sdk --save

  
# Initialization 
Require the prodio-notification-service-sdk module and initialize the notificationSdk client, passing your base_url  as the first argument.
```JSX

 var  notificationSdk = require('notification-service-sdk-prodio');
 var notificationModule = new notificationSdk('YOUR_BASE_URL');
 ``` 

# Usage

  

  

Sdk module provides a easy and fast way to build notifications in the product.Examples like New Member added to a team, Someone messaged you, one of your friends liked your post, etc are events. Keeping event-driven architecture in mind this service works or reacts to events, which integration with others services easier. You can trigger emails, or send notifications in response to an event.

  

This application will run as a separate micro-service independent of your product services which makes it easier to implement, debug and test.


### Method

`createUser:`
 method will Register the User in database for the BASE_URL initialized with and with provided user_id and payload of meta_info i.e basic details of the user will register the user in Database.


### Payload

| Prop | Type | Description|
:--------------------:|:----------------------------------------------------------------------------:|:-----------|
| `user_id` | string |unique Identity Id of the user created| |
| `email_address` | string | Email address of the user created. |
| `user_name` | string| Name of the user created |
| `Event_Name` | string | Event name for creating events for triggering notifications related to events.|

#### Example

  

  

```JSX

	var  notificationSdk = require('notification-service-sdk-prodio');
	var notificationModule = new notificationSdk('YOUR_BASE_URL');
		//create user in notification module
		const meta_info = {
		     "user_name":"NAME",
		      "email":"EMAIL_ADDRESS",
		    }
		const  payload = {
		"user_id":"USER_ID",
		"meta_info":meta_info,
		"EVENT_NAME":"CREATE_USER"
		};

		let  createUser = notificationModule.createUser(payload);

  

```




