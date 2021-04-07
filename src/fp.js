const curry = (fn) => {
  const curried = (...args) => {
    return args.length >= fn.length
      ? fn.apply(null, args)
      : (...needed) => curried.apply(null, [ ...args, ...needed ]);
  };
  return curried;
}

const compose = (...fns) =>
  fns.reduceRight((prevFn, nextFn) =>
    (...args) => nextFn(prevFn(...args)),
    (value) => value
  );

module.exports = {
  curry,
  compose
};