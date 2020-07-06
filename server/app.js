import express from 'express';
import { json, urlencoded } from 'body-parser';
import { config } from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import Helpers from './v1/helpers/helpers';
import userRoutes from './v1/routes/userRoutes';
import recordRoutes from './v1/routes/recordRoutes';
import Admin from './v1/models/adminModel';
import { users } from './v1/data/data';

config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(json());
app.use(
  urlencoded({
    extended: false,
  }),
);
app.use(morgan('dev'));
app.get('/', (_req, res) => {
  Helpers.sendSuccess(res, 200, `Welcome to BroadCaster ${process.env.NODE_ENV} mode`);
});

app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/records', recordRoutes);
app.use('/*', (_req, res) => {
  Helpers.sendError(res, 404, 'Not Found');
});

app.use((error, _req, res, _next) => {
  Helpers.sendError(res, error.status || 500, `SERVER DOWN!: ${error.message}`);
});

app.listen(port, () => {
  const { A_FNAME, A_LNAME, A_EMAIL, A_PASSWORD } = process.env;
  const admin = new Admin(A_FNAME, A_LNAME, A_EMAIL, A_PASSWORD);
  users.push(admin);
  process.stdout.write(`\nConnected on ${port}\n`);
});

export default app;
