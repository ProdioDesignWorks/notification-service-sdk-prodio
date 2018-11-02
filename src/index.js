
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

function notificationModule(payload, baseUrl) {
  this.createUser = function (payload, baseUrl) {
    createNotificationConsumer(payload, baseUrl);
  };
}

//creating user in  notification consumer model.
const createNotificationConsumer = function (payload, baseUrl) {

  let url = `${baseUrl}notification-consumers`;
  axios.post(url, payload).then(response => {
    console.log("user_created", response);
    if (response.status === 200) {
      let email = response.data.meta_info.email;
      let userName = response.data.meta_info.name;
      const templateBody = {
        "title": `${userName}_Template`,
        "body": `Welcome ${userName}`
      };
      const eventPayload = {
        "name": payload.EVENT_NAME,
        "created_at": new Date(),
        "updated_at": new Date(),
        "_templates": [
          {
            "name": EMAIL_NOTIFICATION_TEMPLATE,
            "type": EMAIL_NOTIFICATION_TEMPLATE,
            "body": JSON.stringify(templateBody),
            "created_at": new Date(),
            "updated_at": new Date()
          }
        ]
      };
      createEvent(eventPayload,email);
      console.log("111111");
    }
    else {
      console.log("222222");

    }
  }).catch((error) => {
    console.log("333333",error);

  });
}

// creating event in notification consumer model.
const createEvent = function (payload,email) {

  let url = `${BASE_URL}notification-consumers/createevent`;
  axios.post(url, payload).then(response => {
    if (response.status === 200) {
      console.log("event Response", response);
      let eventId = response.data.id;
      const sendMailBody = {
        "email":email
      }
      sendMail(sendMailBody, eventId);

    }
    else {
      console.log("event",response);

    }

  }).catch(error=>{
    console.log("eventError",error);
  });
}

//sending mails to user created in notification consumer model.
const sendMail = function (sendMailBody, event_id) {

  let url = `${BASE_URL}notification-consumers/${event_id}`;
  axios.post(url, sendMailBody).then(response => {
    if (response.status === 200) {
        console.log("response",response);
        console.log("mail sent successfully");
    }
    else {
    }
  }).catch(error=>{
    console.log("mail error",error);
  })

}

module.exports = notificationModule;