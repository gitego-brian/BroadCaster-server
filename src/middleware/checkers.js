import bcrypt from 'bcrypt';
import { sendError } from '../helpers/senders';
import { queryDB } from '../db/dbConfig';
import { findRecord } from '../helpers/finders';
import { debugError } from '../config/debug';
import notifySlack from '../config/slack';

export const checkSignup = async (req, res, next) => {
  const match = (await queryDB(res, 'select email from users where email=$1', [req.body.email]))[0];
  if (match) sendError(res, 409, 'Email already exists');
  else next();
};

export const checkLogin = async (req, res, next) => {
  const [user] = await queryDB(res, 'select * from users where email = $1', [req.body.email]);
  if (!user) {
    sendError(res, 404, "User doesn't exist");
  } else {
    try {
      const password = bcrypt.compareSync(req.body.password, user.password);
      if (!password) {
        sendError(res, 401, 'Incorrect password');
      } else {
        req.user = user;
        next();
      }
    } catch (error) {
      await notifySlack(`Bcrypt compare error: ${error.message}, ${error.stack}`);
      debugError(error);
      sendError(res, 500, 'Server Error');
    }
  }
};

export const checkRecord = async (req, res, next) => {
  const { id, isAdmin } = req.payload;
  const { id: recordID } = req.params;
  const record = await findRecord(res, recordID, isAdmin, id);
  if (!record) sendError(res, 404, 'Record not found');
  else {
    req.record = record;
    next();
  }
};
