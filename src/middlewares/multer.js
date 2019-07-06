import multer from 'multer';
import Datauri from 'datauri';
import path from 'path';

const storage = multer.memoryStorage();

const multerUpload = multer({ storage }).array('images', 5);

const dUri = new Datauri();

const dataUri = file => dUri.format(path.extname(file.originalname).toString(), file.buffer);

export { multerUpload, dataUri };
