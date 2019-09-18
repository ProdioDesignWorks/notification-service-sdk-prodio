'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// eslint-disable-next-line import/prefer-default-export
var axios = require('axios');
var HttpErrors = require('http-errors');
var CircularJSON = require('circular-json');

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
    SAFARI_TOKEN = _require.SAFARI_TOKEN,
    TOKEN_TYPES = _require.TOKEN_TYPES,
    CHANNEL_TYPES = _require.CHANNEL_TYPES,
    ATTACHMENT_FILE_TYPES = _require.ATTACHMENT_FILE_TYPES,
    CREATESUBSCRIBER = _require.CREATESUBSCRIBER,
    READSUBSCRIBER = _require.READSUBSCRIBER,
    DELETESUBSCRIBER = _require.DELETESUBSCRIBER,
    UPDATESUBSCRIBER = _require.UPDATESUBSCRIBER,
    CREATEEVENT = _require.CREATEEVENT,
    READEVENT = _require.READEVENT,
    DELETEEVENT = _require.DELETEEVENT,
    UPDATEEVENT = _require.UPDATEEVENT,
    ADDSCHEDULEDEVENT = _require.ADDSCHEDULEDEVENT,
    DELETESCHEDULEDEVENT = _require.DELETESCHEDULEDEVENT,
    UPDATESCHEDULEDEVENT = _require.UPDATESCHEDULEDEVENT,
    CREATEMESSAGE = _require.CREATEMESSAGE,
    READMESSAGE = _require.READMESSAGE,
    DELETEMESSAGE = _require.DELETEMESSAGE,
    UPDATEMESSAGE = _require.UPDATEMESSAGE,
    UPDATEMESSAGETEMPLATE = _require.UPDATEMESSAGETEMPLATE,
    CHANNELEMAIL = _require.CHANNELEMAIL,
    SENDCAMPAIGNEMAIL = _require.SENDCAMPAIGNEMAIL,
    SENDTRANSACTIONALEMAIL = _require.SENDTRANSACTIONALEMAIL,
    SENDPUSHNOTIFICATION = _require.SENDPUSHNOTIFICATION,
    SENDWEBPUSHNOTIFICATION = _require.SENDWEBPUSHNOTIFICATION,
    CREATESUBSCRIBERGROUP = _require.CREATESUBSCRIBERGROUP,
    SUBSCRIBERBULKUPLOAD = _require.SUBSCRIBERBULKUPLOAD,
    LINKEVENTMESSAGE = _require.LINKEVENTMESSAGE,
    READNOTIFICATION = _require.READNOTIFICATION,
    READALLNOTIFICATIONS = _require.READALLNOTIFICATIONS,
    LISTNOTIFCATIONS = _require.LISTNOTIFCATIONS,
    SUBSCRIBETOGROUP = _require.SUBSCRIBETOGROUP,
    UNSUBSCRIBETOGROUP = _require.UNSUBSCRIBETOGROUP,
    NOTIFYTOGROUP = _require.NOTIFYTOGROUP;

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
  val = String(val);
  val = val.trim();
  var regex = /^((?:\+|00)[17](?: |\-)?|(?:\+|00)[1-9]\d{0,2}(?: |\-)?|(?:\+|00)1\-\d{3}(?: |\-)?)?(0\d|\([0-9]{3}\)|[1-9]{0,3})(?:((?: |\-)[0-9]{2}){4}|((?:[0-9]{2}){4})|((?: |\-)[0-9]{3}(?: |\-)[0-9]{4})|([0-9]{7}))$/;
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

