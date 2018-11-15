
// eslint-disable-next-line import/prefer-default-export
const axios = require('axios');
const BASE_URL = `https://47ha2doy85.execute-api.us-east-1.amazonaws.com/dev/`;
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

function notificationModule(payload) {
  this.execute = function (payload) {
    // action key calls api.
    if (payload.action == "CREATESUBSCRIBER") {
      createNotificationConsumer(payload,BASE_URL);
    }
    else if (payload.action == "CREATEEVENT") {
      const eventPayload = {
        "name": payload.metaInfo.name,
        "created_at": new Date(),
        "updated_at": new Date(),
        "_templates": payload.messages,
        "channels": payload.channels
      };
      createEvent(eventPayload,BASE_URL);
    }
    else {
      let errorMessage = `Please add BaseUrl.`;
      return errorMessage;
    }

  };
}

//creating user in  notification consumer model.
const createNotificationConsumer = function (payload, baseUrl) {
  let url = `${baseUrl}notification-consumers`;
  axios.post(url, payload).then(response => {
    console.log("user_created", response);
    if (response.status === 200) {

      console.log("111111");
    }
    else {
      console.log("222222");

    }
  }).catch((error) => {
    console.log("333333", error);

  });
}


// creating event in notification consumer model.
const createEvent = function (payload,baseUrl) {
  let url = `${baseUrl}notification-consumers/createevent`;
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

  let url = `${baseUrl}notification-consumers/${event_id}`;
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