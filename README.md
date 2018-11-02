
  

  

# prodio-notification-sdk

  

  

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

  

  

`prodio-notification-sdk` is a service to send emails, sms, and push app notifications to both mobile phones and web browsers. This service is easy to integrate with your existing product or infrastructure as it comes with its on environment and dependencies.

  

  

# Philosophy

  

This project is started with an aim to reduce implementing and re-architecting common product features/requirements like notification service & thus increasing productivity and more focus on business goals. Goal of this service is to bundle and provide common features related to notification services like sending emails, sms, notifications to users, notification logs and history, events and templates creation for easier integration with web and mobile Apps.

  

  

# Features!

  

1. Create User

  
  

# Installation

  

$ npm install prodio-notification-sdk --save

  

# Usage

  

Sdk module provides a easy and fast way to build notifications in the product.Examples like New Member added to a team, Someone messaged you, one of your friends liked your post, etc are events. Keeping event-driven architecture in mind this service works or reacts to events, which integration with others services easier. You can trigger emails, or send notifications in response to an event.

  
This application will run as a separate micro-service independent of your product services which makes it easier to implement, debug and test.

  

#### Example

  

```JSX
var  notificationModule = require('prodio-notification-sdk');

//create user in notification module
	const  payload = {
		"userId":"user_id",
		"user_name":"user_name",
		"email":"user_email"
	};
	let  createUser = notificationModule.createUser(payload);

```
  
  ### Payload 


|          Prop        |                                Type                                	      |                 Description|                                                                                                                                                                                                                                                                                                                          
|:--------------------:|:----------------------------------------------------------------------------:|:--------------------------------:|
| `userId`           | string |unique Identity Id of the user created|                                                                                                                                                                                                                                                              |
| `Email`     | string | Email address of the user created.                                                                                                                                                                                                                                                   |
| `Name`  | string| Name of the user created                                                                                                                                                                                                                                    |
|
###  Method 
   ### create User: 
   method will create the user in the product which will we able to receive notifications , receive emails and messages.
