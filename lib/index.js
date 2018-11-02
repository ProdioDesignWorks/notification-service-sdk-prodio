'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

var notificationModule = function () {
  function notificationModule(props) {
    _classCallCheck(this, notificationModule);

    this.config = props;
    this.sendMail = this.sendMail.bind(this);
    this.createEvent = this.createEvent.bind(this);
    this.createNotificationConsumer = this.createNotificationConsumer.bind(this);
  }

  _createClass(notificationModule, [{
    key: 'checkConfig',
    value: function checkConfig() {
      return this.config.BASE_URL !== '';
    }
    //creating user in  notification consumer model.

  }, {
    key: 'createNotificationConsumer',
    value: function createNotificationConsumer(payload, baseUrl) {
      // const hasConfigured = this.checkConfig();
      // if (!hasConfigured) {
      //   throw new Error('Configuration failed');
      // }
      return new Promise(function (resolve, reject) {
        var url = baseUrl + 'notification-consumers';
        try {
          axios.post(Url, payload).then(function (response) {
            console.log("user_created", response);
            if (response.data.status) {
              // createEvent(eventPayload);
              resolve(JSON.stringify(response));
            } else {
              reject(JSON.stringify(error));
            }
          }).catch(function (error) {
            reject(JSON.stringify(error));
          });
        } catch (e) {
          reject(JSON.stringify(e));
        }
      });
    }

    // creating event in notification consumer model.

  }, {
    key: 'createEvent',
    value: function createEvent(payload) {
      return new Promise(function (resolve, reject) {
        var url = BASE_URL + 'notification-consumers/createevent';
        axios.post(url, payload).then(function (response) {
          if (response.data.status) {
            // sendMail(sendMailBody, eventId);
            resolve(JSON.stringify(response));
          } else {
            console.log(JSON.stringify(response));
            reject(JSON.stringify(response));
          }
        }).catch(function (error) {
          console.log(JSON.stringify(error));
          reject(JSON.stringify(error));
        });
      });
    }

    //sending mails to user created in notification consumer model.

  }, {
    key: 'sendMail',
    value: function sendMail(sendMailBody, event_id) {
      return new Promise(function (resolve, reject) {
        var url = BASE_URL + 'notification-consumers/' + event_id;
        axios.post(url, sendMailBody).then(function (response) {
          if (response.data.status) {
            resolve(JSON.stringify(response));
            console.log(response.data);
          } else {
            reject(JSON.stringify(response));
          }
        }).catch(function (error) {
          reject(JSON.stringify(error));
          console.log(error);
        });
      });
    }
  }, {
    key: 'createUser',
    value: function createUser(payload, baseUrl) {
      var _this = this;

      this.createNotificationConsumer(payload, baseUrl).then(function (userResponse) {
        var email = userResponse.data.data.meta_info.email;
        var userName = userResponse.data.data.meta_info.name;
        var templateBody = {
          "title": userName + '_Template',
          "body": 'Welcome ' + userName
        };
        var eventPayload = {
          "name": payload.Event_Name,
          "created_at": new Date(),
          "updated_at": new Date(),
          "_templates": [{
            "name": EMAIL_NOTIFICATION_TEMPLATE,
            "type": EMAIL_NOTIFICATION_TEMPLATE,
            "body": templateBody,
            "created_at": new Date(),
            "updated_at": new Date()
          }]
        };
        _this.createEvent(eventPayload).then(function (eventResponse) {
          if (eventResponse.data.status) {
            var event_id = eventResponse.data.data.id;
            var sendMailBody = {
              "email": email
            };
            _this.sendMail(event_id, sendMailBody).then(function (emailSent) {
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
    }
  }]);

  return notificationModule;
}();

exports.default = notificationModule;