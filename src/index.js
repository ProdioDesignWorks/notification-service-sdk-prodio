
// eslint-disable-next-line import/prefer-default-export
const axios = require('axios');
const HttpErrors = require('http-errors');
const CircularJSON = require('circular-json');

const { APP_NOTIFICATION_TEMPLATE, EMAIL_NOTIFICATION_TEMPLATE, SMS_NOTIFICATION_TEMPLATE, TEMPLATE_TYPES,
  ANDROID_TOKEN, IOS_TOKEN, WEB_TOKEN, EMAIL_TOKEN, SMS_TOKEN,
  TOKEN_TYPES, CHANNEL_TYPES, ATTACHMENT_FILE_TYPES,
  CREATESUBSCRIBER, READSUBSCRIBER, DELETESUBSCRIBER, UPDATESUBSCRIBER,
  CREATEEVENT, READEVENT, DELETEEVENT, UPDATEEVENT,
  ADDSCHEDULEDEVENT, DELETESCHEDULEDEVENT, UPDATESCHEDULEDEVENT,
  CREATEMESSAGE, READMESSAGE, DELETEMESSAGE, UPDATEMESSAGE, UPDATEMESSAGETEMPLATE,
  CHANNELEMAIL, SENDCAMPAIGNEMAIL, SENDTRANSACTIONALEMAIL, SENDPUSHNOTIFICATION, SENDWEBPUSHNOTIFICATION,
  CREATESUBSCRIBERGROUP, SUBSCRIBERBULKUPLOAD
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
      return getEvent(BASE_URL, callback);
    } else if (payload.action === DELETEEVENT) {
      return deleteEvent(payload, BASE_URL, callback);
    } else if (payload.action === UPDATEEVENT) {
      return updateEvent(payload, BASE_URL, callback);
    } else if (payload.action === CREATEMESSAGE) {
      return createMessage(payload, BASE_URL, callback);
    } else if (payload.action === READMESSAGE) {
      return getMessages(BASE_URL, callback);
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
    } else if (payload.action === ADDSCHEDULEDEVENT) {
      return createScheduledEvent(payload, BASE_URL, callback);
    } else if (payload.action === DELETESCHEDULEDEVENT) {
      return deleteScheduledEvent(payload, BASE_URL, callback);
    } else if (payload.action === UPDATESCHEDULEDEVENT) {
      return updateScheduledEvent(payload, BASE_URL, callback);
    } else {
      return callback(new HttpErrors.BadRequest('Invalid Action.', { expose: false }));
    }

  };
}

//creating user in  notification consumer model.
const createNotificationConsumer = function (payload, BASE_URL, callback) {
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
        let json = CircularJSON.stringify(error);
        return callback(json);
      });
    }
  }
}

const getNotificationConsumer = function (BASE_URL, callback) {
  const url = `${BASE_URL}/notification-subscribers/subscriber`;
  axios.get(url).then(response => {
    return callback(response);
  }).catch((error) => {
    let json = CircularJSON.stringify(error);
    return callback(json);
  });
}

const deleteNotificationConsumer = function (payload, BASE_URL, callback) {
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
        let json = CircularJSON.stringify(error);
        return callback(json);
      });
    }
  }
}

const updateNotificationConsumer = function (payload, BASE_URL, callback) {
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
      if (!isNull(payload.webToken) || payload.webToken === "") {
        const webToken = {
          "type": WEB_TOKEN,
          "token": payload.webToken
        };
        subscriberTokens.push(webToken);
      }
      if (!isNull(payload.androidToken) || payload.webToken === "") {
        const androidToken = {
          "type": ANDROID_TOKEN,
          "token": payload.androidToken
        };
        subscriberTokens.push(androidToken);
      }
      if (!isNull(payload.iosToken) || payload.webToken === "") {
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
        let json = CircularJSON.stringify(error);
        return callback(json);
      });
    }
  }
}

// creating event in notification consumer model.
const createEvent = function (payload, BASE_URL, callback) {
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
          let json = CircularJSON.stringify(error);
          return callback(json);
        });
      }
    }
  }
}

