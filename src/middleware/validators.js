import schema from '../models/schema';
import { sendError } from '../helpers/senders';
import { checkJoiError } from '../helpers/helpers';

export const validateSignup = (req, res, next) => {
  const {
    firstName, lastName, email, password,
  } = req.body;
  const { error } = schema.signupSchema.validate({
    firstName,
    lastName,
    email,
    password,
  });
  checkJoiError(error, res, next);
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const { error } = schema.loginSchema.validate({
    email,
    password,
  });
  checkJoiError(error, res, next);
};

export const validateRecord = (req, res, next) => {
  const {
    title, type, description, district, sector, cell,
  } = req.body;
  const { error } = schema.recordSchema.validate({
    title,
    type,
    description,
    district,
    sector,
    cell,
  });
  if (req.method === 'PATCH') {
    if (
      error
          && (error.details[0].type === 'string.pattern.base' || error.details[0].type === 'any.only')
    ) checkJoiError(error, res, next);
    else next();
  } else checkJoiError(error, res, next);
};

export const validateParams = (req, res, next) => {
  const { id } = req.params;
  if (id && (Number.isNaN(Number(id)) || Number(id) > 10000)) return sendError(res, 400, 'Invalid parameters');
  next();
};
export const validateQueryParams = (req, res, next) => {
  const { type, page } = req.query;

  if (type) {
    if (type !== 'int') {
      if (type !== 'red') return sendError(res, 400, 'Invalid query parameters');
    }
  }
  if (page) {
    if (!Number.isInteger(Number(page))) return sendError(res, 400, 'Invalid query parameters');
    if (Number(page) > 1000) return sendError(res, 400, 'Invalid query parameters');
  }
  next();
};

export const validateStatus = (req, res, next) => {
  const { status } = req.body;
  const { error } = schema.statusSchema.validate({ status });
  checkJoiError(error, res, next);
};
