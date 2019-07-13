const snakeToCamel = string => string.replace(/(_\w)/g, m => m[1].toUpperCase());

const convert = obj => Object.keys(obj).reduce((result, key) => {
  // eslint-disable-next-line no-param-reassign
  result[snakeToCamel(key)] = obj[key];
  return result;
}, {});

export function transform(req, res, next) {
  req.body = convert(req.body);
  req.params = convert(req.params);
  req.query = convert(req.query);
  next();
}
