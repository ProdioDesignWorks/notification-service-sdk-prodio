
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

function notificationModule(payload, url) {
  // this.checkConfig = function () {
  //   return this.config.BASE_URL !== '';
  // }
  this.createUser = function (payload, baseUrl) {
    createNotificationConsumer(payload, baseUrl).then(userResponse => {
      let email = userResponse.data.meta_info.email;
      let userName = userResponse.data.meta_info.name;
      const templateBody = {
        "title": `${userName}_Template`,
        "body": `Welcome ${userName}`
      };
      const eventPayload = {
        "name": payload.Event_Name.toUpperCase(),
        "created_at": new Date(),
        "updated_at": new Date(),
        "_templates": [
          {
            "name": EMAIL_NOTIFICATION_TEMPLATE,
            "type": EMAIL_NOTIFICATION_TEMPLATE,
            "body": templateBody,
            "created_at": new Date(),
            "updated_at": new Date()
          }
        ]
      };
      createEvent(eventPayload).then(eventResponse => {
        if (eventResponse.status === 200) {
          let event_id = eventResponse.data.id;
          const sendMailBody = {
            "email": email
          };
          sendMail(event_id, sendMailBody).then(emailSent => {
            console.log("Email sent successfully.");
            return (JSON.stringify(userResponse));
          }).catch(e => {
            return (JSON.stringify(e));
          });
        }
      }).catch(e => {
        return (JSON.stringify(e));
      })
    }).catch(e => {
      return (JSON.stringify(e));
    });
  }
}

//creating user in  notification consumer model.
const createNotificationConsumer = function (payload, baseUrl) {
  // const hasConfigured = this.checkConfig();
  // if (!hasConfigured) {
  //   throw new Error('Configuration failed');
  // }
  return new Promise((resolve, reject) => {
    let url = `${baseUrl}notification-consumers`;
    try {
      axios.post(url, payload).then(response => {
        console.log("user_created", response);
        if (response.status === 200) {
          // createEvent(eventPayload);
          resolve(JSON.stringify(response));
        }
        else {
          reject(JSON.stringify(error));
        }
      }).catch((error) => {
        reject(JSON.stringify(error));
      });
    }
    catch (e) {
      reject(JSON.stringify(e));
    }
  })
}

// creating event in notification consumer model.
const createEvent = function (payload) {
  return new Promise((resolve, reject) => {
    let url = `${BASE_URL}notification-consumers/createevent`;
    axios.post(url, payload).then(response => {
      if (response.status === 200) {
        // sendMail(sendMailBody, eventId);
        resolve(JSON.stringify(response));
      }
      else {
        console.log(JSON.stringify(response));
        reject(JSON.stringify(response));
      }
    }).catch(error => {
      console.log(JSON.stringify(error));
      reject(JSON.stringify(error));
    });
  });
}

//sending mails to user created in notification consumer model.
const sendMail = function (sendMailBody, event_id) {
  return new Promise((resolve, reject) => {
    let url = `${BASE_URL}notification-consumers/${event_id}`;
    axios.post(url, sendMailBody).then(response => {
      if (response.status === 200) {
        resolve(JSON.stringify(response));
        console.log(response.data);
      }
      else {
        reject(JSON.stringify(response));
      }
    })
      .catch(error => {
        reject(JSON.stringify(error));
        console.log(error);
      })
  });
}

module.exports = notificationModule;