const {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} = require("../../controllers/contactController");
const {
  joiContactSchema,
  joiIdSchema,
} = require("../../validators/contactValidator");

const contactRoutes = [
  // GET /api/contacts – list all
  {
    method: "GET",
    path: "/api/contacts",
    handler: async (request, h) => {
      const result = await getAllContacts();
      if (!result.success) return h.response(result).code(500);
      return h.response(result).code(200);
    },
  },

  // GET /api/contacts/{id} – get one
  {
    method: "GET",
    path: "/api/contacts/{id}",
    options: {
      validate: {
        params: joiIdSchema,
        failAction: (request, h, err) => {
          const errors = err.details.map((d) => ({
            field: d.context.key,
            message: d.message,
          }));
          return h.response({ success: false, errors }).code(400).takeover();
        },
      },
    },
    handler: async (request, h) => {
      const result = await getContactById(request.params.id);
      return h.response(result).code(result.status || 200);
    },
  },

  // POST /api/contacts – create
  {
    method: "POST",
    path: "/api/contacts",
    options: {
      validate: {
        payload: joiContactSchema,
        failAction: (request, h, err) => {
          const errors = err.details.map((d) => ({
            field: d.context.key,
            message: d.message,
          }));
          return h.response({ success: false, errors }).code(400).takeover();
        },
      },
    },
    handler: async (request, h) => {
      const result = await createContact(request.payload);
      return h.response(result).code(result.status || 500);
    },
  },

  // PUT /api/contacts/{id} – update
  {
    method: "PUT",
    path: "/api/contacts/{id}",
    options: {
      validate: {
        params: joiIdSchema,
        payload: joiContactSchema,
        failAction: (request, h, err) => {
          const errors = err.details.map((d) => ({
            field: d.context.key,
            message: d.message,
          }));
          return h.response({ success: false, errors }).code(400).takeover();
        },
      },
    },
    handler: async (request, h) => {
      const result = await updateContact(request.params.id, request.payload);
      return h.response(result).code(result.status || 200);
    },
  },

  // DELETE /api/contacts/{id} – delete
  {
    method: "DELETE",
    path: "/api/contacts/{id}",
    options: {
      validate: {
        params: joiIdSchema,
        failAction: (request, h, err) => {
          const errors = err.details.map((d) => ({
            field: d.context.key,
            message: d.message,
          }));
          return h.response({ success: false, errors }).code(400).takeover();
        },
      },
    },
    handler: async (request, h) => {
      const result = await deleteContact(request.params.id);
      return h.response(result).code(result.status || 200);
    },
  },
];

module.exports = contactRoutes;
