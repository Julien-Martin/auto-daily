require('dotenv').config();
const axios = require('axios');
const CLI = require('clui');
const Spinner = CLI.Spinner;

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
        const status = new Spinner('Login and fetching tasks...');
        status.start();
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
                        status.stop();
                        if (response && response.data && response.data.length) {
                            let tasks = response.data[0].timers;
                            tasks = tasks.map(task => {
                                return {
                                    task: task.title,
                                    time: task.duration.in_hours,
                                    comment: ''
                                };
                            })
                            tasks = tasks.reduce((acc, val) => {
                                const { task, time, comment } = val;
                                const ind = acc.findIndex(el => el.task === task);
                                if (ind !== -1) {
                                    acc[ind].time += time;
                                } else {
                                    acc.push({
                                        task,
                                        time,
                                        comment
                                    });
                                }
                                return acc;
                            }, []);
                            return tasks;
                        } else {
                            return [];
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