function notificationModule(BASE_URL) {
  this.execute = function (payload, callback) {
    // action key calls api.
    if (payload.action === CREATESUBSCRIBER) {
      return createNotificationConsumer(payload, BASE_URL, callback);
    } else if (payload.action === READSUBSCRIBER) {
      return getNotificationConsumer(BASE_URL, callback);
    } else if (payload.action === DELETESUBSCRIBER) {
      return deleteNotificationConsumer(payload, BASE_URL, callback);
    } else if (payload.action === UPDATESUBSCRIBER) {
      return updateNotificationConsumer(payload, BASE_URL, callback);
    } else if (payload.action === CREATEEVENT) {
      return createEvent(payload, BASE_URL, callback);
    } else if (payload.action === READEVENT) {
      return getEvent(payload, BASE_URL, callback);
    } else if (payload.action === DELETEEVENT) {
      return deleteEvent(payload, BASE_URL, callback);
    } else if (payload.action === UPDATEEVENT) {
      return updateEvent(payload, BASE_URL, callback);
    } else if (payload.action === CREATEMESSAGE) {
      return createMessage(payload, BASE_URL, callback);
    } else if (payload.action === READMESSAGE) {
      return getMessages(payload, BASE_URL, callback);
    } else if (payload.action === DELETEMESSAGE) {
      return deleteMessage(payload, BASE_URL, callback);
    } else if (payload.action === UPDATEMESSAGE) {
      return updateMessage(payload, BASE_URL, callback);
    } else if (payload.action === UPDATEMESSAGETEMPLATE) {
      return updateMessageTemplate(payload, BASE_URL, callback);
    } else if (payload.action === SENDCAMPAIGNEMAIL) {
      return sendCampaignMail(payload, BASE_URL, callback);
    } else if (payload.action === SENDTRANSACTIONALEMAIL) {
      return sendTransactionalMail(payload, BASE_URL, callback);
    } else if (payload.action === SENDPUSHNOTIFICATION) {
      return sendPushNotifications(payload, BASE_URL, callback);
    } else if (payload.action === SENDWEBPUSHNOTIFICATION) {
      return sendWebPushNotifications(payload, BASE_URL, callback);
    } else if (payload.action === SUBSCRIBERBULKUPLOAD) {
      return subscriberBulkUpload(payload, BASE_URL, callback);
    } else if (payload.action === CREATESUBSCRIBERGROUP) {
      return createSubscriberGroup(payload, BASE_URL, callback);
    } else if (payload.action === SUBSCRIBETOGROUP) {
      return subscribeToGroup(payload, BASE_URL, callback);
    }if (payload.action === UNSUBSCRIBETOGROUP) {
      return unsubscribeToGroup(payload, BASE_URL, callback);
    }if (payload.action === NOTIFYTOGROUP) {
      return notifyToGroup(payload, BASE_URL, callback);
    } else if (payload.action === ADDSCHEDULEDEVENT) {
      return createScheduledEvent(payload, BASE_URL, callback);
    } else if (payload.action === DELETESCHEDULEDEVENT) {
      return deleteScheduledEvent(payload, BASE_URL, callback);
    } else if (payload.action === UPDATESCHEDULEDEVENT) {
      return updateScheduledEvent(payload, BASE_URL, callback);
    } else if (payload.action === LINKEVENTMESSAGE) {
      return linkEventMessage(payload, BASE_URL, callback);
    } else if (payload.action === READNOTIFICATION) {
      return readNotification(payload, BASE_URL, callback);
    } else if (payload.action === READALLNOTIFICATIONS) {
      return readAllNotifications(payload, BASE_URL, callback);
    } else if (payload.action === LISTNOTIFCATIONS) {
      return listNotifications(payload, BASE_URL, callback);
    } else {
      return callback(new HttpErrors.BadRequest('Invalid Action.', { expose: false }));
    }
  };
}

//creating user in  notification consumer model.
var createNotificationConsumer = function createNotificationConsumer(payload, BASE_URL, callback) {
  if (!isJson(payload)) {
    return callback(new HttpErrors.BadRequest('Payload must be a JSON object.', { expose: false }));
  } else {
    payload = payload.meta;
    if (isNull(payload.subscriberId)) {
      return callback(new HttpErrors.BadRequest('Subscriber Id is mandatory.', { expose: false }));
    } else if (!isNull(payload.email) && !isValidEmail(payload.email)) {
      return callback(new HttpErrors.BadRequest('Invalid Email Address.', { expose: false }));
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
      if (!isNull(payload.safariToken)) {
        var safariToken = {
          "type": SAFARI_TOKEN,
          "token": payload.safariToken
        };
        subscriberTokens.push(safariToken);
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
        var json = CircularJSON.stringify(error);
        return callback(json);
      });
    }
  }
};

var getNotificationConsumer = function getNotificationConsumer(BASE_URL, callback) {
  var url = BASE_URL + '/notification-subscribers/subscriber';
  axios.get(url).then(function (response) {
    return callback(response);
  }).catch(function (error) {
    var json = CircularJSON.stringify(error);
    return callback(json);
  });
};

