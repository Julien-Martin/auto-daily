const axios = require('axios');
require('dotenv').config();

const Ninja = require('./ninja');
const Enyo = require('./enyo');

const tomorrowTasks = [
    Enyo.createTomorrowTask("Create a dashboard report component that will allow to build bia drag and drop a dashboard of graphs and numbers"),
];

async function dailyStandUp(sendDaily = true) {
  const tasks = await Ninja.cleanTasks();
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
    console.log(dailyStandUp.todaysTasks.projects[0].tasks);
  }
}

dailyStandUp(true);
