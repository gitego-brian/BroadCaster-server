import bcrypt from 'bcrypt';
import Helpers from '../helpers/helpers';
import { users } from '../data/data';
import User from '../models/userModel';

class UserController {
  static signup(req, res) {
    const { firstName, lastName, email, password, userName, phone } = req.body;
    const newUser = new User(
      firstName.replace(/\s+/, ' ').trim(),
      lastName.replace(/\s+/, ' ').trim(),
      email,
      password,
      userName,
      phone,
    );
    Helpers.sendSuccess(res, 201, 'User created successfully', {
      token: Helpers.genToken(newUser),
    });
    users.push(newUser);
  }
  static getProfile = (req, res) => {
    Helpers.sendSuccess(res, 200, 'Profile retrieved successfully', { userData: req.payload });
  };
  static signin(req, res) {
    const { email } = req.body;
    const user = users.find((el) => el.email === email);
    if (user.isAdmin) {
      Helpers.sendSuccess(res, 200, 'Admin logged in successfully', {
        token: Helpers.genToken(user),
      });
    } else {
      Helpers.sendSuccess(res, 200, 'User logged in successfully', {
        token: Helpers.genToken(user),
      });
    }
  }
}

export default UserController;
