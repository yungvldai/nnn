const { NeuralNetwork } = require('brain.js');
const cliProgress = require('cli-progress');
const chalk = require('chalk');
const { readCSV, writeCSV } = require('./io');
const { getOptimizedDataset, getReferences } = require('./data');

const dataReady = Promise.all([readCSV('data.csv'), readCSV('test.csv')]);

const config = {
  binaryThresh: 0.5,
  hiddenLayers: [10, 8, 6, 4],
  activation: 'sigmoid'
};

dataReady
  .then(([trainData, workData]) => {
    console.log('Awaiting for referencies...');

    const refs = getReferences([...trainData, ...workData]);
    const preparedTrainData = getOptimizedDataset(trainData, refs);

    console.log('Training dataset', chalk.green('ok'));

    const network = new NeuralNetwork(config);

    console.log('Network instance', chalk.green('ok'));
    console.log('Training...');

    network.train(preparedTrainData, {
      iterations: 25000,
      errorThresh: 0.00001,
      callbackPeriod: 10,
      callback: (trainResult) => {
        console.log(trainResult)
      }
    });

    console.log('Training', chalk.green('ok'));
    
    const preparedWorkData = getOptimizedDataset(workData, refs, { indexes: true });

    console.log('Working dataset', chalk.green('ok'));
    console.log('Working...');

    const workBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    workBar.start(preparedWorkData.length, 0);

    const resultData = preparedWorkData.reduce((acc, item, arrayIndex) => {
      const { input, index } = item;

      workBar.update(arrayIndex + 1);

      return {
        ...acc,
        [index]: network.run(input).price * refs.price
      };
    }, {});

    workBar.stop();
    
    return writeCSV('result.csv', resultData);
  })
  .then(() => {
    console.log(chalk.green('Done!'));
  })
  .catch(() => {
    console.log(chalk.red('Some error occurred!'));
  });

console.log('Awaiting for input...');