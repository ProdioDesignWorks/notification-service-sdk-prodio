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
 const notificationModule = new notifications("API BASE PATH OF NOTIFICATION SERVICE"); //http://domainname:3020/api
 ``` 

# Usage


Sdk module provides a easy and fast way to build notifications in the product.Examples like New Member added to a team, Someone messaged you, one of your friends liked your post, etc are events. Keeping event-driven architecture in mind this service works or reacts to events, which integration with others services easier. You can trigger emails, or send notifications in response to an event.


This application will run as a separate micro-service independent of your product services which makes it easier to implement, debug and test.


### Method

`1. Create Subscriber:`
 This will Register the Subscriber as a part of the service.


### Payload

| Key | Type | Value | Description | Required |
| --- | ---- | ----- | ----------- | -------- |
| `action` | string | `CREATESUBSCRIBER` | key which defines the type of action to be performed | YES |
| `meta` | json | { "subscriberId": "", "email": "", "phone":"", "webToken":"", "androidToken": "", "iosToken":"", metaData: {} } | Json having subscriber details. | YES |


#### Example

```JSX

	const metaInfo = {
		"subscriberId": "", //subscriber unique id(mandatory)
		"email": "", //subscriber email(mandatory)
		"phone": "", //(mandatory for SMS)
		"webToken": "", //(mandatory for web notifications using FCM)
		"androidToken": "", //(mandatory for push notifications using FCM)
		"iosToken": "", //(mandatory for push notifications using FCM)
		"metaData": {} //JSON object - can be any user related information
	};
	const  payload = {
		"action": "CREATESUBSCRIBER",
		"meta": metaInfo
	};
	let subscriber = notificationModule.execute(payload);

```

`2. Read Subscribers:`
This will list all the notification service subscribers with their channel tokens.

### Payload

| Key | Type | Value | Description | Required |
| --- | ---- | ----- | ----------- | -------- |
| `action` | string | `READSUBSCRIBER` | key which defines the type of action to be performed | YES |

#### Example

```JSX
	const  payload = {
		"action": "READSUBSCRIBER"
	};
	let subscriber = notificationModule.execute(payload);
```

`3. Update Subscribers:`
This will update a notification service subscribers with their channel tokens.

### Payload

| Key | Type | Value | Description | Required |
| --- | ---- | ----- | ----------- | -------- |
| `action` | string | `UPDATESUBSCRIBER` | key which defines the type of action to be performed | YES |
| `meta` | json | { "subscriberId": "", "email": "", "phone":"", "webToken":"", "androidToken": "", "iosToken":"", metaData: {} } | Json having subscriber details. | YES |

#### Example

```JSX

	const metaInfo = {
		"subscriberId": "", //subscriber unique id(mandatory)
		"email": "", //subscriber email(mandatory)
		"phone": "", //(mandatory for SMS)
		"webToken": "", //(mandatory for web notifications using FCM)
		"androidToken": "", //(mandatory for push notifications using FCM)
		"iosToken": "", //(mandatory for push notifications using FCM)
		"metaData": {} //JSON object - can be any user related information
	};
	const  payload = {
		"action": "UPDATESUBSCRIBER",
		"meta": metaInfo
	};
	let subscriber = notificationModule.execute(payload);
```

`4. Delete Subscriber:`
This will delete a notification service subscriber with their channel tokens.

### Payload

| Key | Type | Value | Description | Required |
| --- | ---- | ----- | ----------- | -------- |
| `action` | string | `DELETESUBSCRIBER` | key which defines the type of action to be performed | YES |
| `meta` | json | { "subscriberId": ""} | Json having subscriber id. | YES |

#### Example

```JSX

	const metaInfo = {
		"subscriberId": "", //subscriber unique id(mandatory)
	};
	const  payload = {
		"action": "DELETESUBSCRIBER",
		"meta": metaInfo
	};
	let subscriber = notificationModule.execute(payload);
```


`5. Create Event:`
 This will create and event for which the notification has to be sent.

### Payload

| Key | Type | Value | Description | Required |
| --- | ---- | ----- | ----------- | -------- |
| `action` | string | `CREATEEVENT` | key which defines the type of action to be performed | YES |
| `meta` | json | { "name": "", "channels": ["SMS","EMAIL"] } | Json having event details. | YES |


##### List of Valid Channels
		1. SMS
		2. EMAIL
		3. WEB
		4. MOBILE

#### Example

```JSX

	const metaInfo = {
		"name": "WELCOME",
		"channels": ["EMAIL", "SMS"]
	};
	const  payload = {
		"action": "CREATEEVENT",
		"meta": metaInfo
	};
	let Event = notificationModule.execute(payload);
```

`6. Read Events:`
 This will list all events for which the notification has to be sent.

### Payload

| Key | Type | Value | Description | Required |
| --- | ---- | ----- | ----------- | -------- |
| `action` | string | `READEVENT` | key which defines the type of action to be performed | YES |


#### Example

```JSX
	const  payload = {
		"action": "READEVENT",
	};
	let Event = notificationModule.execute(payload);
