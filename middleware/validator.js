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

module.exports = { validateBody , checkIfTaskExists };