var deleteNotificationConsumer = function deleteNotificationConsumer(payload, BASE_URL, callback) {
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
        var json = CircularJSON.stringify(error);
        return callback(json);
      });
    }
  }
};

var updateNotificationConsumer = function updateNotificationConsumer(payload, BASE_URL, callback) {
  if (!isJson(payload)) {
    return callback(new HttpErrors.BadRequest('Payload must be a JSON object.', { expose: false }));
  } else {
    payload = payload.meta;
    if (isNull(payload.subscriberId)) {
      return callback(new HttpErrors.BadRequest('Subscriber Id is mandatory.', { expose: false }));
    } else if (!isNull(payload.email) && !isValidEmail(payload.email)) {
      return callback(new HttpErrors.BadRequest('Invalid Email Address.', { expose: false }));
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
      if (!isNull(payload.webToken) || payload.webToken === "") {
        var webToken = {
          "type": WEB_TOKEN,
          "token": payload.webToken
        };
        subscriberTokens.push(webToken);
      }
      if (!isNull(payload.androidToken) || payload.webToken === "") {
        var androidToken = {
          "type": ANDROID_TOKEN,
          "token": payload.androidToken
        };
        subscriberTokens.push(androidToken);
      }
      if (!isNull(payload.iosToken) || payload.webToken === "") {
        var iosToken = {
          "type": IOS_TOKEN,
          "token": payload.iosToken
        };
        subscriberTokens.push(iosToken);
      }
      if (!isNull(payload.safariToken)) {
        var safariToken = {
          "type": SAFARI_TOKEN,
          "token": payload.safariToken
        };
        subscriberTokens.push(safariToken);
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
        var json = CircularJSON.stringify(error);
        return callback(json);
      });
    }
  }
};

// creating event in notification consumer model.
var createEvent = function createEvent(payload, BASE_URL, callback) {
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
          var json = CircularJSON.stringify(error);
          return callback(json);
        });
      }
    }
  }
};

var getEvent = function getEvent(payload, BASE_URL, callback) {
  if (!isJson(payload)) {
    return callback(new HttpErrors.BadRequest('Payload must be a JSON object.', { expose: false }));
  } else {
    var eventFilterName = "";
    if (!isNull(payload.meta) && !isNull(payload.meta.name)) {
      eventFilterName = payload.meta.name;
    }
    var url = BASE_URL + '/events/event?event=' + eventFilterName;
    axios.get(url).then(function (response) {
      return callback(response);
    }).catch(function (error) {
      var json = CircularJSON.stringify(error);
      return callback(json);
    });
  }
};

var deleteEvent = function deleteEvent(payload, BASE_URL, callback) {
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
        var json = CircularJSON.stringify(error);
        return callback(json);
      });
    }
  }
};

var updateEvent = function updateEvent(payload, BASE_URL, callback) {
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
          var json = CircularJSON.stringify(error);
          return callback(json);
        });
      }
    }
  }
};

var createMessage = function createMessage(payload, BASE_URL, callback) {
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
          var json = CircularJSON.stringify(error);
          return callback(json);
        });
      }
    }
  }
};

var getMessages = function getMessages(payload, BASE_URL, callback) {
  if (!isJson(payload)) {
    return callback(new HttpErrors.BadRequest('Payload must be a JSON object.', { expose: false }));
  } else {
    var messageFilterName = "";
    if (!isNull(payload.meta) && !isNull(payload.meta.name)) {
      messageFilterName = payload.meta.name;
    }
    var url = BASE_URL + '/message/message?message=' + messageFilterName;
    axios.get(url).then(function (response) {
      return callback(response);
    }).catch(function (error) {
      var json = CircularJSON.stringify(error);
      return callback(json);
    });
  }
};

var deleteMessage = function deleteMessage(payload, BASE_URL, callback) {
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
        var json = CircularJSON.stringify(error);
        return callback(json);
      });
    }
  }
};

var updateMessage = function updateMessage(payload, BASE_URL, callback) {
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
          var json = CircularJSON.stringify(error);
          return callback(json);
        });
      }
    }
  }
};

var updateMessageTemplate = function updateMessageTemplate(payload, BASE_URL, callback) {
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
          var json = CircularJSON.stringify(error);
          return callback(json);
        });
      }
    }
  }
};

