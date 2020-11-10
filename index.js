#!/usr/bin/env -S node -r dotenv/config

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
        figlet.textSync('AutoDaily', {horizontalLayout: 'full'})
    )
);

const run = async () => {
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
    const askToSend = await inquirer.askToSend();
    if (askToSend.sendDaily) {
        const dailyStandUpSended = await Enyo.sendDailyStandUp(dailyStandUp);
        console.log(dailyStandUpSended);
        console.log('Daily Send');
        console.log(`${process.env.ENYO_APP}/daily_standup/${dailyStandUpSended._id}`);
    } else {
        console.log(dailyStandUp);
    }
    process.exit(0);
}

run();