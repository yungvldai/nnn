const booleanType = {
  'Yes': 1,
  'No': 0
};

const districtsEnum = {
  'Centralnyj': 0,
  'Kirovskij': 0,
  'Krasnoselskij': 0,
  'Moskovskij': 0,
  'Nevskij': 0,
  'Petrogradskij': 0,
  'Vyborgskij': 0
};

const extraAreaEnum = {
  'balcony': 0,
  'loggia': 0
};

const castValue = (value) => {
  const numberized = Number(value);

  if (!Number.isNaN(numberized)) {
    return numberized;
  }

  if (value in booleanType) {
    return booleanType[value];
  }

  if (value in districtsEnum) {
    return {
      ...districtsEnum,
      [value]: 1
    };
  }

  if (value in extraAreaEnum) {
    return {
      ...extraAreaEnum,
      [value]: 1
    }
  }

  return value;
}

const parse = item => {
  return Object.entries(item).reduce((acc, [key, value]) => {
    const casted = castValue(value);

    return { 
      ...acc,
      ...(typeof casted === 'object' ? {
        ...casted
      } : {
        [key]: casted
      })
    };
  }, {});
}

module.exports = parse;