```

`7. Update Event:`
 This will update an event for which the notification has to be sent.


### Payload

| Key | Type | Value | Description | Required |
| --- | ---- | ----- | ----------- | -------- |
| `action` | string | `UPDATEEVENT` | key which defines the type of action to be performed | YES |
| `meta` | json | { "name": "", "channels": ["SMS","EMAIL"] } | Json having event details. | YES |


##### List of Valid Channels
		1. SMS
		2. EMAIL
		3. WEB
		4. MOBILE

#### Example

```JSX

	const metaInfo = {
		"name": "WELCOME",
		"channels": ["EMAIL", "SMS"],

	};
	const  payload = {
		"action": "UPDATEEVENT",
		"meta": metaInfo
	};
	let Event = notificationModule.execute(payload);
```

`8. Delete Event:`
 This will delete an event for which the notification has to be sent.

### Payload

| Key | Type | Value | Description | Required |
| --- | ---- | ----- | ----------- | -------- |
| `action` | string | `DELETEEVENT` | key which defines the type of action to be performed | YES |
| `meta` | json | { "name": ""} | Json having event name. | YES |

#### Example

```JSX

	const metaInfo = {
		"name": "", //registered event name
	};
	const  payload = {
		"action": "DELETEEVENT",
		"meta": metaInfo
	};
	let Event = notificationModule.execute(payload);
```

`9. Create Message:`
This will create a message which will be sent as a notification for a registered event.

### Payload

| Key | Type | Value | Description | Required |
| --- | ---- | ----- | ----------- | -------- |
| `action` | string | `CREATEMESSAGE` | key which defines the type of action to be performed | YES |
| `meta` | json | Refer the objet keys below | Json having message data. | YES |

#### Example


##### Message object keys
		1. name - string - mandatory
		2. type - string - any one from the list of channel
		3. title - string - notification title or email subject
		4. body - main content, dynamic datapoints to be replaced should be written as {{SUBSCRIBERNAME}} i.e. {{SUBSCRIBERNAME}} will be replaced by actual name while sending notification.
		5. eventName - name of the event for which the message has to be sent
		6. replyToEmail - for email notifications
		7. clickAction - for push notifications(default is blank)
		8. tag - for push notifications(default is blank)
		9. color - for push notifications(default is black)
		10. icon - for push notifications(mandatory)
		11. sound - for push notifications(default is default)
		12. show_in_foreground - for push notifications(default is true)
		13. priority - for push notifications(default is high)
		14. content_available - for push notifications(default is blank)

```JSX

	const metaInfo = {
		"name" : "WELCOME_WEBMESSAGE",
		"type" : "WEB",
		"title" : "title",
		"body" : "body",
		"eventName" : "",
		"clickAction" : "",
		"tag" : "",
		"color" : "#000000",
		"icon" : "ic_launcher",
		"sound" : "default",
		"show_in_foreground" : "true",
		"priority" : "high",
		"content_available" : "true",
	};
	const  payload = {
		"action": "CREATEMESSAGE",
		"meta": metaInfo
	};
	let Message = notificationModule.execute(payload);
```

`10. Read Messages:`
 This will list all messages for which the notification services.

### Payload

| Key | Type | Value | Description | Required |
| --- | ---- | ----- | ----------- | -------- |
| `action` | string | `READMESSAGE` | key which defines the type of action to be performed | YES |


#### Example

```JSX
	const  payload = {
		"action": "READMESSAGE",
	};
	let Message = notificationModule.execute(payload);
```

`11. Update Message:`
This will update a message which will be sent as a notification for a registered event.

### Payload

| Key | Type | Value | Description | Required |
| --- | ---- | ----- | ----------- | -------- |
| `action` | string | `UPDATEMESSAGE` | key which defines the type of action to be performed | YES |
| `meta` | json | Refer the objet keys below | Json having message data. | YES |

#### Example


##### Message object keys
		1. name - string - mandatory
		2. type - string - any one from the list of channel
		3. title - string - notification title or email subject
		4. body - main content, dynamic datapoints to be replaced should be written as {{SUBSCRIBERNAME}} i.e. {{SUBSCRIBERNAME}} will be replaced by actual name while sending notification.
		5. eventName - name of the event for which the message has to be sent
		6. replyToEmail - for email notifications
		7. clickAction - for push notifications(default is blank)
		8. tag - for push notifications(default is blank)
		9. color - for push notifications(default is black)
		10. icon - for push notifications(mandatory)
		11. sound - for push notifications(default is default)
		12. show_in_foreground - for push notifications(default is true)
		13. priority - for push notifications(default is high)
		14. content_available - for push notifications(default is blank)

```JSX

	const metaInfo = {
		"name" : "WELCOME_WEBMESSAGE",
		"type" : "WEB",
		"title" : "title",
		"body" : "body",
		"eventName" : "",
		"clickAction" : "",
		"tag" : "",
		"color" : "#000000",
		"icon" : "ic_launcher",
		"sound" : "default",
		"show_in_foreground" : "true",
		"priority" : "high",
		"content_available" : "true",
	};
	const  payload = {
		"action": "UPDATEMESSAGE",
		"meta": metaInfo
	};
	let Message = notificationModule.execute(payload);
