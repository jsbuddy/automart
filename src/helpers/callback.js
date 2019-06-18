import { success } from './response';

export async function handleCreate(Model, data, res, field) {
  res.status(201).json({ success: true, [field]: await Model.create(data) });
}

export async function handleDelete(req, res, Model, field) {
  const { id } = req.params;
  await Model.delete(id);
  return success(res, `${field} deleted successfully`, { success: true });
}
