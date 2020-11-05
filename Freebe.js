const axios = require('axios');
const _ = require('lodash');
require('dotenv').config();

const options = {
    baseURL: process.env.FREEBE_API,
    headers: {}
};

module.exports = {
    async login() {
        return axios.post('/authentication', {
            email: process.env.FREEBE_USER,
            password: process.env.FREEBE_PASS,
            strategy: 'local'
        }, options)
            .then((response) => {
                if (response && response.data) {
                    options.headers.authorization = `Bearer ${response.data.accessToken}`;
                }
            })
            .catch((err) => {
                console.error(err);
            })
    },

    async getTodayTasks() {
        return this.login()
            .then(() => {
                const today = new Date();
                return axios.get(`/timetracking/days`, {
                    ...options,
                    params: {
                        since: today,
                        until: today
                    }
                })
                    .then((response) => {
                        if (response && response.data) {
                            const tasks = response.data[0].timers;
                            return tasks.map(task => {
                                return {
                                    task: task.title,
                                    time: task.duration.in_hours,
                                    comment: ''
                                };
                            })
                        }
                    })
                    .catch((err) => {
                        console.error(err);
                    })
            })
            .catch((err) => {
                console.error(err);
            })
    },
}