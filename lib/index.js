'use strict';

// eslint-disable-next-line import/prefer-default-export
var axios = require('axios');
var BASE_URL = 'https://47ha2doy85.execute-api.us-east-1.amazonaws.com/dev/';

var _require = require('./config/constant.js'),
    APP_NOTIFICATION_TEMPLATE = _require.APP_NOTIFICATION_TEMPLATE,
    EMAIL_NOTIFICATION_TEMPLATE = _require.EMAIL_NOTIFICATION_TEMPLATE,
    SMS_NOTIFICATION_TEMPLATE = _require.SMS_NOTIFICATION_TEMPLATE,
    TEMPLATE_TYPES = _require.TEMPLATE_TYPES,
    ANDROID_TYPE_TOKEN = _require.ANDROID_TYPE_TOKEN,
    IOS_TYPE_TOKEN = _require.IOS_TYPE_TOKEN,
    WEB_TYPE_TOKEN = _require.WEB_TYPE_TOKEN,
    TOKEN_TYPES = _require.TOKEN_TYPES;

function notificationModule(payload, baseUrl) {
  this.createUser = function (payload, baseUrl) {
    if (baseUrl !== undefined && baseUrl !== null && baseUrl !== "") {
      createNotificationConsumer(payload, baseUrl);
    } else {
      var errorMessage = 'Please add BaseUrl.';
      return errorMessage;
    }
  };
}

//creating user in  notification consumer model.
var createNotificationConsumer = function createNotificationConsumer(payload, baseUrl) {

  var url = baseUrl + 'notification-consumers';
  axios.post(url, payload).then(function (response) {
    console.log("user_created", response);
    if (response.status === 200) {
      var email = response.data.meta_info.email;
      var userName = response.data.meta_info.name;
      var templateBody = {
        "title": userName + '_Template',
        "body": 'Welcome ' + userName
      };
      var eventPayload = {
        "name": "CREATE_USER",
        "created_at": new Date(),
        "updated_at": new Date(),
        "_templates": [{
          "name": EMAIL_NOTIFICATION_TEMPLATE,
          "type": EMAIL_NOTIFICATION_TEMPLATE,
          "body": JSON.stringify(templateBody),
          "created_at": new Date(),
          "updated_at": new Date()
        }]
      };
      createEvent(eventPayload, email, baseUrl);
      console.log("111111");
    } else {
      console.log("222222");
    }
  }).catch(function (error) {
    console.log("333333", error);
  });
};

// creating event in notification consumer model.
var createEvent = function createEvent(payload, email, baseUrl) {
  var url = baseUrl + 'notification-consumers/createevent';
  axios.post(url, payload).then(function (response) {
    if (response.status === 200) {
      console.log("event Response", response);
      var eventId = response.data.id;
      var sendMailBody = {
        "email": email
      };
      sendMail(sendMailBody, eventId, baseUrl);
    } else {
      console.log("event", response);
    }
  }).catch(function (error) {
    console.log("eventError", error);
  });
};

//sending mails to user created in notification consumer model.
var sendMail = function sendMail(sendMailBody, event_id, baseUrl) {

  var url = baseUrl + 'notification-consumers/' + event_id;
  axios.post(url, sendMailBody).then(function (response) {
    if (response.status === 200) {
      console.log("response", response);
      console.log("mail sent successfully");
    } else {}
  }).catch(function (error) {
    console.log("mail error", error);
  });
};

module.exports = notificationModule;