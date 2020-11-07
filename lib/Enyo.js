const axios = require('axios');

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

    async createDailyStandUp(tasks, tomorrowTask, projectId) {
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
                                    projectId,
                                    tasks
                                }
                            ]
                        },
                        planForTomorrow: {
                            notes: "",
                            projects: [
                                {
                                    projectId,
                                    tasks: [
                                        tomorrowTask
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

    async getProjects() {
        return this.login()
            .then(async () => {
                const { data } = await axios.get('/project', options);
                return data.body;
            })
            .catch((err) => {
                console.error(err);
            })
    }
}