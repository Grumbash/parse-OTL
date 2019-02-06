const fs = require('fs')

export const createFile = async (fileContent, filepath = "mongodb.json") => {
  await fs.writeFile(filepath, fileContent, (err) => {
    if (err) throw err;

    console.log("The file was succesfully saved!");
  });
  return true;
}



