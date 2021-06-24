const { LoopOptions } = require("../utils/Constants");

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
    this.concludeTimer = null;

    this.playerEvents();
  }

  get exists() {
    return this.client.players.has(this.guildID);
  }

  get isPlaying() {
    return this.player.paused;
  }

  get isQueueEmpty() {
    return (!this.queue.length || !this.current);
  }

  async play() {
    if (!this.exists || this.isQueueEmpty) return this.destroy();

    if (this.loop == LoopOptions.TRACK) this.queue.unshift(this.previous);
    if (this.loop == LoopOptions.QUEUE) this.queue.push(this.previous);

    if (!this.isQueueEmpty) {
      this.current = this.queue.shift();

      await this.player.playTrack(this.current.track);
    }
  }

  destroy(reason) {
    this.player.disconnect();
    this.client.players.delete(this.guildID);
    this.client.send(
      this.textChannelID,
      `I left the voice channel ${reason ? reason : ""}`
    );
  }

  playerEvents() {
    this.player
    .on("start", data => {
      clearTimeout(this.concludeTimer);
      this.client.send(this.textChannelID, {
        embed: {
          color: this.client.util.color.primary,
          description: `Now Playing: ${this.current.info.title}`
        }
      });
    })
    .on("end", data => {
      if (data.reason === "REPLACED") return;
      this.previous = this.current;
      this.current = null;

      if (this.isQueueEmpty) {
        this.concludeTimer = setTimeout(() => this.destroy(), this.client.config.timers.concludeTimer);
      }
      
      this.play()
      .catch(e => {
        this.destroy();
        this.client.logger.error(e);
      });
    })
  }
};
