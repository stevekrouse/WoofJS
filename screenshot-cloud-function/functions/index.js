const functions = require('firebase-functions');

const gcs = require('@google-cloud/storage')({keyFilename: 'keyfile.json'});
const path = require('path');
const os = require('os');
const fs = require('fs');
const download = require('image-downloader')

exports.projectScreenshot = functions.database.ref('/code-meta-data/{projectName}/version')
    .onWrite(event => {
      var eventSnapshot = event.data;
      var name = event.params.projectName
      var version = Object.keys(eventSnapshot['_delta'])[0]
      var id = Object.keys(eventSnapshot['_newData']).length

      console.log('Taking screenshot of ' + name + ' (' + version + ')');
      var request = "http://api.screenshotlayer.com/api/capture?access_key="+functions.config().screenshotlayerapikey.key+"&url=http%3A%2F%2Fwoofjs.com%2Ffull.html%23"+encodeURI(name)+"%2F"+id.toString()+"&viewport=1440x900&delay=7&width=500&format=JPG"
      const bucket = gcs.bucket('woofjs-d1b27.appspot.com');
      const tempFilePath = path.join(os.tmpdir(), name + '.jpg');
      const options = {
        url: request,
        dest: tempFilePath
      }
      return download.image(options).then(() => {
        return bucket.upload(tempFilePath, {destination: 'projectScreenshots/' + name + '/' + version + '.jpg'});
      }).then(() => {
        fs.unlinkSync(tempFilePath);

        var file = bucket.file('projectScreenshots/' + name + '/' + version + '.jpg');

        var config = {
          action: 'read',
          expires: '01-01-2050'
        };

        file.getSignedUrl(config, function(err, url) {
          if (err) {
            console.error(err);
            return;
          }

          var request = require('request');
          request(url, function(err, resp) {
            event.data.ref.parent.child('screenshots').child(version).set(url);
            return eventSnapshot.ref.parent.update({ latestScreenshot: url });
          });
        });


      });
    });