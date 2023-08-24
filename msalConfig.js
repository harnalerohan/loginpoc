const msalConfig = {
  auth: {
    clientId: 'a2e830b8-ded3-481c-98d2-3997eb3cf9b6',
    authority: 'https://login.microsoftonline.com/1e18ec39-abfc-4689-b776-f958c3120356',
    redirectUri: 'http://localhost:3000/auth/redirect', // Redirect URI after login
    clientSecret: 'Sdd8Q~NHoXJo9uWO0whX20r2jrnVrLOavUhYTaNQ',
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message, containsPii) {
        console.log(message);
      },
      piiLoggingEnabled: false,
    }
  }
};

module.exports = msalConfig;
