const axios = require('axios');
require('dotenv').config();

const Enyo = require('./enyo');
const Freebe = require('./Freebe')

const tomorrowTasks = [
    Enyo.createTomorrowTask("Feedback Page Hub"),
];

async function dailyStandUp(sendDaily = true) {
  const tasks = await Freebe.getTodayTasks();
  const dailyStandUp = await Enyo.createDailyStandUp(tasks, tomorrowTasks);
  if(sendDaily) {
    Enyo.sendDailyStandUp(dailyStandUp)
      .then(response => {
        if (response.data) {
          console.log('Daily Send');
          console.log(`${process.env.ENYO_APP}/daily_standup/${response.data.body._id}`);
        }
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        process.exit(0);
      })
  } else {
    console.log(dailyStandUp);
  }
}

dailyStandUp(true);
