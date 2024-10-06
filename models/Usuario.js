const { Schema, model } = require("mongoose");

const UsuarioSchema = Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

module.exports = model("Usuario", UsuarioSchema); // Exportamos el modelo de Usuario con sus características definidas en el schema.