var sendCampaignMail = function sendCampaignMail(payload, BASE_URL, callback) {
  if (!isJson(payload)) {
    return callback(new HttpErrors.BadRequest('Payload must be a JSON object.', { expose: false }));
  } else {
    payload = payload.meta;
    if (isNull(payload.eventName)) {
      return callback(new HttpErrors.BadRequest('Event name is mandatory.', { expose: false }));
    } else if (isNull(payload.subscribers) || payload.subscribers.length === 0) {
      return callback(new HttpErrors.BadRequest('Please add atleast one subscriber.', { expose: false }));
    } else {
      var url = BASE_URL + '/notification-subscribers/campaignEmail';
      axios.post(url, payload).then(function (response) {
        return callback(response);
      }).catch(function (error) {
        var json = CircularJSON.stringify(error);
        return callback(json);
      });
    }
  }
};

var sendTransactionalMail = function sendTransactionalMail(payload, BASE_URL, callback) {
  if (!isJson(payload)) {
    return callback(new HttpErrors.BadRequest('Payload must be a JSON object.', { expose: false }));
  } else {
    payload = payload.meta;
    if (isNull(payload.eventName)) {
      return callback(new HttpErrors.BadRequest('Event name is mandatory.', { expose: false }));
    } else if (isNull(payload.subscriberId)) {
      return callback(new HttpErrors.BadRequest('Subscriber Id is mandatory.', { expose: false }));
    } else {
      var url = BASE_URL + '/notification-subscribers/transEmail';
      axios.post(url, payload).then(function (response) {
        return callback(response);
      }).catch(function (error) {
        var json = CircularJSON.stringify(error);
        return callback(json);
      });
    }
  }
};

var sendPushNotifications = function sendPushNotifications(payload, BASE_URL, callback) {
  if (!isJson(payload)) {
    return callback(new HttpErrors.BadRequest('Payload must be a JSON object.', { expose: false }));
  } else {
    payload = payload.meta;
    if (isNull(payload.eventName)) {
      return callback(new HttpErrors.BadRequest('Event name is mandatory.', { expose: false }));
    } else if (isNull(payload.subscriberId)) {
      return callback(new HttpErrors.BadRequest('Subscriber Id is mandatory.', { expose: false }));
    } else {
      var payloadProps = {};
      if (!isNull(payload.props)) {
        payloadProps.props = payload.props;
      }
      if (!isNull(payload.data)) {
        payloadProps.notificationData = payload.data;
      }
      var url = BASE_URL + '/notification-subscribers/appNotification?eventName=' + payload.eventName + '&subscriberId=' + payload.subscriberId;
      axios.post(url, payloadProps).then(function (response) {
        return callback(response);
      }).catch(function (error) {
        var json = CircularJSON.stringify(error);
        return callback(json);
      });
    }
  }
};

var sendWebPushNotifications = function sendWebPushNotifications(payload, BASE_URL, callback) {
  if (!isJson(payload)) {
    return callback(new HttpErrors.BadRequest('Payload must be a JSON object.', { expose: false }));
  } else {
    payload = payload.meta;
    if (isNull(payload.eventName)) {
      return callback(new HttpErrors.BadRequest('Event name is mandatory.', { expose: false }));
    } else if (isNull(payload.subscriberId)) {
      return callback(new HttpErrors.BadRequest('Subscriber Id is mandatory.', { expose: false }));
    } else {
      var payloadProps = {};
      if (!isNull(payload.props)) {
        payloadProps.props = payload.props;
      }
      if (!isNull(payload.data)) {
        payloadProps.notificationData = payload.data;
      }
      if (!isNull(payload.urlArgs)) {
        payloadProps.urlArgs = payload.urlArgs;
      }
      var url = BASE_URL + '/notification-subscribers/webNotification?eventName=' + payload.eventName + '&subscriberId=' + payload.subscriberId;
      axios.post(url, payloadProps).then(function (response) {
        return callback(response);
      }).catch(function (error) {
        var json = CircularJSON.stringify(error);
        return callback(json);
      });
    }
  }
};

var subscriberBulkUpload = function subscriberBulkUpload(payload, BASE_URL, callback) {
  if (!isJson(payload)) {
    return callback(new HttpErrors.BadRequest('Payload must be a JSON object.', { expose: false }));
  } else {
    payload = payload.meta;
    if (isNull(payload.link)) {
      return callback(new HttpErrors.BadRequest('Link is mandatory.', { expose: false }));
    } else {
      var url = BASE_URL + '/notification-subscribers/bulkUpload?link=' + payload.link;
      axios.put(url, {}).then(function (response) {
        return callback(response);
      }).catch(function (error) {
        var json = CircularJSON.stringify(error);
        return callback(json);
      });
    }
  }
};

