import sendMail, {
  updateEmailTemplate, recoveryEmailTemplate, feedbackEmailTemplate,
} from '../config/mailerConfig';
import upload from '../config/cloudConfig';

export const sendEmail = async (to, name, title, status) => {
  const html = updateEmailTemplate(name, status, title);
  const msg = {
    from: '"BroadCaster" <noreply.webcast@gmail.com>',
    to,
    subject: 'Update from Broadcaster',
    html,
  };
  const res = await sendMail(msg);
  return res;
};

export const recoveryEmail = async (to, name, pwd) => {
  const html = recoveryEmailTemplate(name, pwd);
  const msg = {
    from: '"BroadCaster" <noreply.webcast@gmail.com>',
    to,
    subject: 'Recover your password',
    html,
  };
  const res = await sendMail(msg);
  return res;
};

export const feedbackSender = async (email, name, feedback) => {
  const html = feedbackEmailTemplate(name, email, feedback);
  const msg = {
    from: '"BroadCaster" <noreply.webcast@gmail.com>',
    to: 'gitegob7@gmail.com',
    subject: 'Feedback from Broadcaster',
    html,
  };
  const res = await sendMail(msg);
  return res;
};

export const uploadFile = async (req) => {
  const { dp = '' } = req.files || {};
  const pic = Array.isArray(dp) ? dp[0] : dp;
  const cloudFile = await upload(pic);
  return cloudFile;
};
