# Phaser3 Beat'em up - Twitch Plays Experience

A beat'em up browser game connected with Twitch Api through an extension, using [Phaser3](https://www.phaser.io/phaser3) and [Typescript](https://www.typescriptlang.org/).

This repository is a Phaser3 game with ES6 & Typescript supports that includes hot-reloading for development and production-ready builds. 

## Connect with Twitch

### Register your application

Connect on [Twitch Developers](https://dev.twitch.tv/console) and register an application to use Twitch API.

1. Set a name, the following OAuth redirect url `http://localhost:8080` and after the registration, you will get an **Client ID**. 
2. Click to manage your application and create a new **Client Secret**
3. Save your **Client ID / Secret** for the environment variables

## Setting environment variables

Create a `.env` file with this template:

```
EXT_CLIENT_ID=YOUR_CLIENT_ID
EXT_CLIENT_SECRET=YOUR_CLIENT_SECRET
```

### Launch the game

On the repository, run `yarn start:prod` to launch the game in ready-to-use mode. 

Open your browser (100% compatibility with Mozilla Firefox) and go on [localhost:8080](http://localhost:8080)`. You can connect the game with your twitch channel.

## Available Commands

| Command | Description |
|---------|-------------|
| `yarn install` | Install project dependencies |
| `yarn start` | For development only |
| `yarn start:prod` | Build project in ready-to-use mode with your twitch channel |
| `yarn build` | Output the bundle and assets |

