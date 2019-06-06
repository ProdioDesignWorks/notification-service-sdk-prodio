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
		"safariToken":"",//(mandatory for safari push notifications using APN)
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
This will update an existing or create a new notification service subscribers with their channel tokens.

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
		"safariToken":"",//(mandatory for safari push notifications using APN)
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
		"meta": {
			"name" : "eventName"
		}
	};
	** Meta key is optional, if supplied only that event data(can be comma seperated strings) will be returned
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
		"meta": {
			"name": "message name"
		}
	};
	** Meta key is optional, if supplied only that event data(can be comma seperated strings) will be returned
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

`13. Create message using HTML template:`
 This will create/update a message with body using the html file link.

### Payload

| Key | Type | Value | Description | Required |
| --- | ---- | ----- | ----------- | -------- |
| `action` | string | `UPDATEMESSAGETEMPLATE` | key which defines the type of action to be performed | YES |
| `meta` | json | Refer the objet keys below | Json having message and event name. | YES |


#### Example

```JSX
	const metaInfo = {
		"name": "SEND_MAIL_MESSAGE",
		"type": "EMAIL",
		"title": "Request",
		"fileUrl":"https://domain.com/filename.html",
		"eventName": "SEND_MAIL"
	}
	const  payload = {
		"action": "UPDATEMESSAGETEMPLATE",
		"meta": metaInfo
	};
	let Message = notificationModule.execute(payload);
```

`14. Link Message with Event:`
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

`15. Send Campaign Email:`
This will send email notification to a group of subscribers.

### Payload

| Key | Type | Value | Description | Required |
| --- | ---- | ----- | ----------- | -------- |
| `action` | string | `SENDCAMPAIGNEMAIL` | key which defines the type of action to be performed | YES |
| `meta` | json | Refer the objet keys below | Json having event, message and subscriber details. | YES |


#### Example

##### List of Valid Attachment File Extensions

     "xlsx", "xls", "ods", "docx", "docm", "doc", "csv", "pdf", "txt", "gif", "jpg",
     "jpeg", "png", "tif", "tiff", "rtf", "bmp", "cgm", "css", "shtml", "html", "htm",
     "zip", "xml", "ppt", "pptx", "tar", "ez", "ics", "mobi", "msg", "pub", "eps" 

```JSX
	const metaInfo = {
		"subscribers": [], //array of strings
		"eventName": "CREATE_PAYER_MAIL",
		"senderName": "", //optional
		"senderEmail": "", //optional
		"attachmentLink": "", //optional
		"props": { // Dynmic data which will be replaced {{}}
			"PAYERNAME": "",
			"MERCHANTNAME": "",
			"EMAIL": "",
			"MOBILE": "",
			"PASSWORD": "",
		}
	}
	const sendEmailPayload = {
		"action": "SENDCAMPAIGNEMAIL",
		"meta": metaInfo
	};
	let Message = notificationModule.execute(payload);
```


`16. Send App Notification:`
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
		"clickAction": "", //optional
		"urlArgs": [ ], //urlFormatString arguments for safari notifiation redirection
		"props": { // Dynmic data which will be replaced {{}}
			"PAYERNAME": "",
			"MERCHANTNAME": "",
			"EMAIL": "",
			"MOBILE": "",
			"PASSWORD": "",
		},
		"data": {
			"key": "value"
		}
	}
	const sendEmailPayload = {
		"action": "SENDPUSHNOTIFICATION",
		"meta": metaInfo
	};
	let Message = notificationModule.execute(payload);

	Note: The value for "urlArgs" must be an array and should contain number of items you have defined in your    		  	urlFormatString while configuring the Safari PushPackage. For example - 
	Your Website Json is as follows :
	{
		"websiteName": "Bay Airlines",
		"websitePushID": "web.com.example.domain",
		"allowedDomains": ["http://domain.example.com"],
		"urlFormatString": "http://domain.example.com/%@/?flight=%@",
		"authenticationToken": "XXXXXXXXXXXXXXXX",
		"webServiceURL": "https://example.com/push"
	}
	Since you have defined two "%@" argument placeholders, the "urlArgs" should contain two items as 
        metaInfo = {
			..
		    "urlArgs": ["boarding", "A998"]
		    ..
		}

```

`17. Send Web Notification:`
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
		"clickAction": "", //optional
		"props": { // Dynmic data which will be replaced {{}}
			"PAYERNAME": "",
			"MERCHANTNAME": "",
			"EMAIL": "",
			"MOBILE": "",
			"PASSWORD": "",
		},
		"data": {
			"key": "value"
		}
	}
	const sendEmailPayload = {
		"action": "SENDWEBPUSHNOTIFICATION",
		"meta": metaInfo
	};
	let Message = notificationModule.execute(payload);
```

`18. Batch creation of Subscribers:`
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

`19. Send Transactional Email:`
This will send email notification to the subscribers.

### Payload

| Key | Type | Value | Description | Required |
| --- | ---- | ----- | ----------- | -------- |
| `action` | string | `SENDTRANSACTIONALEMAIL` | key which defines the type of action to be performed | YES |
| `meta` | json | Refer the objet keys below | Json having event, message and subscriber details. | YES |