var createSubscriberGroup = function createSubscriberGroup(payload, BASE_URL, callback) {
  if (!isJson(payload)) {
    return callback(new HttpErrors.BadRequest('Payload must be a JSON object.', { expose: false }));
  } else {
    payload = payload.meta;
    if (!isJson(payload.group)) {
      return callback(new HttpErrors.BadRequest('Invalid group detail.', { expose: false }));
    } else if (isNull(payload.group.name)) {
      return callback(new HttpErrors.BadRequest('Group name is mandatory.', { expose: false }));
    } else if (isNull(payload.subscribers) || payload.subscribers.length === 0) {
      return callback(new HttpErrors.BadRequest('Add minimum one group subscriber.', { expose: false }));
    } else {
      var payloadData = {
        group: payload.group,
        subscribers: payload.subscribers
      };
      var url = BASE_URL + '/subscriberGroups/group';
      axios.post(url, payloadData).then(function (response) {
        return callback(response);
      }).catch(function (error) {
        var json = CircularJSON.stringify(error);
        return callback(json);
      });
    }
  }
};

var subscribeToGroup = function subscribeToGroup(payload, BASE_URL, callback) {
  if (!isJson(payload)) {
    return callback(new HttpErrors.BadRequest('Payload must be a JSON object.', { expose: false }));
  } else {
    payload = payload.meta;
    if (!isJson(payload.group)) {
      return callback(new HttpErrors.BadRequest('Invalid group detail.', { expose: false }));
    } else if (isNull(payload.group.id)) {
      return callback(new HttpErrors.BadRequest('Group id is mandatory.', { expose: false }));
    } else if (isNull(payload.subscribers) || payload.subscribers.length === 0) {
      return callback(new HttpErrors.BadRequest('Add minimum one group subscriber.', { expose: false }));
    } else {
      var payloadData = {
        group: payload.group,
        subscribers: payload.subscribers
      };
      var url = BASE_URL + '/subscriberGroups/subscribe/' + payload.group.id;
      axios.post(url, payloadData).then(function (response) {
        return callback(response);
      }).catch(function (error) {
        var json = CircularJSON.stringify(error);
        return callback(json);
      });
    }
  }
};

var unsubscribeToGroup = function unsubscribeToGroup(payload, BASE_URL, callback) {
  if (!isJson(payload)) {
    return callback(new HttpErrors.BadRequest('Payload must be a JSON object.', { expose: false }));
  } else {
    payload = payload.meta;
    if (isNull(payload.groupId)) {
      return callback(new HttpErrors.BadRequest('Group id is mandatory.', { expose: false }));
    } else if (isNull(payload.subscribers) || payload.subscribers.length === 0) {
      return callback(new HttpErrors.BadRequest('Add minimum one group subscriber.', { expose: false }));
    } else {
      var payloadData = {
        groupId: payload.groupId,
        subscriberId: payload.subscriberId
      };
      var url = BASE_URL + '/subscriberGroups/unsubscribeGroup/' + payload.groupId + '/' + payload.subscriberId;
      axios.post(url, payloadData).then(function (response) {
        return callback(response);
      }).catch(function (error) {
        var json = CircularJSON.stringify(error);
        return callback(json);
      });
    }
  }
};

var notifyToGroup = function notifyToGroup(payload, BASE_URL, callback) {
  if (!isJson(payload)) {
    return callback(new HttpErrors.BadRequest('Payload must be a JSON object.', { expose: false }));
  } else {
    payload = payload.meta;
    if (isNull(payload.groupId)) {
      return callback(new HttpErrors.BadRequest('Group id is mandatory.', { expose: false }));
    } else if (isNull(payload.eventName)) {
      return callback(new HttpErrors.BadRequest('Event name is mandatory.', { expose: false }));
    } else {
      var payloadData = {
        eventName: payload.eventName,
        data: payload.data
      };
      var url = BASE_URL + '/subscriberGroups/notify/group/' + payload.groupId;
      axios.post(url, payloadData).then(function (response) {
        return callback(response);
      }).catch(function (error) {
        var json = CircularJSON.stringify(error);
        return callback(json);
      });
    }
  }
};