const getEvent = function (BASE_URL, callback) {
  const url = `${BASE_URL}/events/event`;
  axios.get(url).then(response => {
    return callback(response);
  }).catch((error) => {
    let json = CircularJSON.stringify(error);
    return callback(json);
  });
}

const deleteEvent = function (payload, BASE_URL, callback) {
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
        let json = CircularJSON.stringify(error);
        return callback(json);
      });
    }
  }
}

const updateEvent = function (payload, BASE_URL, callback) {
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
          let json = CircularJSON.stringify(error);
          return callback(json);
        });
      }
    }
  }
}

const createMessage = function (payload, BASE_URL, callback) {
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
          let json = CircularJSON.stringify(error);
          return callback(json);
        });
      }
    }
  }
}

const getMessages = function (BASE_URL, callback) {
  const url = `${BASE_URL}/message/message`;
  axios.get(url).then(response => {
    return callback(response);
  }).catch((error) => {
    let json = CircularJSON.stringify(error);
    return callback(json);
  });
}

const deleteMessage = function (payload, BASE_URL, callback) {
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
        let json = CircularJSON.stringify(error);
        return callback(json);
      });
    }
  }
}

const updateMessage = function (payload, BASE_URL, callback) {
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
          let json = CircularJSON.stringify(error);
          return callback(json);
        });
      }
    }
  }
}

const updateMessageTemplate = function (payload, BASE_URL, callback) {
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
          let json = CircularJSON.stringify(error);
          return callback(json);
        });
      }
    }
  }
}

const sendCampaignMail = function (payload, BASE_URL, callback) {
  if (!isJson(payload)) {
    return callback(new HttpErrors.BadRequest('Payload must be a JSON object.', { expose: false }));
  } else {
    payload = payload.meta;
    if (isNull(payload.eventName)) {
      return callback(new HttpErrors.BadRequest('Event name is mandatory.', { expose: false }));
    } else if (isNull(payload.subscribers) || payload.subscribers.length === 0) {
      return callback(new HttpErrors.BadRequest('Please add atleast one subscriber.', { expose: false }));
    } else {
      const url = `${BASE_URL}/notification-subscribers/campaignEmail`;
      axios.post(url, payload).then(response => {
        return callback(response);
      }).catch((error) => {
        let json = CircularJSON.stringify(error);
        return callback(json);
      });
    }
  }
}

const sendTransactionalMail = function (payload, BASE_URL, callback) {
  if (!isJson(payload)) {
    return callback(new HttpErrors.BadRequest('Payload must be a JSON object.', { expose: false }));
  } else {
    payload = payload.meta;
    if (isNull(payload.eventName)) {
      return callback(new HttpErrors.BadRequest('Event name is mandatory.', { expose: false }));
    } else if (isNull(payload.subscriberId)) {
      return callback(new HttpErrors.BadRequest('Subscriber Id is mandatory.', { expose: false }));
    } else {
      const url = `${BASE_URL}/notification-subscribers/transEmail`;
      axios.post(url, payload).then(response => {
        return callback(response);
      }).catch((error) => {
        let json = CircularJSON.stringify(error);
        return callback(json);
      });
    }
  }
}

const sendPushNotifications = function (payload, BASE_URL, callback) {
  if (!isJson(payload)) {
    return callback(new HttpErrors.BadRequest('Payload must be a JSON object.', { expose: false }));
  } else {
    payload = payload.meta;
    if (isNull(payload.eventName)) {
      return callback(new HttpErrors.BadRequest('Event name is mandatory.', { expose: false }));
    } else if (isNull(payload.subscriberId)) {
      return callback(new HttpErrors.BadRequest('Subscriber Id is mandatory.', { expose: false }));
    } else {
      let payloadProps = {};
      if (!isNull(payload.props)) {
        payloadProps.props = payload.props
      }
      if (!isNull(payload.data)) {
        payloadProps.notificationData = payload.data
      }
      const url = `${BASE_URL}/notification-subscribers/appNotification?eventName=${payload.eventName}&subscriberId=${payload.subscriberId}`;
      axios.post(url, payloadProps).then(response => {
        return callback(response);
      }).catch((error) => {
        let json = CircularJSON.stringify(error);
        return callback(json);
      });
    }
  }
}

