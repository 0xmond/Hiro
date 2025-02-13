import { Types } from "mongoose";
import { User } from "../../db/models/index.js";
import { sendEmail } from "../../utils/email/index.js";
import { Skills, Roles } from "../../utils/enum/index.js";
import { compare, hash } from "../../utils/hash/index.js";
import { entityMessages, fieldMessages } from "../../utils/messages/index.js";
import { generateToken, verifyToken } from "../../utils/token/index.js";

export const localhost = "http://localhost:3000";
export const frontend = "https://hiro-one.vercel.app";
export const host = "http://hiro.eu-4.evennode.com";

// employee and job seeker register
export const employeeRegister = async (req, res, next) => {
  // parse data from request
  const { username, email, phone, password, firstName, lastName, dob, gender } =
    req.body;

  // insert user to db
  const user = await User.create({
    profileId: new Types.ObjectId(),
    username,
    email,
    phone,
    password: hash({ data: password }),
    firstName,
    lastName,
    dob,
    gender,
    role: Roles.EMPLOYEE,
  });

  // generate token
  const token = generateToken({
    payload: {
      _id: user._id,
      email: user.email,
    },
    options: {
      expiresIn: "3m",
    },
  });

  // send confirm email
  const isSent = await sendEmail({
    to: email,
    subject: "Email Confirmation",
    html: `<h1>Thanks for trusting us</h1><br><p>To activate your account, please click <a href="${host}/auth/confirm?token=${token}">here</a></p>`,
  });

  if (!isSent) return next(new Error("Please try again later", { cause: 500 }));

  // remove password from request data
  req.body.password = undefined;

  // send success response
  return res.status(201).json({
    success: true,
    message: fieldMessages.checkInbox,
    data: req.body,
  });
};

// company register
export const companyRegister = async (req, res, next) => {
  const { username, email, phone, password, companyName, address } = req.body;

  // create user
  const user = await User.create({
    profileId: new Types.ObjectId(),
    username,
    email,
    phone,
    role: Roles.COMPANY,
    password: hash({ data: password }),
    companyName,
    address,
  });

  // generate token
  const token = generateToken({
    payload: {
      _id: user._id,
      email: user.email,
    },
    options: {
      expiresIn: "3m",
    },
  });

  const isSent = await sendEmail({
    to: email,
    subject: "Email Confirmation",
    html: `<h1>Thanks for trusting us</h1><br><p>To activate your account, please click <a href="${host}/auth/confirm?token=${token}">here</a></p>`,
  });

  if (!isSent) return next(new Error("Please try again later", { cause: 500 }));

  req.body.password = undefined;
  // send success response
  return res.status(201).json({
    success: true,
    message: fieldMessages.checkInbox,
    data: req.body,
  });
};

// email confirmation
export const emailConfirm = async (req, res, next) => {
  // parse token
  const { token } = req.query;

  // verify token
  const payload = verifyToken({ token });

  // check user existence and update if exists
  const user = await User.findByIdAndUpdate(payload._id, { isConfirmed: true });

  // if payload is not valid
  if (!user) return next(new Error("Invalid token", { cause: 400 }));

  // send success response
  return res
    .status(200)
    .json({ success: true, message: fieldMessages.isConfirmed });
};

// resend confirmation email
export const resendConfirmEmail = async (req, res, next) => {
  // parse email
  const { email } = req.body;

  // check if user exist
  const user = await User.findOne({ email }, { password: 0 });

  if (!user)
    return res.status(200).json({
      success: true,
      message: fieldMessages.checkInbox,
    });

  // if email is already confirmed
  if (user.isConfirmed)
    return next(new Error("This email is already confirmed", { cause: 409 }));

  // generate token
  const token = generateToken({
    payload: {
      _id: user._id,
      email: user.email,
    },
    options: {
      expiresIn: "3m",
    },
  });

  // send confirm email
  const isSent = await sendEmail({
    to: email,
    subject: "Email Confirmation",
    html: `<h1>Thanks for trusting us</h1><br><p>To activate your account, please click <a href="${host}/auth/confirm?token=${token}">here</a></p>`,
  });

  // check if the email is not sent successfully
  if (!isSent) return next(new Error("Please try again later", { cause: 500 }));

  // send success response
  return res.status(200).json({
    success: true,
    message: fieldMessages.checkInbox,
  });
};

// login
export const login = async (req, res, next) => {
  // parse request data
  const { email, username, password } = req.body;

  // find user
  let user;
  if (!email) user = await User.findOne({ username });
  else {
    user = await User.findOne({ email });
  }

  // check if user not exists
  if (!user || !compare({ data: password, hashedData: user.password }))
    return next(
      new Error(
        email
          ? "Email or password is not correct"
          : "Username or password is not correct",
        { cause: 401 }
      )
    );

  if (!user.isConfirmed)
    return next(new Error("Please confirm your email first.", { cause: 401 }));

  // generate token
  const token = generateToken({
    payload: { _id: user._id, email: user.email, role: user.role },
  });

  // send success response
  return res
    .status(200)
    .json({ success: true, message: "Logged in successfully", token });
};

// request password reset
export const requestPasswordReset = async (req, res, next) => {
  // parse request data
  const { email } = req.body;

  const user = await User.findOne({ email }, { _id: 1, email: 1 });

  // check user existence
  const responseMessage =
    "If this email exists, you will get password reset email in your inbox.";
  if (!user) return next(new Error(responseMessage, { cause: 200 }));

  // generate reset token
  const token = generateToken({ payload: { _id: user._id, email } });

  // send password reset email
  const isSent = await sendEmail({
    to: email,
    subject: "Password reset",
    html: `<h1>Thanks for trusting us</h1><br><p>To reset your password, please click <a href="${frontend}/password-reset?token=${token}">here</a></p>`,
  });

  // check if email is not have been sent
  if (!isSent) return next(new Error("Please try again later", { cause: 500 }));

  // return success response
  return res.status(200).json({ success: true, message: responseMessage });
};

// password reset
export const passwordReset = async (req, res, next) => {
  // parse request data
  const { token } = req.query;
  const { newPassword } = req.body;

  // verify token and get payload if verified
  const payload = verifyToken({ token });

  // update user password
  const user = await User.findByIdAndUpdate(
    payload._id,
    {
      password: hash({ data: newPassword }),
    },
    {
      new: true,
    }
  );

  // if token is not valid
  if (!user) return next(new Error(fieldMessages.invalidToken, { cause: 400 }));

  // send success response
  return res
    .status(200)
    .json({ success: true, message: entityMessages.user.updatedSuccessfully });
};