var createScheduledEvent = function createScheduledEvent(payload, BASE_URL, callback) {
  if (!isJson(payload)) {
    return callback(new HttpErrors.BadRequest('Payload must be a JSON object.', { expose: false }));
  } else {
    payload = payload.meta;
    if (isNull(payload.trackingId)) {
      return callback(new HttpErrors.BadRequest('Event tracking Id is mandatory.', { expose: false }));
    } else if (isNull(payload.subscriberId)) {
      return callback(new HttpErrors.BadRequest('Subscriber Id is mandatory.', { expose: false }));
    } else if (isNull(payload.messageName)) {
      return callback(new HttpErrors.BadRequest('Message name is mandatory.', { expose: false }));
    } else if (isNull(payload.dueDate)) {
      return callback(new HttpErrors.BadRequest('Due date is mandatory.', { expose: false }));
    } else if (isNull(payload.isCustom)) {
      return callback(new HttpErrors.BadRequest('Please set if event is custom or not.', { expose: false }));
    } else if (isNull(payload.frequency)) {
      return callback(new HttpErrors.BadRequest('Please set event frequency.', { expose: false }));
    } else {
      var payloadData = {
        trackingId: payload.trackingId,
        subscriberId: payload.subscriberId,
        messageName: payload.messageName,
        dueDate: payload.dueDate,
        isCustom: payload.isCustom,
        frequency: payload.frequency,
        props: !isNull(payload.props) ? payload.props : {},
        customDays: !isNull(payload.customDays) ? payload.customDays : [],
        customDates: !isNull(payload.customDates) ? payload.customDates : [],
        senderEmail: !isNull(payload.senderEmail) ? payload.senderEmail : "",
        senderName: !isNull(payload.senderName) ? payload.senderName : "",
        attachmentLink: !isNull(payload.attachmentLink) ? payload.attachmentLink : "",
        clickAction: !isNull(payload.clickAction) ? payload.clickAction : ""
      };
      var url = BASE_URL + '/scheduledEvents/scheduledEvent';
      axios.post(url, payloadData).then(function (response) {
        return callback(response);
      }).catch(function (error) {
        var json = CircularJSON.stringify(error);
        return callback(json);
      });
    }
  }
};

var deleteScheduledEvent = function deleteScheduledEvent(payload, BASE_URL, callback) {
  if (!isJson(payload)) {
    return callback(new HttpErrors.BadRequest('Payload must be a JSON object.', { expose: false }));
  } else {
    payload = payload.meta;
    if (isNull(payload.trackingId)) {
      return callback(new HttpErrors.BadRequest('Event Tracking Id is mandatory.', { expose: false }));
    } else {
      var url = BASE_URL + '/scheduledEvents/deleteScheduledEvent';
      axios.post(url, payload).then(function (response) {
        return callback(response);
      }).catch(function (error) {
        var json = CircularJSON.stringify(error);
        return callback(json);
      });
    }
  }
};

var updateScheduledEvent = function updateScheduledEvent(payload, BASE_URL, callback) {
  if (!isJson(payload)) {
    return callback(new HttpErrors.BadRequest('Payload must be a JSON object.', { expose: false }));
  } else {
    payload = payload.meta;
    if (isNull(payload.trackingId)) {
      return callback(new HttpErrors.BadRequest('Event tracking Id is mandatory.', { expose: false }));
    } else if (isNull(payload.subscriberId)) {
      return callback(new HttpErrors.BadRequest('Subscriber Id is mandatory.', { expose: false }));
    } else if (isNull(payload.messageName)) {
      return callback(new HttpErrors.BadRequest('Message name is mandatory.', { expose: false }));
    } else if (isNull(payload.dueDate)) {
      return callback(new HttpErrors.BadRequest('Due date is mandatory.', { expose: false }));
    } else if (isNull(payload.isCustom)) {
      return callback(new HttpErrors.BadRequest('Please set if event is custom or not.', { expose: false }));
    } else if (isNull(payload.frequency)) {
      return callback(new HttpErrors.BadRequest('Please set event frequency.', { expose: false }));
    } else {
      var payloadData = {
        trackingId: payload.trackingId,
        subscriberId: payload.subscriberId,
        messageName: payload.messageName,
        dueDate: payload.dueDate,
        isCustom: payload.isCustom,
        frequency: payload.frequency,
        props: !isNull(payload.props) ? payload.props : {},
        customDays: !isNull(payload.customDays) ? payload.customDays : [],
        customDates: !isNull(payload.customDates) ? payload.customDates : [],
        senderEmail: !isNull(payload.senderEmail) ? payload.senderEmail : "",
        senderName: !isNull(payload.senderName) ? payload.senderName : "",
        attachmentLink: !isNull(payload.attachmentLink) ? payload.attachmentLink : "",
        clickAction: !isNull(payload.clickAction) ? payload.clickAction : ""
      };
      var url = BASE_URL + '/scheduledEvents/scheduledEvent';
      axios.put(url, payloadData).then(function (response) {
        return callback(response);
      }).catch(function (error) {
        var json = CircularJSON.stringify(error);
        return callback(json);
      });
    }
  }
};

