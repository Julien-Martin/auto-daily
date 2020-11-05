const axios = require('axios');
const moment = require('moment');
require('dotenv').config();

const options = {
    baseURL: process.env.ENYO_API,
    headers: {}
};

module.exports = {
    async login() {
      return axios.post('/auth/login', {
          email: process.env.ENYO_USER,
          password: process.env.ENYO_PASS
      }, options).then(response => {
          const data = response.data;
          if(data && data.token) {
              options.headers.authorization = `Bearer ${data.token}`;
              return data;
          }
      }).catch(err => {
          console.error(err);
      })
    },
    
    async createDailyStandUp(tasks, tomorrowTasks) {
      return this.login()
          .then(data => {
              if (data && data.user) {
                  const user = data.user;
                  return {
                      userId: user._id,
                      date: new Date(),
                      todaysTasks: {
                          notes: "",
                          projects: [
                              {
                                  projectId: "5fa010e06f258210ca7430fb",
                                  tasks
                              }
                          ]
                      },
                      planForTomorrow: {
                          notes: "",
                          projects: [
                              {
                                  projectId: "5fa010e06f258210ca7430fb",
                                  tasks: [
                                      ...tomorrowTasks
                                  ]
                              }
                          ]
                      },
                      problemsOrBlocking: {
                          notes: "",
                          projects: []
                      },
                      other: ""
                  };
              }
          })
          .catch(err => {
              console.error(err);
          });
    },
    
    createTomorrowTask(text) {
        return {
            task: text,
            comment: ""
        }
    },
    
    async sendDailyStandUp(dailyStandUp) {
        return axios.post('/daily_standup', dailyStandUp, options);
    },
};
