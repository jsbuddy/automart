import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

const port = process.env.PORT || 2999;

const app = express();
const dev = app.get('env') !== 'production';

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (dev) {
  app.use(morgan('dev'));
  app.use(cors({ origin: '*' }));
} else {
  app.use(morgan('common'));
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = app;
