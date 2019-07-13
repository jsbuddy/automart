/* eslint-disable no-param-reassign */
const is = (type, obj) => {
  const clas = Object.prototype.toString.call(obj).slice(8, -1);
  return obj !== undefined && obj !== null && clas === type;
};

const camelToSnake = string => string.replace(/[\w]([A-Z])/g, m => `${m[0]}_${m[1]}`).toLowerCase();

const convert = obj => Object.keys(obj).reduce((result, key) => {
  if (is('Object', obj[key])) result[camelToSnake(key)] = convert(obj[key]);
  else result[camelToSnake(key)] = obj[key];
  return result;
}, {});

export function transformData(obj) {
  if (is('Array', obj)) obj = obj.map(data => convert(data));
  else obj = convert(obj);
  return obj;
}
