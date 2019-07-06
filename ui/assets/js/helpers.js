function capitalize(str) {
  return `${str.substring(0, 1).toUpperCase()}${str.substring(1, str.length).toLowerCase()}`
}

function formatDate(d) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
  const date = new Date(d);
  return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
}