const { Collection } = require("discord.js");

const Dispatcher = require("../modules/Dispatcher.js");

module.exports = class PlayerHandler extends Collection {
  constructor(client, iterable) {
    super(iterable);
    this.client = client;
  }
  
  async spawn({ guildID, voiceChannelID, textChannelID }, trackData) {
    if (!this.client.shoukaku.nodes.size) return;
    
    const existingConnection = this.get(guildID);
    
    if (!existingConnection) {
      const node = this.client.shoukaku.getNode();
      
      const player = await node.joinVoiceChannel({
        guildID,
        voiceChannelID,
        deaf: true
      });
      
      const dispatcher = new Dispatcher(this.client, {
        guildID,
        voiceChannelID,
        textChannelID,
        player
      });
      
      this.set(guildID, dispatcher);
      return dispatcher;
    } else {
      existingConnection.textChannelID = textChannelID;
      return existingConnection;
    }
  }
}