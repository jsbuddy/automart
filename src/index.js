import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import api from './api';

const app = express();
const port = process.env.PORT || 2999;
const dev = app.get('env') !== 'production';

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (dev) {
  app.use(morgan('dev'));
  app.use(cors({ origin: '*' }));
} else {
  app.use(morgan('common'));
}

app.use('/api', api);

app.use((err, req, res, next) => {
  if (err.isBoom) {
    return res.status(err.output.statusCode).json(err.data[0].message);
  }
  return next(err);
});

app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
