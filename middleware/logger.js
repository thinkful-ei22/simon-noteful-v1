'use strict';

const logConsole = function(req, res, next) {
  const currentDate = new Date();
  console.log(`${currentDate.toLocaleString()} ${req.method} ${req.url}`);
  next();
};

module.exports = logConsole;