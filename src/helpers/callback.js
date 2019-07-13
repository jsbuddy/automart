import { notfound, success } from './response';
import { transformData } from '.';

export async function handleCreate(Model, data, res) {
  res.status(201).json({
    status: 201, success: true, data: transformData({ ...await Model.create(data) }),
  });
}

export async function handleDelete(req, res, Model) {
  const { id } = req.params;
  await Model.delete(id);
  return success(res, 'Deleted successfully');
}

export async function handleGetOne(req, res, Model) {
  const { id } = req.params;
  const data = await Model.findOne(id);
  if (!data) return notfound(res, 'Not found');
  return success(res, undefined, data);
}

export async function getAllBy(req, res, Model) {
  const id = req.params.id || req.user.id;
  const data = await Model.findAllByUser(id);
  success(res, undefined, data);
}
