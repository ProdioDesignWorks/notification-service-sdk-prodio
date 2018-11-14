
  

  

  

# notifications-module-prodio

  

  

  

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

  

  

  

`notifications-module-prodio` is an  node js client for the  `notification-service-prodio API`. Integrate in to any application to send emails, sms, and push app notifications to both mobile phones and web browsers.

  

  

  

# Philosophy

  

  

This project is started with an aim to reduce implementing and re-architecting common product features/requirements like notification service & thus increasing productivity and more focus on business goals. Goal of this service is to bundle and provide common features related to notification services like sending emails, sms, notifications to users, notification logs and history, events and templates creation for easier integration with web and mobile Apps.

  

  

  

# Features!
  
* Register subscribers and store all tokens
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
`notification-service-prodio` uses loopback as the core framework for developing API's, so all customisations, configurations, middlewares, events, and db connectors can be used which you would have used in loopback.

# Installation

$ npm install notifications-module-prodio --save

  
# Initialization 
Require the notifications-module-prodio module and initialize the notificationSdk client.
```JSX

 const notifications = require('notifications-module-prodio');
 const notificationModule = new notifications();
 ``` 

# Usage

  

  

Sdk module provides a easy and fast way to build notifications in the product.Examples like New Member added to a team, Someone messaged you, one of your friends liked your post, etc are events. Keeping event-driven architecture in mind this service works or reacts to events, which integration with others services easier. You can trigger emails, or send notifications in response to an event.

  

This application will run as a separate micro-service independent of your product services which makes it easier to implement, debug and test.


### Method

`create subscriber:`
 method will Register the Subscriber of the service.


### Payload

| Key | Type | Value | Description | Required |
| --- | ---- | ----- | ----------- | -------- |
| `action` | string | `CREATESUBSCRIBER` | key which defines the type of action to be performed | YES |
| `meta` | json | ``` { "name": "subscriber name", "email": "subscriber email", "id": "subscriber unique id" }`` | Json having subscriber details. | YES |


#### Example

```JSX

	const notifications = require('notifications-module-prodio');
	const notificationModule = new notifications();
	const metaInfo = {
		"name": "",
		"email": "",
		"id": ""
	};
	const  payload = {
		"action": "CREATESUBSCRIBER",
		"meta": metaInfo
	};
	//create subscriber in notification module
	let createSubscriber = notificationModule.execute(payload);

```




