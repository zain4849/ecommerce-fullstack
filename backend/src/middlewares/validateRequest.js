export const validateRequest = (schema, source = "body") => {
  return (req, res, next) => {
    // We could've done req.body but info can come from req.query or req.params too, so we make it dynamic with [source]
    const { error, value } = schema.validate(req[source], { 
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.details.map((item) => item.message),
      });
    }

    req[source] = value;
    next();
  };
};
