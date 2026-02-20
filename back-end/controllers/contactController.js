const Contact = require("../models/Contact");

// Get all contacts
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return { success: true, data: contacts };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Get single contact by ID
const getContactById = async (id) => {
  try {
    const contact = await Contact.findById(id);
    if (!contact) {
      return { success: false, message: "Contact not found", status: 404 };
    }
    return { success: true, data: contact };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Create new contact
const createContact = async (data) => {
  try {
    const contact = await Contact.create(data);
    return { success: true, data: contact, status: 201 };
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e) => ({
        field: e.path,
        message: e.message,
      }));
      return { success: false, errors, status: 400 };
    }
    return { success: false, message: error.message };
  }
};

// Update existing contact
const updateContact = async (id, data) => {
  try {
    const contact = await Contact.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!contact) {
      return { success: false, message: "Contact not found", status: 404 };
    }
    return { success: true, data: contact };
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e) => ({
        field: e.path,
        message: e.message,
      }));
      return { success: false, errors, status: 400 };
    }
    return { success: false, message: error.message };
  }
};

// Delete contact
const deleteContact = async (id) => {
  try {
    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      return { success: false, message: "Contact not found", status: 404 };
    }
    return { success: true, data: {}, message: "Contact deleted" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
};
