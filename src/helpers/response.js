// This function was created based on a refactoring to remove duplicate codes found by codeclimate
export function unauthorized(res, message = 'Unauthorized') {
  return res.status(401).json({ success: false, message });
}

export function notfound(res, message = 'Not found') {
  return res.status(404).json({ success: false, message });
}
