import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import api from './api';
import swagger from './docs/swagger';
import { transform } from './middlewares';

const app = express();
const port = process.env.PORT || 2999;
const dev = app.get('env') !== 'production';

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors({ origin: '*' }));
if (dev) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('common'));
}

app.use(transform);

app.use('/docs', swagger);
app.use('/api', api);

app.use(express.static(path.resolve(__dirname, '../ui')));
app.get('/ui', (req, res) => res.sendFile(path.resolve(__dirname, 'build', '../ui/index.html')));

app.all('*', (req, res) => res.status(404).json({ success: false, error: 'Unknown resource endpoint' }));

app.use((err, req, res, next) => {
  console.log({ err });
  if (err.isBoom) {
    return res.status(err.output.statusCode).json({
      status: err.output.statusCode, error: err.data[0].message,
    });
  }
  return next(err);
});

app.use((err, req, res) => res.status(500).json({ status: 500, error: err }));

app.listen(port, () => console.log(`Listening on port ${port}`));

export default app;
