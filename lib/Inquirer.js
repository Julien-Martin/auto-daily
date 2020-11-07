const inquirer = require('inquirer');

module.exports = {
    askTomorrowTask: () => {
        const questions = [
            {
                name: 'response',
                type: 'input',
                message: 'Enter your tomorrow task :',
                validate: function( value ) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter your tomorrow task.';
                    }
                }
            }
        ];
        return inquirer.prompt(questions);
    },
    askProject: (projectsList) => {
        const parsedProjectsList = [];
        projectsList.forEach((project) => {
            if (!project.completed) {
                parsedProjectsList.push({
                    name: `${project.code} - ${project.name}`,
                    id: project._id
                })
            }
        })
        return inquirer.prompt([
            {
                type: 'list',
                name: 'project',
                message: 'Which project ?',
                choices: parsedProjectsList
            }
        ]).then((answers) => {
            var itemInQuestion = (answers['project']);
            function isPicked(item) {
                return item.name === itemInQuestion;
            }
            return picked = (parsedProjectsList.find(isPicked)).id;
        })
    }
}