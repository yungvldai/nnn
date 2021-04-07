const { curry, compose } = require('./fp');
const { omit: _omit } = require('./utils');

const INDEX_FIELD = 'index';
const OUTPUT_FIELD = 'price';

const LIMITING_IGNORE_FIELDS = [INDEX_FIELD];

const omit = curry(_omit);

const getReferences = (data) => {
  return data.reduce((acc, item) => {
    const localAccCopy = { ...acc };
    Object.entries(item).forEach(([key, value]) => {
      if (key in localAccCopy) {
        if (value > localAccCopy[key]) {
          localAccCopy[key] = value;
        }

        return;
      }

      localAccCopy[key] = value;
    });
    return localAccCopy;
  }, {});
}

const limit = curry((refs, item) => {
  return Object.entries(item).reduce((acc, [key, value]) => {
    return {
      ...acc,
      ...(LIMITING_IGNORE_FIELDS.includes(key) ? {
        [key]: value,
        [`${key}_limited`]: value / refs[key]
      } : {
        [key]: value / refs[key]
      })
    }
  }, {}); 
});

const split = curry((options, item) => {
  const { indexes = false } = options;

  return {
    input: omit([OUTPUT_FIELD, INDEX_FIELD], item),
    output: {
      [OUTPUT_FIELD]: item[OUTPUT_FIELD]
    },
    ...(indexes && {
      index: item[INDEX_FIELD]
    })
  };
});

const getOptimizedDataset = (data, refs, splitOptions = {}) => {
  const mapper = compose(split(splitOptions), limit(refs));

  return data.map(mapper);
}

module.exports = {
  getOptimizedDataset,
  getReferences
};