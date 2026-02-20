const { body, param, validationResult } = require("express-validator");
const Joi = require("joi");

// ─── Express validation middleware ───────────────────────────────────────────

const expressContactRules = () => [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ max: 50 })
    .withMessage("First name cannot exceed 50 characters"),
  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ max: 50 })
    .withMessage("Last name cannot exceed 50 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address"),
  body("country")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 100 })
    .withMessage("Country cannot exceed 100 characters"),
  body("phone")
    .optional({ values: "falsy" })
    .trim()
    .matches(/^(\+?\d{1,4}[-.\s]?)?(\(?\d{1,}\)?[-.\s]?)*\d{1,}$/)
    .withMessage("Please provide a valid phone number"),
  body("about")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 500 })
    .withMessage("About cannot exceed 500 characters"),
];

const expressIdRule = () => [
  param("id").isMongoId().withMessage("Invalid contact ID"),
];

const expressValidate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// ─── Joi schema for Hapi validation ─────────────────────────────────────────

const joiContactSchema = Joi.object({
  firstName: Joi.string().trim().max(50).required().messages({
    "string.empty": "First name is required",
    "any.required": "First name is required",
    "string.max": "First name cannot exceed 50 characters",
  }),
  lastName: Joi.string().trim().max(50).required().messages({
    "string.empty": "Last name is required",
    "any.required": "Last name is required",
    "string.max": "Last name cannot exceed 50 characters",
  }),
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required",
      "any.required": "Email is required",
      "string.email": "Please provide a valid email address",
    }),
  country: Joi.string().trim().max(100).allow("", null).optional().messages({
    "string.max": "Country cannot exceed 100 characters",
  }),
  phone: Joi.string()
    .trim()
    .pattern(/^(\+?\d{1,4}[-.\s]?)?(\(?\d{1,}\)?[-.\s]?)*\d{1,}$/)
    .allow("", null)
    .optional()
    .messages({
      "string.pattern.base": "Please provide a valid phone number",
    }),
  about: Joi.string().trim().max(500).allow("", null).optional().messages({
    "string.max": "About cannot exceed 500 characters",
  }),
});

const joiIdSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid contact ID",
    }),
});

module.exports = {
  expressContactRules,
  expressIdRule,
  expressValidate,
  joiContactSchema,
  joiIdSchema,
};
