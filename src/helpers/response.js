import { transformData } from './index';

function send(res, code, payload) {
  // eslint-disable-next-line no-param-reassign
  if (payload.data) payload.data = transformData(payload.data);
  return res.status(code).json(payload);
}

export function unauthorized(res, message = 'Unauthorized') {
  return send(res, 401, { status: 401, success: false, error: message });
}

export function notallowed(res, message = 'Not allowed') {
  return send(res, 405, { status: 405, success: false, error: message });
}

export function notfound(res, message = 'Not found') {
  return send(res, 404, { status: 404, success: false, error: message });
}

export function success(res, message, data) {
  return send(res, 200, { status: 200, success: true, message, data });
}

export function created(res, message, data) {
  return send(res, 201, { status: 201, success: true, message, data });
}
