
// eslint-disable-next-line import/prefer-default-export
const axios = require('axios');
const HttpErrors = require('http-errors');

const { APP_NOTIFICATION_TEMPLATE, EMAIL_NOTIFICATION_TEMPLATE, SMS_NOTIFICATION_TEMPLATE, TEMPLATE_TYPES,
  ANDROID_TOKEN, IOS_TOKEN, WEB_TOKEN, EMAIL_TOKEN, SMS_TOKEN,
  TOKEN_TYPES, CHANNEL_TYPES,
  CREATESUBSCRIBER, READSUBSCRIBER, DELETESUBSCRIBER, UPDATESUBSCRIBER,
  CREATEEVENT, READEVENT, DELETEEVENT, UPDATEEVENT,
  CREATEMESSAGE, READMESSAGE, DELETEMESSAGE, UPDATEMESSAGE, UPDATEMESSAGETEMPLATE,
  BASE_URL, CHANNELEMAIL
} = require('./config/constant.js');

const isNull = function (val) {
  if (typeof val === 'string') { val = val.trim(); }
  if (val === undefined || val === null || typeof val === 'undefined' || val === '' || val === 'undefined') {
    return true;
  }
  return false;
};
const isValidEmail = function (val) {
  val = val.trim().toLowerCase();
  var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(val);
};
const isValidPhoneNumber = function (val) {
  val = val.trim();
  var regex = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/;
  /*/^(\+\d{1,3}[- ]?)?\d{10}$/;*/
  return regex.test(val);
};

const isJson = function (str) {
  try {
    var obj = JSON.parse(JSON.stringify(str));
    if (obj && typeof obj === 'object' && obj !== null) {
      return true;
    }
  } catch (err) {
    return false;
  }
  return false;
}

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
      let eventId = payload.eventId;
      const sendMailBody = {
        "email": payload.metaInfo.email,
        "name": payload.metaInfo.name
      }
      sendMail(sendMailBody, eventId, baseUrl);
    } else {
      return callback(new HttpErrors.BadRequest('Invalid Action.', { expose: false }));
    }

  };
}

//creating user in  notification consumer model.
const createNotificationConsumer = function (payload, callback) {
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
      let subscriberTokens = [];
      if (!isNull(payload.email)) {
        const emailToken = {
          "type": EMAIL_TOKEN,
          "token": payload.email
        };
        subscriberTokens.push(emailToken);
      }
      if (!isNull(payload.phone)) {
        const smsToken = {
          "type": SMS_TOKEN,
          "token": payload.phone
        };
        subscriberTokens.push(smsToken);
      }
      if (!isNull(payload.webToken)) {
        const webToken = {
          "type": WEB_TOKEN,
          "token": payload.webToken
        };
        subscriberTokens.push(webToken);
      }
      if (!isNull(payload.androidToken)) {
        const androidToken = {
          "type": ANDROID_TOKEN,
          "token": payload.androidToken
        };
        subscriberTokens.push(androidToken);
      }
      if (!isNull(payload.iosToken)) {
        const iosToken = {
          "type": IOS_TOKEN,
          "token": payload.iosToken
        };
        subscriberTokens.push(iosToken);
      }
      const url = `${BASE_URL}/notification-subscribers/subscriber`;
      const requestPayload = {
        "subscriberId": payload.subscriberId,
        "metaInfo": payload.metaData,
        "subscriberTokens": subscriberTokens
      };
      axios.post(url, requestPayload).then(response => {
        return callback(response);
      }).catch((error) => {
        return callback(error);
      });
    }
  }
}

const getNotificationConsumer = function (callback) {
  const url = `${BASE_URL}/notification-subscribers/subscriber`;
  axios.get(url).then(response => {
    return callback(response);
  }).catch((error) => {
    return callback(error);
  });
}

const deleteNotificationConsumer = function (payload, callback) {
  if (!isJson(payload)) {
    return callback(new HttpErrors.BadRequest('Payload must be a JSON object.', { expose: false }));
  } else {
    payload = payload.meta;
    if (isNull(payload.subscriberId)) {
      return callback(new HttpErrors.BadRequest('Subscriber Id is mandatory.', { expose: false }));
    } else {
      const url = `${BASE_URL}/notification-subscribers/subscriber?subscriberId=${payload.subscriberId}`;
      axios.delete(url).then(response => {
        return callback(response);
      }).catch((error) => {
        return callback(error);
      });
    }
  }
}

