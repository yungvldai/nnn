const omit = (fields, object) => {
  const objectCopy = { ...object };
  fields.forEach(field => {
    delete objectCopy[field];
  });

  return objectCopy;
}

module.exports = {
  omit
};