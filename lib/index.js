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
  // this.checkConfig = function () {
  //   return this.config.BASE_URL !== '';
  // }
  this.createUser = function (payload, baseUrl) {
    createNotificationConsumer(payload, baseUrl).then(function (userResponse) {
      console.log("userResponse", JSON.stringify(userResponse));
      var email = userResponse.data.meta_info.email;
      var userName = userResponse.data.meta_info.name;
      var templateBody = {
        "title": userName + '_Template',
        "body": 'Welcome ' + userName
      };
      var eventPayload = {
        "name": payload.Event_Name.toUpperCase(),
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
      createEvent(eventPayload).then(function (eventResponse) {
        if (eventResponse.status === 200) {
          var event_id = eventResponse.data.id;
          var sendMailBody = {
            "email": email
          };
          sendMail(event_id, sendMailBody).then(function (emailSent) {
            console.log("Email sent successfully.");
            return JSON.stringify(userResponse);
          }).catch(function (e) {
            return JSON.stringify(e);
          });
        }
      }).catch(function (e) {
        return JSON.stringify(e);
      });
    }).catch(function (e) {
      return JSON.stringify(e);
    });
  };
}

//creating user in  notification consumer model.
var createNotificationConsumer = function createNotificationConsumer(payload, baseUrl) {
  // const hasConfigured = this.checkConfig();
  // if (!hasConfigured) {
  //   throw new Error('Configuration failed');
  // }
  return new Promise(function (resolve, reject) {
    var url = baseUrl + 'notification-consumers';
    try {
      axios.post(url, payload).then(function (response) {
        console.log("user_created", response);
        if (response.status === 200) {
          // createEvent(eventPayload);
          console.log("111111");
          resolve(response);
        } else {
          console.log("222222");
          reject(JSON.stringify(error));
        }
      }).catch(function (error) {
        console.log("333333");
        reject(JSON.stringify(error));
      });
    } catch (e) {
      console.log("4444444");
      reject(JSON.stringify(e));
    }
  });
};

// creating event in notification consumer model.
var createEvent = function createEvent(payload) {
  return new Promise(function (resolve, reject) {
    var url = BASE_URL + 'notification-consumers/createevent';
    axios.post(url, payload).then(function (response) {
      if (response.status === 200) {
        // sendMail(sendMailBody, eventId);
        resolve(response);
      } else {
        console.log(JSON.stringify(response));
        reject(JSON.stringify(response));
      }
    }).catch(function (error) {
      console.log(JSON.stringify(error));
      reject(JSON.stringify(error));
    });
  });
};

//sending mails to user created in notification consumer model.
var sendMail = function sendMail(sendMailBody, event_id) {
  return new Promise(function (resolve, reject) {
    var url = BASE_URL + 'notification-consumers/' + event_id;
    axios.post(url, sendMailBody).then(function (response) {
      if (response.status === 200) {
        resolve(response);
        console.log(response.data);
      } else {
        reject(JSON.stringify(response));
      }
    }).catch(function (error) {
      reject(JSON.stringify(error));
      console.log(error);
    });
  });
};

module.exports = notificationModule;