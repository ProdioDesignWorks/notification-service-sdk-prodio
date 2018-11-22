'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// eslint-disable-next-line import/prefer-default-export
var axios = require('axios');
var HttpErrors = require('http-errors');

var _require = require('./config/constant.js'),
    APP_NOTIFICATION_TEMPLATE = _require.APP_NOTIFICATION_TEMPLATE,
    EMAIL_NOTIFICATION_TEMPLATE = _require.EMAIL_NOTIFICATION_TEMPLATE,
    SMS_NOTIFICATION_TEMPLATE = _require.SMS_NOTIFICATION_TEMPLATE,
    TEMPLATE_TYPES = _require.TEMPLATE_TYPES,
    ANDROID_TOKEN = _require.ANDROID_TOKEN,
    IOS_TOKEN = _require.IOS_TOKEN,
    WEB_TOKEN = _require.WEB_TOKEN,
    EMAIL_TOKEN = _require.EMAIL_TOKEN,
    SMS_TOKEN = _require.SMS_TOKEN,
    TOKEN_TYPES = _require.TOKEN_TYPES,
    CHANNEL_TYPES = _require.CHANNEL_TYPES,
    CREATESUBSCRIBER = _require.CREATESUBSCRIBER,
    READSUBSCRIBER = _require.READSUBSCRIBER,
    DELETESUBSCRIBER = _require.DELETESUBSCRIBER,
    UPDATESUBSCRIBER = _require.UPDATESUBSCRIBER,
    CREATEEVENT = _require.CREATEEVENT,
    READEVENT = _require.READEVENT,
    DELETEEVENT = _require.DELETEEVENT,
    UPDATEEVENT = _require.UPDATEEVENT,
    CREATEMESSAGE = _require.CREATEMESSAGE,
    READMESSAGE = _require.READMESSAGE,
    DELETEMESSAGE = _require.DELETEMESSAGE,
    UPDATEMESSAGE = _require.UPDATEMESSAGE,
    UPDATEMESSAGETEMPLATE = _require.UPDATEMESSAGETEMPLATE,
    BASE_URL = _require.BASE_URL,
    CHANNELEMAIL = _require.CHANNELEMAIL;

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

function notificationModule() {
  this.execute = function (payload, callback) {
    // action key calls api.
    if (payload.action === CREATESUBSCRIBER) {
      return createNotificationConsumer(payload, callback);
    } else if (payload.action === READSUBSCRIBER) {
      return getNotificationConsumer(callback);
    } else if (payload.action === DELETESUBSCRIBER) {
      return deleteNotificationConsumer(payload, callback);
    } else if (payload.action === UPDATESUBSCRIBER) {
      return updateNotificationConsumer(payload, callback);
    } else if (payload.action === CREATEEVENT) {
      return createEvent(payload, callback);
    } else if (payload.action === READEVENT) {
      return getEvent(callback);
    } else if (payload.action === DELETEEVENT) {
      return deleteEvent(payload, callback);
    } else if (payload.action === UPDATEEVENT) {
      return updateEvent(payload, callback);
    } else if (payload.action === CREATEMESSAGE) {
      return createMessage(payload, callback);
    } else if (payload.action === READMESSAGE) {
      return getMessages(callback);
    } else if (payload.action === DELETEMESSAGE) {
      return deleteMessage(payload, callback);
    } else if (payload.action === UPDATEMESSAGE) {
      return updateMessage(payload, callback);
    } else if (payload.action === UPDATEMESSAGETEMPLATE) {
      return updateMessageTemplate(payload, callback);
    } else if (payload.action == "SENDEMAIL") {
      //send mail payload
      var eventId = payload.eventId;
      var sendMailBody = {
        "email": payload.metaInfo.email,
        "name": payload.metaInfo.name
      };
      sendMail(sendMailBody, eventId, baseUrl);
    } else {
      return callback(new HttpErrors.BadRequest('Invalid Action.', { expose: false }));
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
          "type": EMAIL_TOKEN,
          "token": payload.email
        };
        subscriberTokens.push(emailToken);
      }
      if (!isNull(payload.phone)) {
        var smsToken = {
          "type": SMS_TOKEN,
          "token": payload.phone
        };
        subscriberTokens.push(smsToken);
      }
      if (!isNull(payload.webToken)) {
        var webToken = {
          "type": WEB_TOKEN,
          "token": payload.webToken
        };
        subscriberTokens.push(webToken);
      }
      if (!isNull(payload.androidToken)) {
        var androidToken = {
          "type": ANDROID_TOKEN,
          "token": payload.androidToken
        };
        subscriberTokens.push(androidToken);
      }
      if (!isNull(payload.iosToken)) {
        var iosToken = {
          "type": IOS_TOKEN,
          "token": payload.iosToken
        };
        subscriberTokens.push(iosToken);
      }
      var url = BASE_URL + '/notification-subscribers/subscriber';
      var requestPayload = {
        "subscriberId": payload.subscriberId,
        "metaInfo": payload.metaData,
        "subscriberTokens": subscriberTokens
      };
      axios.post(url, requestPayload).then(function (response) {
        return callback(response);
      }).catch(function (error) {
        return callback(error);
      });
    }
  }
};

