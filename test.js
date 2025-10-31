const fs = require("fs");
const path = require("path");
const Flysql = require(path.resolve(__dirname, "flysql.js"));
const testsDir = path.resolve(__dirname, "test");
const testFolders = fs.readdirSync(testsDir);

const main = async function () {
  for (let index = 0; index < testFolders.length; index++) {
    const testFolder = testFolders[index];
    const testPath = path.resolve(testsDir, testFolder);
    const testFile = path.resolve(testsDir, testFolder, "test.js");
    process.chdir(testPath);
    const testModule = require(testFile);
    await testModule(Flysql);
  }
};

module.exports = main();