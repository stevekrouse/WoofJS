#Screenshot Firebase Cloud Function

### Introduction
We use a firebase cloud function to take screenshots of projects whenever they are saved. The cloud function is trigged on the write action to database ref `code-meta-data/{project}/version`. The cloud function then takes the screenshot, uploads it to firebase cloud storage, and adds the url in the code-meta-data.

### Setup
1. Check out the [Get Started](https://firebase.google.com/docs/functions/get-started) docs provided by firebase
2. Install the firebase tools (`npm install -g firebase-tools`)
3. Authenticate by running `firebase login`
4. Install node modules by running `npm install`
5. Generate a firebase api key by in the firebase console (Go to Settings > Project Settings > Service Accounts. Make sure Node.js is checked off. Hit Generate New Private Key.)
6. Rename the firebase key file 'keyfile.json' and add it to the functions directory

### Deployment
After updating or writing a new function, run `firebase deploy` to deploy the cloud function. 