var getNotificationConsumer = function getNotificationConsumer(callback) {
  var url = BASE_URL + '/notification-subscribers/subscriber';
  axios.get(url).then(function (response) {
    return callback(response);
  }).catch(function (error) {
    return callback(error);
  });
};

var deleteNotificationConsumer = function deleteNotificationConsumer(payload, callback) {
  if (!isJson(payload)) {
    return callback(new HttpErrors.BadRequest('Payload must be a JSON object.', { expose: false }));
  } else {
    payload = payload.meta;
    if (isNull(payload.subscriberId)) {
      return callback(new HttpErrors.BadRequest('Subscriber Id is mandatory.', { expose: false }));
    } else {
      var url = BASE_URL + '/notification-subscribers/subscriber?subscriberId=' + payload.subscriberId;
      axios.delete(url).then(function (response) {
        return callback(response);
      }).catch(function (error) {
        return callback(error);
      });
    }
  }
};

var updateNotificationConsumer = function updateNotificationConsumer(payload, callback) {
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
          "type": EMAIL_TOKEN,
          "token": payload.email
        };
        subscriberTokens.push(emailToken);
      }
      if (!isNull(payload.phone)) {
        var smsToken = {
          "type": SMS_TOKEN,
          "token": payload.phone
        };
        subscriberTokens.push(smsToken);
      }
      if (!isNull(payload.webToken)) {
        var webToken = {
          "type": WEB_TOKEN,
          "token": payload.webToken
        };
        subscriberTokens.push(webToken);
      }
      if (!isNull(payload.androidToken)) {
        var androidToken = {
          "type": ANDROID_TOKEN,
          "token": payload.androidToken
        };
        subscriberTokens.push(androidToken);
      }
      if (!isNull(payload.iosToken)) {
        var iosToken = {
          "type": IOS_TOKEN,
          "token": payload.iosToken
        };
        subscriberTokens.push(iosToken);
      }
      var url = BASE_URL + '/notification-subscribers/subscriber';
      var requestPayload = {
        "subscriberId": payload.subscriberId,
        "metaInfo": payload.metaData,
        "subscriberTokens": subscriberTokens
      };
      axios.put(url, requestPayload).then(function (response) {
        return callback(response);
      }).catch(function (error) {
        return callback(error);
      });
    }
  }
};