#### Example

```JSX
	const metaInfo = {
		"subscriberId": "",
		"eventName": "CREATE_PAYER_MAIL",
		"senderName": "", //optional
		"senderEmail": "", //optional
		"attachmentLink": "",
		"props": { // Dynmic data which will be replaced {{}}
			"PAYERNAME": "",
			"MERCHANTNAME": "",
			"EMAIL": "",
			"MOBILE": "",
			"PASSWORD": "",
		}
	}
	const sendEmailPayload = {
		"action": "SENDTRANSACTIONALEMAIL",
		"meta": metaInfo
	};
	let Message = notificationModule.execute(payload);
```

`20. Create Schedule Events:`
This will send notifications to the subscribers based on the scheduled data.

### Payload

| Key | Type | Value | Description | Required |
| --- | ---- | ----- | ----------- | -------- |
| `action` | string | `ADDSCHEDULEDEVENT` | key which defines the type of action to be performed | YES |
| `meta` | json | Refer the objet keys below | Json having message and subscriber details. | YES |


#### Example

##### List of Valid frequency if `isCustom` is true
		1. WEEKLY - If set to weekly customDays fields must be array having integer values from 0,1,2,3,4,5,6. 0 stands for sunday.
		2. MONTHLY - If set to weekly customDates fields must be array having integer values from 0,1,2,3,4.....31. each number is the date on which the notification will be sent

##### List of Valid frequency if `isCustom` is false
		1. ONCE - notification will be sent on the due date only
		2. DAILY - notification will be sent daily till the due date
		3. WEEKLY - notification will be sent on first day of week till the due date
		3. MONTHLY - notification will be sent on first day of month till the due date

```JSX

	const metaInfo = {
		"trackingId": "", //unique and mandatory
		"subscriberId": "", //existing subscriber Id
		"messageName": "", //exisiting message
		"dueDate": "", //final date till which the notification is to be sent
		"isCustom": false, // boolean, can be true or false
		"frequency": "", //refer above for values
		"props": {}, // Dynmic data which will be replaced {{}}
		"customDays": [],
		"customDates": [],
		"senderEmail": "",//optional
		"senderName": "",//optional
		"attachmentLink": "",//optional
		"clickAction": "" //optional
	}
	const payload = {
		"action": "ADDSCHEDULEDEVENT",
		"meta": metaInfo
	};
	let Message = notificationModule.execute(payload);
```

`21. Delete Schedule Events:`
This will delete scheduled notifications for the subscriber based on the message name.

### Payload

| Key | Type | Value | Description | Required |
| --- | ---- | ----- | ----------- | -------- |
| `action` | string | `DELETESCHEDULEDEVENT` | key which defines the type of action to be performed | YES |
| `meta` | json | Refer the objet keys below | Json having message and subscriber details. | YES |


#### Example

```JSX

	const metaInfo = {
		"trackingId": "", //existing
	}
	const payload = {
		"action": "DELETESCHEDULEDEVENT",
		"meta": metaInfo
	};
	let Message = notificationModule.execute(payload);
```

`22. Update Schedule Events:`
This will update scheduled notifications for the subscribers based on the message name.

### Payload

| Key | Type | Value | Description | Required |
| --- | ---- | ----- | ----------- | -------- |
| `action` | string | `UPDATESCHEDULEDEVENT` | key which defines the type of action to be performed | YES |
| `meta` | json | Refer the objet keys below | Json having message and subscriber details. | YES |


#### Example

##### List of Valid frequency if `isCustom` is true
		1. WEEKLY - If set to weekly customDays fields must be array having integer values from 0,1,2,3,4,5,6. 0 stands for sunday.
		2. MONTHLY - If set to weekly customDates fields must be array having integer values from 0,1,2,3,4.....31. each number is the date on which the notification will be sent

##### List of Valid frequency if `isCustom` is false
		1. ONCE - notification will be sent on the due date only
		2. DAILY - notification will be sent daily till the due date
		3. WEEKLY - notification will be sent on first day of week till the due date
		3. MONTHLY - notification will be sent on first day of month till the due date

```JSX

	Note: Event will be updated based on the subscriberId and messageName. So make sure it is the same as what was used while creating a scheduled event.

	const metaInfo = {
		"trackingId": "", //unique and mandatory, this will be used to update
		"subscriberId": "", //existing subscriber Id
		"messageName": "", //exisiting message
		"dueDate": "", //final date till which the notification is to be sent
		"isCustom": false, // boolean, can be true or false
		"frequency": "", //refer above for values
		"props": {}, // Dynmic data which will be replaced {{}}
		"customDays": [],
		"customDates": [],
		"senderEmail": "",//optional
		"senderName": "",//optional
		"attachmentLink": "",//optional
		"clickAction": "" //optional
	}
	const payload = {
		"action": "UPDATESCHEDULEDEVENT",
		"meta": metaInfo
	};
	let Message = notificationModule.execute(payload);
```
