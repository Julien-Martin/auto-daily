const axios = require('axios');
const moment = require('moment');
require('dotenv').config();

const options = {
    baseURL: process.env.ENYO_API,
    headers: {}
};
const instance = axios.create(options);

module.exports = {
    async login() {
      return instance.post('/auth/login', {
          email: process.env.ENYO_USER,
          password: process.env.ENYO_PASS
      }).then(response => {
          const data = response.data;
          if(data && data.token) {
              options.headers.authorization = `Bearer ${data.token}`;
              return data;
          }
      }).catch(err => {
          console.error(err);
      })
    },
    async getUserProfile() {
        return instance.get('/auth/user')
            .then((response) => {
                return response;
            })
            .catch(err => {
                console.error(err);
            });
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
                                  projectId: "5f28102c7374402ce0bf9e56",
                                  tasks
                              }
                          ]
                      },
                      planForTomorrow: {
                          notes: "",
                          projects: [
                              {
                                  projectId: "5f28102c7374402ce0bf9e56",
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
        return axios.create(options).post('daily_standup', dailyStandUp)
            .then(response => {
                console.log(response);
            })
            .catch(err => {
                console.error(err);
            })
    },
};
