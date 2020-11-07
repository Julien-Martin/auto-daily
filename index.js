require('dotenv').config();
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const inquirer = require('./lib/Inquirer');
const Freebe = require('./lib/Freebe');
const Enyo = require('./lib/Enyo');

clear();

console.log(
    chalk.yellow(
        figlet.textSync('AutoDaily', { horizontalLayout: 'full'})
    )
);

const run = async (sendDaily = false) => {
  const tasks = await Freebe.getTodayTasks();
  if (!tasks.length) {
    console.log(chalk.red('No tasks today.'))
    process.exit(0);
  }
  let tomorrowTask = await inquirer.askTomorrowTask();
  tomorrowTask = Enyo.createTomorrowTask(tomorrowTask.response);
  const projectsList = await Enyo.getProjects();
  const selectedProject = await inquirer.askProject(projectsList);
  const dailyStandUp = await Enyo.createDailyStandUp(tasks, tomorrowTask, selectedProject);
  if (sendDaily) {
    Enyo.sendDailyStandUp(dailyStandUp)
        .then((response) => {
          if (response.data) {
            console.log('Daily Send');
            console.log(`${process.env.ENYO_APP}/daily_standup/${response.data.body._id}`);
          }
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          process.exit(0);
        })
  } else {
    console.log(dailyStandUp);
  }
}

run(false);