// creating event in notification consumer model.
var createEvent = function createEvent(payload, callback) {
  if (!isJson(payload)) {
    return callback(new HttpErrors.BadRequest('Payload must be a JSON object.', { expose: false }));
  } else {
    payload = payload.meta;
    if (isNull(payload.name)) {
      return callback(new HttpErrors.BadRequest('Event name is mandatory.', { expose: false }));
    } else if (isNull(payload.channels) || payload.channels.length === 0) {
      return callback(new HttpErrors.BadRequest('Event channels is mandatory.', { expose: false }));
    } else {
      var invalidChannels = [],
          eventChannels = payload.channels;
      eventChannels.map(function (channel) {
        if (typeof channel === "string") {
          var isValidChannel = CHANNEL_TYPES.indexOf(channel.toUpperCase()) > -1;
          if (!isValidChannel) {
            invalidChannels.push(channel);
          }
        } else {
          invalidChannels.push(channel);
        }
      });
      if (invalidChannels.length > 0) {
        return callback(new HttpErrors.BadRequest('Invalid Channel.', { expose: false }));
      } else {
        var url = BASE_URL + '/events/event';
        axios.post(url, payload).then(function (response) {
          return callback(response);
        }).catch(function (error) {
          return callback(error);
        });
      }
    }
  }
};

var getEvent = function getEvent(callback) {
  var url = BASE_URL + '/events/event';
  axios.get(url).then(function (response) {
    return callback(response);
  }).catch(function (error) {
    return callback(error);
  });
};

var deleteEvent = function deleteEvent(payload, callback) {
  if (!isJson(payload)) {
    return callback(new HttpErrors.BadRequest('Payload must be a JSON object.', { expose: false }));
  } else {
    payload = payload.meta;
    if (isNull(payload.name)) {
      return callback(new HttpErrors.BadRequest('Event name is mandatory.', { expose: false }));
    } else {
      var url = BASE_URL + '/events/event?eventName=' + payload.name;
      axios.delete(url).then(function (response) {
        return callback(response);
      }).catch(function (error) {
        return callback(error);
      });
    }
  }
};

var updateEvent = function updateEvent(payload, callback) {
  if (!isJson(payload)) {
    return callback(new HttpErrors.BadRequest('Payload must be a JSON object.', { expose: false }));
  } else {
    payload = payload.meta;
    if (isNull(payload.name)) {
      return callback(new HttpErrors.BadRequest('Event name is mandatory.', { expose: false }));
    } else if (isNull(payload.channels) || payload.channels.length === 0) {
      return callback(new HttpErrors.BadRequest('Event channels is mandatory.', { expose: false }));
    } else {
      var invalidChannels = [],
          eventChannels = payload.channels;
      eventChannels.map(function (channel) {
        if (typeof channel === "string") {
          var isValidChannel = CHANNEL_TYPES.indexOf(channel.toUpperCase()) > -1;
          if (!isValidChannel) {
            invalidChannels.push(channel);
          }
        } else {
          invalidChannels.push(channel);
        }
      });
      if (invalidChannels.length > 0) {
        return callback(new HttpErrors.BadRequest('Invalid Channel.', { expose: false }));
      } else {
        var url = BASE_URL + '/events/event';
        axios.put(url, payload).then(function (response) {
          return callback(response);
        }).catch(function (error) {
          return callback(error);
        });
      }
    }
  }
};

var createMessage = function createMessage(payload, callback) {
  if (!isJson(payload)) {
    return callback(new HttpErrors.BadRequest('Payload must be a JSON object.', { expose: false }));
  } else {
    payload = payload.meta;
    var invalidMessages = [];
    if (isNull(payload.name)) {
      return callback(new HttpErrors.BadRequest('Message name is mandatory.', { expose: false }));
    } else if (isNull(payload.type)) {
      return callback(new HttpErrors.BadRequest('Message type is mandatory.', { expose: false }));
    } else if (isNull(payload.title)) {
      return callback(new HttpErrors.BadRequest('Message title is mandatory.', { expose: false }));
    } else if (isNull(payload.body)) {
      return callback(new HttpErrors.BadRequest('Message Body is mandatory.', { expose: false }));
    } else {
      var isValidMessageType = CHANNEL_TYPES.indexOf(payload.type.toUpperCase()) > -1;
      if (!isValidMessageType) {
        invalidMessages.push(payload);
      }
      if (invalidMessages.length > 0) {
        return cb(new HttpErrors.BadRequest('Invalid Message Object', { expose: false }));
      } else {
        var url = BASE_URL + '/message/message';
        axios.post(url, payload).then(function (response) {
          return callback(response);
        }).catch(function (error) {
          return callback(error);
        });
      }
    }
  }
};

