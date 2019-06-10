// This function was created based on a refactoring to remove duplicate codes found by codeclimate

function send(res, code, data) {
  return res.status(code).json(data);
}

export function unauthorized(res, message = 'Unauthorized') {
  return send(res, 401, { success: false, message });
}

export function notfound(res, message = 'Not found') {
  return send(res, 404, { success: false, message });
}
