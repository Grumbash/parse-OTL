const cmd = require('node-cmd');
const logger = require("../../logger");

const cmdPromise = command => {
  return new Promise((resolve, reject) => {
    cmd.get(command, function (err, data, stderr) {
      if (err) {
        logger.error(err);
        reject(err);
      }
      logger.info({ message: data });
      resolve(data);
    });
  })
};

module.exports = cmdPromise;