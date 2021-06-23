const { Intents } = require('discord.js');
const { GUILDS, GUILD_VOICE_STATES, GUILD_MESSAGES } = Intents.FLAGS;

const MusicClient = require('./structures/Client');

const clientOptions = {
  disableMentions: 'everyone',
  messageCacheMaxSize: 50,
  messageCacheLifetime: 60,
  messageSweepInterval: 120,
  partials: [
    'MESSAGE',
    'USER',
    'GUILD_MEMBER',
    'CHANNEL'
  ],
  ws: {
    intents: [ GUILDS, GUILD_VOICE_STATES, GUILD_MESSAGES ]
  },
};

const client = new MusicClient(clientOptions);

client.connect();

process.on('uncaughtException', err => console.error(err.stack));
process.on('unhandledRejection', err => console.error(err.stack));