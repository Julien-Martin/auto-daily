const axios = require('axios');
require('dotenv').config();

const Ninja = require('./ninja');
const Enyo = require('./enyo');

const tomorrowTasks = [
    Enyo.createTomorrowTask('Mettre en place le système de recherche par filtre avancé'),
];

async function dailyStandUp(sendDaily = true) {
  const tasks = await Ninja.cleanTasks();
  const dailyStandUp = await Enyo.createDailyStandUp(tasks, tomorrowTasks);
  if(sendDaily) {
    Enyo.sendDailyStandUp(dailyStandUp)
      .then(response => {
        if (response.data) {
          console.log('Daily Send');
        }
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        console.log(`${process.env.ENYO_APP}/daily_standup/5f43e5687374402ce0c09baa`);
        process.exit(0);
      })
  }
}

dailyStandUp(false);