const sendWebPushNotifications = function (payload, BASE_URL, callback) {
  if (!isJson(payload)) {
    return callback(new HttpErrors.BadRequest('Payload must be a JSON object.', { expose: false }));
  } else {
    payload = payload.meta;
    if (isNull(payload.eventName)) {
      return callback(new HttpErrors.BadRequest('Event name is mandatory.', { expose: false }));
    } else if (isNull(payload.subscriberId)) {
      return callback(new HttpErrors.BadRequest('Subscriber Id is mandatory.', { expose: false }));
    } else {
      let payloadProps = {};
      if (!isNull(payload.props)) {
        payloadProps.props = payload.props
      }
      if (!isNull(payload.data)) {
        payloadProps.notificationData = payload.data
      }
      const url = `${BASE_URL}/notification-subscribers/webNotification?eventName=${payload.eventName}&subscriberId=${payload.subscriberId}`;
      axios.post(url, payloadProps).then(response => {
        return callback(response);
      }).catch((error) => {
        let json = CircularJSON.stringify(error);
        return callback(json);
      });
    }
  }
}

const subscriberBulkUpload = function (payload, BASE_URL, callback) {
  if (!isJson(payload)) {
    return callback(new HttpErrors.BadRequest('Payload must be a JSON object.', { expose: false }));
  } else {
    payload = payload.meta;
    if (isNull(payload.link)) {
      return callback(new HttpErrors.BadRequest('Link is mandatory.', { expose: false }));
    } else {
      const url = `${BASE_URL}/notification-subscribers/bulkUpload?link=${payload.link}`;
      axios.put(url, {}).then(response => {
        return callback(response);
      }).catch((error) => {
        let json = CircularJSON.stringify(error);
        return callback(json);
      });
    }
  }
}

const createSubscriberGroup = function (payload, BASE_URL, callback) {
  if (!isJson(payload)) {
    return callback(new HttpErrors.BadRequest('Payload must be a JSON object.', { expose: false }));
  } else {
    payload = payload.meta;
    if (isNull(payload.name)) {
      return callback(new HttpErrors.BadRequest('Group name is mandatory.', { expose: false }));
    } else if (isNull(payload.subscribers) || payload.subscribers.length === 0) {
      return callback(new HttpErrors.BadRequest('Add minimum one group subscriber.', { expose: false }));
    } else {
      const payloadData = {
        name: payload.name,
        subscribers: payload.subscribers
      };
      const url = `${BASE_URL}/subscriberGroups/group`;
      axios.post(url, payloadData).then(response => {
        return callback(response);
      }).catch((error) => {
        let json = CircularJSON.stringify(error);
        return callback(json);
      });
    }
  }
}

const createScheduledEvent = function (payload, BASE_URL, callback) {
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
      const payloadData = {
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
      };
      const url = `${BASE_URL}/scheduledEvents/scheduledEvent`;
      axios.post(url, payloadData).then(response => {
        return callback(response);
      }).catch((error) => {
        let json = CircularJSON.stringify(error);
        return callback(json);
      });
    }
  }
}

const deleteScheduledEvent = function (payload, BASE_URL, callback) {
  if (!isJson(payload)) {
    return callback(new HttpErrors.BadRequest('Payload must be a JSON object.', { expose: false }));
  } else {
    payload = payload.meta;
    if (isNull(payload.trackingId)) {
      return callback(new HttpErrors.BadRequest('Event Tracking Id is mandatory.', { expose: false }));
    } else {
      const payloadData = {
        trackingId: payload.trackingId
      };
      const url = `${BASE_URL}/scheduledEvents/scheduledEvent`;
      axios.delete(url, payloadData).then(response => {
        return callback(response);
      }).catch((error) => {
        let json = CircularJSON.stringify(error);
        return callback(json);
      });
    }
  }
}

const updateScheduledEvent = function (payload, BASE_URL, callback) {
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
      const payloadData = {
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
      };
      const url = `${BASE_URL}/scheduledEvents/scheduledEvent`;
      axios.put(url, payloadData).then(response => {
        return callback(response);
      }).catch((error) => {
        let json = CircularJSON.stringify(error);
        return callback(json);
      });
    }
  }
}

module.exports = notificationModule;