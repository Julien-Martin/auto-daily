const axios = require('axios');
const moment = require('moment');
const _ = require('lodash');

require('dotenv').config();

const options = {
    baseURL: process.env.NINJA_API,
    headers: {
        common: {
            'X-Ninja-Token': process.env.NINJA_TOKEN,
        },
    },
};

module.exports = {
    async getTasks () {
        return axios.get('/tasks', options)
            .then(response => {
                const tasks = response.data.data;
                if (tasks && tasks.length) {
                    return tasks.map(task => {
                        task.duration = task.duration / 60 / 60;
                        const today = moment().format('DD/MM/YYYY');
                        const taskDate = moment.unix(task.updated_at).format('DD/MM/YYYY');
                        if (taskDate === today) {
                            return {
                                task: task.description,
                                time: task.duration,
                                comment: '',
                                date: task.updated_at,
                            };
                        }
                    });
                }
            })
            .catch(err => {
                console.error(err);
            });
    },
    
    async cleanTasks () {
        const tasks = await this.getTasks();
        const cleanTasks = _.chain(tasks).compact().sortBy('date').value();
        cleanTasks.forEach(task => {
            delete task.date;
        });
        return cleanTasks;
    }
};