```

`12. Delete Message:`
 This will delete a message for which the notification services.

### Payload

| Key | Type | Value | Description | Required |
| --- | ---- | ----- | ----------- | -------- |
| `action` | string | `DELETEMESSAGE` | key which defines the type of action to be performed | YES |
| `meta` | json | Refer the objet keys below | Json having message name. | YES |


#### Example

```JSX
	const metaInfo = {
		"name": "WELCOME_WEBMESSAGE"
	}
	const  payload = {
		"action": "DELETEMESSAGE",
		"meta": metaInfo
	};
	let Message = notificationModule.execute(payload);
```

`13. Link Message with Event:`
 This will link/map the given event and message for which the notifications will be sent.

### Payload

| Key | Type | Value | Description | Required |
| --- | ---- | ----- | ----------- | -------- |
| `action` | string | `LINKEVENTMESSAGE` | key which defines the type of action to be performed | YES |
| `meta` | json | Refer the objet keys below | Json having message and event name. | YES |


#### Example

```JSX
	const metaInfo = {
		"messageName": "WELCOME_WEBMESSAGE",
		"eventName": "WELCOME"
	}
	const  payload = {
		"action": "LINKEVENTMESSAGE",
		"meta": metaInfo
	};
	let Message = notificationModule.execute(payload);
```

`14. Send Email:`
This will send email notification to the subscribers.

### Payload

| Key | Type | Value | Description | Required |
| --- | ---- | ----- | ----------- | -------- |
| `action` | string | `SENDEMAIL` | key which defines the type of action to be performed | YES |
| `meta` | json | Refer the objet keys below | Json having event, message and subscriber details. | YES |


#### Example

```JSX
	const metaInfo = {
		"subscriberId": "",
		"eventName": "CREATE_PAYER_MAIL",
		"props": { // Dynmic data which will be replaced {{}}
			"PAYERNAME": "",
			"MERCHANTNAME": "",
			"EMAIL": "",
			"MOBILE": "",
			"PASSWORD": "",
		}
	}
	const sendEmailPayload = {
		"action": "SENDEMAIL",
		"meta": metaInfo
	};
	let Message = notificationModule.execute(payload);
```


`15. Send App Notification:`
This will send app push notification to both android and ios to the subscribers.

### Payload

| Key | Type | Value | Description | Required |
| --- | ---- | ----- | ----------- | -------- |
| `action` | string | `SENDPUSHNOTIFICATION` | key which defines the type of action to be performed | YES |
| `meta` | json | Refer the objet keys below | Json having event, message and subscriber details. | YES |


#### Example

```JSX
	const metaInfo = {
		"subscriberId": "",
		"eventName": "CREATE_PAYER_MAIL",
		"props": { // Dynmic data which will be replaced {{}}
			"PAYERNAME": "",
			"MERCHANTNAME": "",
			"EMAIL": "",
			"MOBILE": "",
			"PASSWORD": "",
		}
	}
	const sendEmailPayload = {
		"action": "SENDPUSHNOTIFICATION",
		"meta": metaInfo
	};
	let Message = notificationModule.execute(payload);
```

`16. Send Web Notification:`
This will send web push notification to both android and ios to the subscribers.

### Payload

| Key | Type | Value | Description | Required |
| --- | ---- | ----- | ----------- | -------- |
| `action` | string | `SENDWEBPUSHNOTIFICATION` | key which defines the type of action to be performed | YES |
| `meta` | json | Refer the objet keys below | Json having event, message and subscriber details. | YES |


#### Example

```JSX
	const metaInfo = {
		"subscriberId": "",
		"eventName": "CREATE_PAYER_MAIL",
		"props": { // Dynmic data which will be replaced {{}}
			"PAYERNAME": "",
			"MERCHANTNAME": "",
			"EMAIL": "",
			"MOBILE": "",
			"PASSWORD": "",
		}
	}
	const sendEmailPayload = {
		"action": "SENDWEBPUSHNOTIFICATION",
		"meta": metaInfo
	};
	let Message = notificationModule.execute(payload);
```

`17. Batch creation of Subscribers:`
This will send web push notification to both android and ios to the subscribers.

### Payload

| Key | Type | Value | Description | Required |
| --- | ---- | ----- | ----------- | -------- |
| `action` | string | `SUBSCRIBERBULKUPLOAD` | key which defines the type of action to be performed | YES |
| `meta` | json | Refer the objet keys below | Json having event, message and subscriber details. | YES |


#### Example

```JSX
	const metaInfo = {
		"link": "", // link to the excel file, refer bulk upload template
	}
	const sendEmailPayload = {
		"action": "SUBSCRIBERBULKUPLOAD",
		"meta": metaInfo
	};
	let Subscribers = notificationModule.execute(payload);
```

`18. Create Group of Subscribers:`

`19. Send Email to group:`

