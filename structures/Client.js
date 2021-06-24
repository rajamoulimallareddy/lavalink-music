const { Client, Collection } = require("discord.js");

const Logger = require("../modules/Logger");

const CommandHandler = require("../handler/CommandHandler");
const EventHandler = require("../handler/EventHandler");
const QueueHandler = require("../handler/QueueHandler")

const Utils = require("../utils/Util");

module.exports = class MusicClient extends Client {
  constructor(clientOptions) {
    super(clientOptions);
        
    this.logger = new Logger();
    this.snek = require('axios');
    this.config = require('../config.js');
    this.util = new Utils(this);
    
    this.commands = new Collection();
    this.aliases = new Collection();
    this.events = new Collection();
    
    this.players = new QueueHandler(this);

    this.commandHandler = new CommandHandler(this);
    this.eventHandler = new EventHandler(this);
    
    this.quitting = false;
    ['beforeExit', 'SIGUSR1', 'SIGUSR2', 'SIGINT', 'SIGTERM'].map(event => process.once(event, this.exit.bind(this)));
  }
    
  async connect() {
    this.commandHandler.build('../commands');
    this.eventHandler.build('../events');
    await super.login(this.config.token);
  }
   
  exit() { 
    if (this.quitting) return;
    this.quitting = true;
    this.destroy();
  }
  
  fetchCommand(cmd) {
    return this.commands.get(cmd.toLowerCase()) || this.commands.get(this.aliases.get(cmd.toLowerCase()));
  }

  async send(channelID, options) {
    let channel = await this.util.fetchChannel(channelID);
    if (!channel) return;
    if (!options) throw new TypeError("Cannot send a empty message");

    let { content, ...embed } = options;

    channel.send(content, embed);
  };
}