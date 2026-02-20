const express = require("express");
const router = express.Router();
const {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} = require("../../controllers/contactController");
const {
  expressContactRules,
  expressIdRule,
  expressValidate,
} = require("../../validators/contactValidator");

// GET /api/contacts – list all contacts
router.get("/", async (req, res) => {
  const result = await getAllContacts();
  if (!result.success) return res.status(500).json(result);
  res.json(result);
});

// GET /api/contacts/:id – get one contact
router.get("/:id", expressIdRule(), expressValidate, async (req, res) => {
  const result = await getContactById(req.params.id);
  res.status(result.status || 200).json(result);
});

// POST /api/contacts – create contact
router.post(
  "/",
  expressContactRules(),
  expressValidate,
  async (req, res) => {
    const result = await createContact(req.body);
    res.status(result.status || 500).json(result);
  }
);

// PUT /api/contacts/:id – update contact
router.put(
  "/:id",
  [...expressIdRule(), ...expressContactRules()],
  expressValidate,
  async (req, res) => {
    const result = await updateContact(req.params.id, req.body);
    res.status(result.status || 200).json(result);
  }
);

// DELETE /api/contacts/:id – delete contact
router.delete("/:id", expressIdRule(), expressValidate, async (req, res) => {
  const result = await deleteContact(req.params.id);
  res.status(result.status || 200).json(result);
});

module.exports = router;
