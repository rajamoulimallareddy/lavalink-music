module.exports = class Dispatcher {
  constructor(client, { guildID, textChannelID, voiceChannelID, player }) {
    this.client = client;
    
    this.guildID = guildID;
    this.textChannelID = textChannelID;
    this.voiceChannelID = voiceChannelID;
    this.player = player;
    
    this.queue = [];
    this.current = null;
    this.previous = null;
    this.loop = 0;
  }
  
  get exists() {
    return this.client.players.get(this.guildID);
  }
  
  get isPlaying() {
    return (this.player.paused);
  }
  
  get isQueueEmpty() {
    return (Boolean(this.queue.length));
  }
  
  destroy(reason) {
    this.player.disconnect();
    this.client.players.delete(this.guildID);
    this.client.send(this.textChannelID, `I left the voice channel ${reason ? reason : ""}`);
  }
}