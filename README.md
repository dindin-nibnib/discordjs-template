# dindin-nibnib/discordjs-template
This repo is for free use of anyone who want to create a discord bot. It's a base template that's not working by itself though, and you have to learn typescript to use it.
## Initialisation
Just execute npm init, copy the contents of dependecies.json to package.json and run npm install.
You also have to create a .env file containing TOKEN=(your bot token), and off you go!
## Slash commands
Slash commands can be easily created following command.js in the commands directory. You just have to rename commands.js, othewise it will be processed as a command!
## Executing the bot
You can deploy the slash commands using node deploy-commands.js, and you can run the bot using npx ts-node index.ts!
