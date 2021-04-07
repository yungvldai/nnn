const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const parse = require('./parser');
const { compose } = require('./fp');

const INPUT_DIR = '../input';
const OUTPUT_DIR = '../output';

const readCSV = (fileName) => {
  const filePath = path.resolve(__dirname, INPUT_DIR, fileName);

  return new Promise((resolve, reject) => {
    const buffer = [];
    const bufferAdd = chunk => buffer.push(chunk);

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', compose(bufferAdd, parse))
      .on('error', reject)
      .on('end', () => {
        resolve(buffer);
      });
  });
}

const writeCSV = (fileName, data) => {
  const filePath = path.resolve(__dirname, OUTPUT_DIR, fileName);

  return new Promise((resolve, reject) => {
    const content = 'index,price\n' + Object.entries(data).reduce((acc, [key, value]) => {
      return acc += `${key},${value.toFixed()}\n`;
    }, '');

    fs.writeFile(filePath, content, (error) => {
      if (error) {
        reject(error);
      }
      resolve();
    });
  });
}

module.exports = {
  readCSV,
  writeCSV
};

