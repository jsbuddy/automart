function capitalize(str) {
  return `${str.substring(0, 1).toUpperCase()}${str.substring(1, str.length).toLowerCase()}`
}

function formatDate(d) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
  const date = new Date(d);
  return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
}

function update(array, data) {
  return array.map(item => {
    if (item.id === data.id) return data;
    return item;
  });
}

function transformData(data) {
  const is = (type, obj) => {
    const _class = Object.prototype.toString.call(obj).slice(8, -1);
    return obj !== undefined && obj !== null && _class === type;
  };

  const snakeToCamel = string => string.replace(/(_\w)/g, m => m[1].toUpperCase());

  const convert = obj => Object.keys(obj).reduce((result, key) => {
    if (is('Object', obj[key])) result[snakeToCamel(key)] = convert(obj[key]);
    else result[snakeToCamel(key)] = obj[key];
    return result;
  }, {});

  if (is('Array', data)) data = data.map(item => convert(item));
  else data = convert(data);
  return data;
}