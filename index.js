const axios = require('axios');
require('dotenv').config();

const Ninja = require('./ninja');
const Enyo = require('./enyo');

const tomorrowTasks = [
    Enyo.createTomorrowTask('Mettre en place le système de recherche par filtre avancé'),
    // Enyo.createTomorrowTask("test")
];

async function dailyStandUp(sendDaily = true) {
    Ninja.cleanTasks()
        .then(async tasks => {
            Enyo.createDailyStandUp(tasks, tomorrowTasks)
                .then(dailyStandUp => {
                    if (sendDaily) {
                        Enyo.sendDailyStandUp(dailyStandUp)
                            .then(response => {
                                if (response.data) {
                                    console.log('Daily Send');
                                }
                            })
                            .catch(err => {
                                console.error(err);
                            })
                    } else {
                        Enyo.getUserProfile()
                        console.log(dailyStandUp);
                    }
                })
                .catch(err => {
                    console.error(err);
                })
        })
        .catch(err => {
            console.error(err);
        })
}

dailyStandUp(false);