const updateNotificationConsumer = function (payload, callback) {
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
      let subscriberTokens = [];
      if (!isNull(payload.email)) {
        const emailToken = {
          "type": EMAIL_TOKEN,
          "token": payload.email
        };
        subscriberTokens.push(emailToken);
      }
      if (!isNull(payload.phone)) {
        const smsToken = {
          "type": SMS_TOKEN,
          "token": payload.phone
        };
        subscriberTokens.push(smsToken);
      }
      if (!isNull(payload.webToken)) {
        const webToken = {
          "type": WEB_TOKEN,
          "token": payload.webToken
        };
        subscriberTokens.push(webToken);
      }
      if (!isNull(payload.androidToken)) {
        const androidToken = {
          "type": ANDROID_TOKEN,
          "token": payload.androidToken
        };
        subscriberTokens.push(androidToken);
      }
      if (!isNull(payload.iosToken)) {
        const iosToken = {
          "type": IOS_TOKEN,
          "token": payload.iosToken
        };
        subscriberTokens.push(iosToken);
      }
      const url = `${BASE_URL}/notification-subscribers/subscriber`;
      const requestPayload = {
        "subscriberId": payload.subscriberId,
        "metaInfo": payload.metaData,
        "subscriberTokens": subscriberTokens
      };
      axios.put(url, requestPayload).then(response => {
        return callback(response);
      }).catch((error) => {
        return callback(error);
      });
    }
  }
}

// creating event in notification consumer model.
const createEvent = function (payload, callback) {
  if (!isJson(payload)) {
    return callback(new HttpErrors.BadRequest('Payload must be a JSON object.', { expose: false }));
  } else {
    payload = payload.meta;
    if (isNull(payload.name)) {
      return callback(new HttpErrors.BadRequest('Event name is mandatory.', { expose: false }));
    } else if (isNull(payload.channels) || payload.channels.length === 0) {
      return callback(new HttpErrors.BadRequest('Event channels is mandatory.', { expose: false }));
    } else {
      let invalidChannels = [], eventChannels = payload.channels;
      eventChannels.map(channel => {
        if (typeof channel === "string") {
          const isValidChannel = CHANNEL_TYPES.indexOf(channel.toUpperCase()) > -1;
          if (!isValidChannel) {
            invalidChannels.push(channel);
          }
        } else {
          invalidChannels.push(channel);
        }
      });
      if (invalidChannels.length > 0) {
        return callback(new HttpErrors.BadRequest('Invalid Channel.', { expose: false }))
      } else {
        const url = `${BASE_URL}/events/event`;
        axios.post(url, payload).then(response => {
          return callback(response);
        }).catch((error) => {
          return callback(error);
        });
      }
    }
  }
}

const getEvent = function (callback) {
  const url = `${BASE_URL}/events/event`;
  axios.get(url).then(response => {
    return callback(response);
  }).catch((error) => {
    return callback(error);
  });
}

const deleteEvent = function (payload, callback) {
  if (!isJson(payload)) {
    return callback(new HttpErrors.BadRequest('Payload must be a JSON object.', { expose: false }));
  } else {
    payload = payload.meta;
    if (isNull(payload.name)) {
      return callback(new HttpErrors.BadRequest('Event name is mandatory.', { expose: false }));
    } else {
      const url = `${BASE_URL}/events/event?eventName=${payload.name}`;
      axios.delete(url).then(response => {
        return callback(response);
      }).catch((error) => {
        return callback(error);
      });
    }
  }
}

const updateEvent = function (payload, callback) {
  if (!isJson(payload)) {
    return callback(new HttpErrors.BadRequest('Payload must be a JSON object.', { expose: false }));
  } else {
    payload = payload.meta;
    if (isNull(payload.name)) {
      return callback(new HttpErrors.BadRequest('Event name is mandatory.', { expose: false }));
    } else if (isNull(payload.channels) || payload.channels.length === 0) {
      return callback(new HttpErrors.BadRequest('Event channels is mandatory.', { expose: false }));
    } else {
      let invalidChannels = [], eventChannels = payload.channels;
      eventChannels.map(channel => {
        if (typeof channel === "string") {
          const isValidChannel = CHANNEL_TYPES.indexOf(channel.toUpperCase()) > -1;
          if (!isValidChannel) {
            invalidChannels.push(channel);
          }
        } else {
          invalidChannels.push(channel);
        }
      });
      if (invalidChannels.length > 0) {
        return callback(new HttpErrors.BadRequest('Invalid Channel.', { expose: false }))
      } else {
        const url = `${BASE_URL}/events/event`;
        axios.put(url, payload).then(response => {
          return callback(response);
        }).catch((error) => {
          return callback(error);
        });
      }
    }
  }
}

