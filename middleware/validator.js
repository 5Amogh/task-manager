const mongoose = require('mongoose');

function validateBody(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { stripUnknown: true, abortEarly: false });
    if (error) {
      const details = error.details.map(d => d.message);
      return res.status(400).json({ error: 'Validation failed', details });
    }
    req.validatedBody = value;
    next();
  };
}

function checkIfTaskExists(req,res,next) {
    const { id }  = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid Task Id' });
    }

    next();
}

const VALID_STATUSES = ['pending', 'in-progress', 'completed', 'cancelled'];
function validateStatusParam(req, res, next) {
  const { status } = req.params;

  if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Invalid status parameter' });
  }

  return next();
}

module.exports = { validateBody , checkIfTaskExists, validateStatusParam};
