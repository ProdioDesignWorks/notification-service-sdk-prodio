'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// eslint-disable-next-line import/prefer-default-export
var axios = require('axios');
var HttpErrors = require('http-errors');

var BASE_URL = 'https://1kfkd7w1qi.execute-api.us-west-2.amazonaws.com/dev';

var _require = require('./config/constant.js'),
    APP_NOTIFICATION_TEMPLATE = _require.APP_NOTIFICATION_TEMPLATE,
    EMAIL_NOTIFICATION_TEMPLATE = _require.EMAIL_NOTIFICATION_TEMPLATE,
    SMS_NOTIFICATION_TEMPLATE = _require.SMS_NOTIFICATION_TEMPLATE,
    TEMPLATE_TYPES = _require.TEMPLATE_TYPES,
    ANDROID_TYPE_TOKEN = _require.ANDROID_TYPE_TOKEN,
    IOS_TYPE_TOKEN = _require.IOS_TYPE_TOKEN,
    WEB_TYPE_TOKEN = _require.WEB_TYPE_TOKEN,
    TOKEN_TYPES = _require.TOKEN_TYPES;

var responseBody = {};

var isNull = function isNull(val) {
  if (typeof val === 'string') {
    val = val.trim();
  }
  if (val === undefined || val === null || typeof val === 'undefined' || val === '' || val === 'undefined') {
    return true;
  }
  return false;
};
var isValidEmail = function isValidEmail(val) {
  val = val.trim().toLowerCase();
  var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(val);
};
var isValidPhoneNumber = function isValidPhoneNumber(val) {
  val = val.trim();
  var regex = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/;
  /*/^(\+\d{1,3}[- ]?)?\d{10}$/;*/
  return regex.test(val);
};

var isJson = function isJson(str) {
  try {
    var obj = JSON.parse(JSON.stringify(str));
    if (obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj !== null) {
      return true;
    }
  } catch (err) {
    return false;
  }
  return false;
};

function notificationModule(payload) {
  this.execute = function (payload, callback) {
    // action key calls api.
    if (payload.action == "CREATESUBSCRIBER") {
      return createNotificationConsumer(payload, callback);
    } else if (payload.action == "CREATEEVENT") {
      var eventPayload = {
        "name": payload.metaInfo.name,
        "created_at": new Date(),
        "updated_at": new Date(),
        "_templates": payload.messages,
        "channels": payload.channels
      };
      createEvent(eventPayload, BASE_URL);
    } else if (payload.action == "SENDEMAIL") {

      //send mail payload
      var eventId = payload.eventId;
      var sendMailBody = {
        "email": payload.metaInfo.email,
        "name": payload.metaInfo.name
      };
      sendMail(sendMailBody, eventId, baseUrl);
    } else {
      var errorMessage = 'Please add BaseUrl.';
      return errorMessage;
    }
  };
}

//creating user in  notification consumer model.
var createNotificationConsumer = function createNotificationConsumer(payload, callback) {
  if (!isJson(payload)) {
    return callback(new HttpErrors.BadRequest('Payload must be a JSON object.', { expose: false }));
  } else {
    payload = payload.meta;
    if (isNull(payload.subscriberId)) {
      return callback(new HttpErrors.BadRequest('Subscriber Id is mandatory.', { expose: false }));
    } else if (!isNull(payload.email) && !isValidEmail(payload.email)) {
      return callback(new HttpErrors.BadRequest('Invalid Email Address.', { expose: false }));
    } else if (!isNull(payload.phone) && !isValidPhoneNumber(payload.phone)) {
      return callback(new HttpErrors.BadRequest('Invalid Phone Number.', { expose: false }));
    } else {
      var subscriberTokens = [];
      if (!isNull(payload.email)) {
        var emailToken = {
          "type": "EMAIL_TYPE_TOKEN",
          "token": payload.email
        };
        subscriberTokens.push(emailToken);
      }
      if (!isNull(payload.phone)) {
        var smsToken = {
          "type": "SMS_TYPE_TOKEN",
          "token": payload.phone
        };
        subscriberTokens.push(smsToken);
      }
      if (!isNull(payload.webToken)) {
        var webToken = {
          "type": "WEB_TYPE_TOKEN",
          "token": payload.webToken
        };
        subscriberTokens.push(webToken);
      }
      if (!isNull(payload.androidToken)) {
        var androidToken = {
          "type": "ANDROID_TYPE_TOKEN",
          "token": payload.androidToken
        };
        subscriberTokens.push(androidToken);
      }
      if (!isNull(payload.iosToken)) {
        var iosToken = {
          "type": "IOS_TYPE_TOKEN",
          "token": payload.iosToken
        };
        subscriberTokens.push(iosToken);
      }
      var url = BASE_URL + '/notification-consumers';
      var requestPayload = {
        "subscriberId": payload.subscriberId,
        "metaInfo": payload.metaData,
        "subscriberTokens": subscriberTokens
      };
      axios.post(url, requestPayload).then(function (response) {
        //console.log("user_created", response);
        return callback(response);
      }).catch(function (error) {
        return callback(new HttpErrors.InternalServerError('Please try again.', { expose: false }));
      });
    }
  }
};

// creating event in notification consumer model.
var createEvent = function createEvent(payload, baseUrl) {
  var url = baseUrl + '/notification-consumers/createevent';
  axios.post(url, payload).then(function (response) {
    if (response.status === 200) {
      console.log("event Response", response);
    } else {
      console.log("event", response);
    }
  }).catch(function (error) {
    console.log("eventError", error);
  });
};

//sending mails to user created in notification consumer model.
var sendMail = function sendMail(sendMailBody, event_id, baseUrl) {

  var url = baseUrl + '/notification-consumers/' + event_id;
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