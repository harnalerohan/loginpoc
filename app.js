const express = require('express');
const msal = require('@azure/msal-node');
const msalConfig = require('./msalConfig');
var cors = require('cors')
const app = express();
const jsonwebtoken = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const whiteList = ['http://localhost:4200']
app.use(cors({origin: 'http://localhost:4200'}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
  next();
});

console.log("msalconfig", msalConfig);
const pca = new msal.PublicClientApplication(msalConfig);

const authCodeUrlParameters = {
    scopes: ['user.read'], // Example scope
    redirectUri: msalConfig.auth.redirectUri,
};

app.get('/login', async (req, res) => {
    const authCodeUrl = await pca.getAuthCodeUrl(authCodeUrlParameters);
    res.redirect(authCodeUrl);
});

app.get('/auth/redirect', async (req, res) => {
    const tokenRequest = {
      code: req.query.code,
      client_secret: 'Sdd8Q~NHoXJo9uWO0whX20r2jrnVrLOavUhYTaNQ',
      redirectUri: "http://localhost:3000/auth/redirect",
    };
   
    try {
      const response = await pca.acquireTokenByCode(tokenRequest);
      console.log("response", response);
      console.log("Token acquired:", response.accessToken);
      //generate a jsonwebtoke
      // const isVerified = jsonwebtoken.verify(response.accessToken, msalConfig.auth.clientSecret, {
      //   algorithms: 'RS256'
      // });
      // console.log("isver", isVerified);


      var decoded = jsonwebtoken.decode(response.accessToken, {complete: true});

      console.log("deddd", decoded);
      var header = decoded.header;
      var verifyOptions = {
        algorithms: ['RS256'],
        header: decoded.header
      };

      var client = jwksClient({
        jwksUri: 'https://login.microsoftonline.com/common/discovery/keys'
      });


      client.getSigningKey(header.kid, function(err, key) {
        var signingKey = key.publicKey || key.rsaPublicKey;


        jsonwebtoken.verify(response.accessToken, getKey, verifyOptions, function(err, decoded) {
          //This will display the decoded JWT token.
          console.log("decoded", decoded)
        });
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred");
    }
});

app.get('/logout', async (req, res) => {
  const accounts = await pca.getTokenCache().getAllAccounts();

  console.log("accoynts", accounts);

  const ac = accounts[0];

  pca.getTokenCache().removeAccount(ac).then((value) => {
    console.log("value", value);
  }).catch(err => {
    console.log("err", err);
  })

  // console.log("cleared", a);
})

app.get('validate', (req, res) => {
  const isVerified = jsonwebtoken.verify(req.body.token, msalConfig.auth.clientSecret);

  console.log("isver", isVerified);
})

app.listen(3000, () => {
    console.log("server listening on port 3000");
})