// This function was created based on a refactoring to remove duplicate codes found by codeclimate

function send(res, code, data) {
  return res.status(code).json(data);
}

export function unauthorized(res, message = 'Unauthorized') {
  return send(res, 401, { success: false, message });
}

export function notallowed(res, message = 'Not allowed') {
  return send(res, 405, { success: false, message });
}

export function notfound(res, message = 'Not found') {
  return send(res, 404, { success: false, message });
}

export function success(res, message, data) {
  return send(res, 200, { success: true, message, ...data });
}

export function created(res, message, data) {
  return send(res, 201, { success: true, message, ...data });
}
