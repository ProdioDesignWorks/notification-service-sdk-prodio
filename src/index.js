
// eslint-disable-next-line import/prefer-default-export
const axios = require('axios');
const HttpErrors = require('http-errors');

const BASE_URL = `https://1kfkd7w1qi.execute-api.us-west-2.amazonaws.com/dev`;
const {
  APP_NOTIFICATION_TEMPLATE,
  EMAIL_NOTIFICATION_TEMPLATE,
  SMS_NOTIFICATION_TEMPLATE,
  TEMPLATE_TYPES,
  ANDROID_TYPE_TOKEN,
  IOS_TYPE_TOKEN,
  WEB_TYPE_TOKEN,
  TOKEN_TYPES,
} = require('./config/constant.js');

let responseBody = {

};

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

function notificationModule(payload) {
  this.execute = function (payload, callback) {
    // action key calls api.
    if (payload.action == "CREATESUBSCRIBER") {
        return createNotificationConsumer(payload, callback);
    }
    else if (payload.action == "CREATEEVENT") {
      const eventPayload = {
        "name": payload.metaInfo.name,
        "created_at": new Date(),
        "updated_at": new Date(),
        "_templates": payload.messages,
        "channels": payload.channels
      };
      createEvent(eventPayload, BASE_URL);
    }
    else if (payload.action == "SENDEMAIL") {

      //send mail payload
      let eventId = payload.eventId;
      const sendMailBody = {
        "email": payload.metaInfo.email,
        "name": payload.metaInfo.name
      }
      sendMail(sendMailBody, eventId, baseUrl);
    }
    else {
      let errorMessage = `Please add BaseUrl.`;
      return errorMessage;
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
          "type": "EMAIL_TYPE_TOKEN",
          "token": payload.email
        };
        subscriberTokens.push(emailToken);
      }
      if (!isNull(payload.phone)) {
        const smsToken = {
          "type": "SMS_TYPE_TOKEN",
          "token": payload.phone
        };
        subscriberTokens.push(smsToken);
      }
      if (!isNull(payload.webToken)) {
        const webToken = {
          "type": "WEB_TYPE_TOKEN",
          "token": payload.webToken
        };
        subscriberTokens.push(webToken);
      }
      if (!isNull(payload.androidToken)) {
        const androidToken = {
          "type": "ANDROID_TYPE_TOKEN",
          "token": payload.androidToken
        };
        subscriberTokens.push(androidToken);
      }
      if (!isNull(payload.iosToken)) {
        const iosToken = {
          "type": "IOS_TYPE_TOKEN",
          "token": payload.iosToken
        };
        subscriberTokens.push(iosToken);
      }
      let url = `${BASE_URL}/notification-consumers`;
      const requestPayload = {
        "subscriberId": payload.subscriberId,
        "metaInfo": payload.metaData,
        "subscriberTokens": subscriberTokens
      };
      axios.post(url, requestPayload).then(response => {
        //console.log("user_created", response);
        return callback(response);
      }).catch((error) => {
        return callback(new HttpErrors.InternalServerError('Please try again.', { expose: false }));
      });
    }
  }
}

// creating event in notification consumer model.
const createEvent = function (payload, baseUrl) {
  let url = `${baseUrl}/notification-consumers/createevent`;
  axios.post(url, payload).then(response => {
    if (response.status === 200) {
      console.log("event Response", response);
    }
    else {
      console.log("event", response);
    }

  }).catch(error => {
    console.log("eventError", error);
  });
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