var linkEventMessage = function linkEventMessage(payload, BASE_URL, callback) {
  if (!isJson(payload)) {
    return callback(new HttpErrors.BadRequest('Payload must be a JSON object.', { expose: false }));
  } else {
    payload = payload.meta;
    if (isNull(payload.messageName)) {
      return callback(new HttpErrors.BadRequest('Message is mandatory.', { expose: false }));
    } else if (isNull(payload.eventName)) {
      return callback(new HttpErrors.BadRequest('Event is mandatory.', { expose: false }));
    } else {
      var url = BASE_URL + '/message/link';
      axios.post(url, payload).then(function (response) {
        return callback(response);
      }).catch(function (error) {
        var json = CircularJSON.stringify(error);
        return callback(json);
      });
    }
  }
};

var readNotification = function readNotification(payload, BASE_URL, callback) {
  if (!isJson(payload)) {
    return callback(new HttpErrors.BadRequest('Payload must be a JSON object.', { expose: false }));
  } else {
    payload = payload.meta;
    if (isNull(payload.logId)) {
      return callback(new HttpErrors.BadRequest('Log Id is mandatory.', { expose: false }));
    } else {
      var url = BASE_URL + '/notificationLogs/read?logId=' + payload.logId;
      axios.post(url, payload).then(function (response) {
        return callback(response);
      }).catch(function (error) {
        var json = CircularJSON.stringify(error);
        return callback(json);
      });
    }
  }
};

var readAllNotifications = function readAllNotifications(payload, BASE_URL, callback) {
  if (!isJson(payload)) {
    return callback(new HttpErrors.BadRequest('Payload must be a JSON object.', { expose: false }));
  } else {
    payload = payload.meta;
    if (isNull(payload.subscriberId)) {
      return callback(new HttpErrors.BadRequest('Subscriber Id is mandatory.', { expose: false }));
    } else if (isNull(payload.type)) {
      return callback(new HttpErrors.BadRequest('Type or Channel is mandatory.', { expose: false }));
    } else {
      var url = BASE_URL + '/notificationLogs/readAll';
      axios.post(url, payload).then(function (response) {
        return callback(response);
      }).catch(function (error) {
        var json = CircularJSON.stringify(error);
        return callback(json);
      });
    }
  }
};

var listNotifications = function listNotifications(payload, BASE_URL, callback) {
  if (!isJson(payload)) {
    return callback(new HttpErrors.BadRequest('Payload must be a JSON object.', { expose: false }));
  } else {
    payload = payload.meta;
    if (isNull(payload.subscriberId)) {
      return callback(new HttpErrors.BadRequest('Subscriber Id is mandatory.', { expose: false }));
    } else if (isNull(payload.type)) {
      return callback(new HttpErrors.BadRequest('Type or Channel is mandatory.', { expose: false }));
    } else if (isNull(payload.pageNo)) {
      return callback(new HttpErrors.BadRequest('Page no is mandatory.', { expose: false }));
    } else if (isNull(payload.limit)) {
      return callback(new HttpErrors.BadRequest('Advisors is mandatory.', { expose: false }));
    } else {
      var url = BASE_URL + '/notificationLogs/list?subscriberId=' + payload.subscriberId + '&type=' + payload.type + '&pageNo=' + payload.pageNo + '&limit=' + payload.limit;
      axios.get(url).then(function (response) {
        return callback(response);
      }).catch(function (error) {
        var json = CircularJSON.stringify(error);
        return callback(json);
      });
    }
  }
};

module.exports = notificationModule;