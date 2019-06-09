// This function was created based on a refactoring to remove duplicate codes found by codeclimate
// eslint-disable-next-line import/prefer-default-export
export function handleCreate(Model, data, res, field) {
  res.status(201).json({ success: true, [field]: Model.create(data) });
}
