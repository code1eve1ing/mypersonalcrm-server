const service = require("../services/auth.service");

exports.signup = service.signup;
exports.login = service.login;
exports.getUserDetails = service.getUserDetails;