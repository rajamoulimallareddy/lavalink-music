module.exports = {
  token: "NDc5MTQzNDYwNTE2MTM0OTIy.W3OrHw.kAizjFSkXFpKPCEu8iH5ze-ss3E", //this token is invalid make sure you replace it with yours
  prefix: "*",
  supportServer: (code) => `https://discord.gg/${code}`,
  inviteURL: (id, permissions) => `https://discord.com/api/oauth2/authorize?client_id=${id}&permissions=${permissions ? permissions : '8'}&scope=bot`,
  timers: {
    concludeTimer: 20e3,
  }
}