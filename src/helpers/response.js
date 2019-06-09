// This function was created based on a refactoring to remove duplicate codes found by codeclimate
// eslint-disable-next-line import/prefer-default-export
export function unauthorized(res, message = 'Unauthorized') {
  return res.status(401).json({ success: false, message });
}
