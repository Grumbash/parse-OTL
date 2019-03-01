const cmd = require('node-cmd');
const cmdPromise = command => {
  return new Promise((resolve, reject) => {
    cmd.get(command, function (err, data, stderr) {
      if (err) {
        console.error(err);
        reject(err);
      }
      console.log(data);
      resolve(data);
    });
  })
};
module.exports = cmdPromise;