var getMessages = function getMessages(callback) {
  var url = BASE_URL + '/message/message';
  axios.get(url).then(function (response) {
    return callback(response);
  }).catch(function (error) {
    return callback(error);
  });
};

var deleteMessage = function deleteMessage(payload, callback) {
  if (!isJson(payload)) {
    return callback(new HttpErrors.BadRequest('Payload must be a JSON object.', { expose: false }));
  } else {
    payload = payload.meta;
    if (isNull(payload.name)) {
      return callback(new HttpErrors.BadRequest('Message name is mandatory.', { expose: false }));
    } else {
      var url = BASE_URL + '/message/message?messageName=' + payload.name;
      axios.delete(url).then(function (response) {
        return callback(response);
      }).catch(function (error) {
        return callback(error);
      });
    }
  }
};

var updateMessage = function updateMessage(payload, callback) {
  if (!isJson(payload)) {
    return callback(new HttpErrors.BadRequest('Payload must be a JSON object.', { expose: false }));
  } else {
    payload = payload.meta;
    var invalidMessages = [];
    if (isNull(payload.name)) {
      return callback(new HttpErrors.BadRequest('Message name is mandatory.', { expose: false }));
    } else if (isNull(payload.type)) {
      return callback(new HttpErrors.BadRequest('Message type is mandatory.', { expose: false }));
    } else if (isNull(payload.title)) {
      return callback(new HttpErrors.BadRequest('Message title is mandatory.', { expose: false }));
    } else if (isNull(payload.body)) {
      return callback(new HttpErrors.BadRequest('Message Body is mandatory.', { expose: false }));
    } else {
      var isValidMessageType = CHANNEL_TYPES.indexOf(payload.type.toUpperCase()) > -1;
      if (!isValidMessageType) {
        invalidMessages.push(payload);
      }
      if (invalidMessages.length > 0) {
        return cb(new HttpErrors.BadRequest('Invalid Message Object', { expose: false }));
      } else {
        var url = BASE_URL + '/message/message';
        axios.put(url, payload).then(function (response) {
          return callback(response);
        }).catch(function (error) {
          return callback(error);
        });
      }
    }
  }
};

var updateMessageTemplate = function updateMessageTemplate(payload, callback) {
  if (!isJson(payload)) {
    return callback(new HttpErrors.BadRequest('Payload must be a JSON object.', { expose: false }));
  } else {
    payload = payload.meta;
    var invalidMessages = [];
    if (isNull(payload.name)) {
      return callback(new HttpErrors.BadRequest('Message name is mandatory.', { expose: false }));
    } else if (isNull(payload.type)) {
      return callback(new HttpErrors.BadRequest('Message type is mandatory.', { expose: false }));
    } else if (payload.type !== CHANNELEMAIL) {
      return callback(new HttpErrors.BadRequest('Message type for file can only be email.', { expose: false }));
    } else if (isNull(payload.title)) {
      return callback(new HttpErrors.BadRequest('Message title is mandatory.', { expose: false }));
    } else if (isNull(payload.fileUrl)) {
      return callback(new HttpErrors.BadRequest('Message Template Link is mandatory.', { expose: false }));
    } else {
      var isValidMessageType = CHANNEL_TYPES.indexOf(payload.type.toUpperCase()) > -1;
      if (!isValidMessageType) {
        invalidMessages.push(payload);
      }
      if (invalidMessages.length > 0) {
        return cb(new HttpErrors.BadRequest('Invalid Message Object', { expose: false }));
      } else {
        var url = BASE_URL + '/message/fileMessage';
        axios.post(url, payload).then(function (response) {
          return callback(response);
        }).catch(function (error) {
          return callback(error);
        });
      }
    }
  }
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