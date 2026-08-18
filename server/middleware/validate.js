const { validationResult } = require('express-validator');

/**
 * Validation middleware.
 * Runs after express-validator chains and returns errors if any exist.
 * Usage: router.post('/route', [...validationChains], validate, controller)
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const messages = errors.array().map((err) => err.msg);

    return res.status(400).json({
      success: false,
      error: messages.length === 1 ? messages[0] : messages.join('. '),
      statusCode: 400,
      validationErrors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }

  next();
};

module.exports = validate;