const createMessage = function (payload, callback) {
  if (!isJson(payload)) {
    return callback(new HttpErrors.BadRequest('Payload must be a JSON object.', { expose: false }));
  } else {
    payload = payload.meta;
    let invalidMessages = [];
    if (isNull(payload.name)) {
      return callback(new HttpErrors.BadRequest('Message name is mandatory.', { expose: false }));
    } else if (isNull(payload.type)) {
      return callback(new HttpErrors.BadRequest('Message type is mandatory.', { expose: false }));
    } else if (isNull(payload.title)) {
      return callback(new HttpErrors.BadRequest('Message title is mandatory.', { expose: false }));
    } else if (isNull(payload.body)) {
      return callback(new HttpErrors.BadRequest('Message Body is mandatory.', { expose: false }));
    } else {
      const isValidMessageType = CHANNEL_TYPES.indexOf(payload.type.toUpperCase()) > -1;
      if (!isValidMessageType) {
        invalidMessages.push(payload);
      }
      if (invalidMessages.length > 0) {
        return cb(new HttpErrors.BadRequest('Invalid Message Object', { expose: false }))
      } else {
        const url = `${BASE_URL}/message/message`;
        axios.post(url, payload).then(response => {
          return callback(response);
        }).catch((error) => {
          return callback(error);
        });
      }
    }
  }
}

const getMessages = function (callback) {
  const url = `${BASE_URL}/message/message`;
  axios.get(url).then(response => {
    return callback(response);
  }).catch((error) => {
    return callback(error);
  });
}

const deleteMessage = function (payload, callback) {
  if (!isJson(payload)) {
    return callback(new HttpErrors.BadRequest('Payload must be a JSON object.', { expose: false }));
  } else {
    payload = payload.meta;
    if (isNull(payload.name)) {
      return callback(new HttpErrors.BadRequest('Message name is mandatory.', { expose: false }));
    } else {
      const url = `${BASE_URL}/message/message?messageName=${payload.name}`;
      axios.delete(url).then(response => {
        return callback(response);
      }).catch((error) => {
        return callback(error);
      });
    }
  }
}

const updateMessage = function (payload, callback) {
  if (!isJson(payload)) {
    return callback(new HttpErrors.BadRequest('Payload must be a JSON object.', { expose: false }));
  } else {
    payload = payload.meta;
    let invalidMessages = [];
    if (isNull(payload.name)) {
      return callback(new HttpErrors.BadRequest('Message name is mandatory.', { expose: false }));
    } else if (isNull(payload.type)) {
      return callback(new HttpErrors.BadRequest('Message type is mandatory.', { expose: false }));
    } else if (isNull(payload.title)) {
      return callback(new HttpErrors.BadRequest('Message title is mandatory.', { expose: false }));
    } else if (isNull(payload.body)) {
      return callback(new HttpErrors.BadRequest('Message Body is mandatory.', { expose: false }));
    } else {
      const isValidMessageType = CHANNEL_TYPES.indexOf(payload.type.toUpperCase()) > -1;
      if (!isValidMessageType) {
        invalidMessages.push(payload);
      }
      if (invalidMessages.length > 0) {
        return cb(new HttpErrors.BadRequest('Invalid Message Object', { expose: false }))
      } else {
        const url = `${BASE_URL}/message/message`;
        axios.put(url, payload).then(response => {
          return callback(response);
        }).catch((error) => {
          return callback(error);
        });
      }
    }
  }
}

const updateMessageTemplate = function (payload, callback) {
  if (!isJson(payload)) {
    return callback(new HttpErrors.BadRequest('Payload must be a JSON object.', { expose: false }));
  } else {
    payload = payload.meta;
    let invalidMessages = [];
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
      const isValidMessageType = CHANNEL_TYPES.indexOf(payload.type.toUpperCase()) > -1;
      if (!isValidMessageType) {
        invalidMessages.push(payload);
      }
      if (invalidMessages.length > 0) {
        return cb(new HttpErrors.BadRequest('Invalid Message Object', { expose: false }))
      } else {
        const url = `${BASE_URL}/message/fileMessage`;
        axios.post(url, payload).then(response => {
          return callback(response);
        }).catch((error) => {
          return callback(error);
        });
      }
    }
  }
}
  //sending mails to user created in notification consumer model.
  const sendMail = function (sendMailBody, event_id, baseUrl) {

    let url = `${baseUrl}/notification-consumers/${event_id}`;
    axios.post(url, sendMailBody).then(response => {
      if (response.status === 200) {
        console.log("response", response);
        console.log("mail sent successfully");
      }
      else {
      }
    }).catch(error => {
      console.log("mail error", error);
    })

  }

  module.exports = notificationModule;