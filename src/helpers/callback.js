import { notfound, success } from './response';

export async function handleCreate(Model, data, res, field) {
  res.status(201).json({ success: true, [field]: await Model.create(data) });
}

export async function handleDelete(req, res, Model, field) {
  const { id } = req.params;
  await Model.delete(id);
  return success(res, `${field} deleted successfully`, { success: true });
}

export async function handleGetOne(req, res, Model, field) {
  const { id } = req.params;
  const data = await Model.findOne(id);
  if (!data) return notfound(res, `${field} not found`);
  return success(res, undefined, { [field]: data });
}

export async function getAllBy(req, res, Model, field) {
  const id = req.params.id || req.user.id;
  const data = await Model.findAllByUser(id);
  success(res, undefined, { [field]: data });
}
