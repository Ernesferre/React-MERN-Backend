// Events Routes
// /api/events

const { Router } = require("express");
const { validarJWT } = require("../middlewares/validar-jwt");
const {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
} = require("../controllers/events");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { isDate } = require("../helpers/isDate");

const router = Router();

// Todas tienen que pasar por la validacion de JWT
router.use(validarJWT);

// Obtener Eventos
router.get("/", getEventos);

// Crear un nuevo Evento
router.post(
  "/",
  [
    // Middlewares
    check("title", "El titulo es obligatorio").not().isEmpty(),
    check("start", "La fecha de inicio es obligatoria").custom(isDate),
    check("end", "La fecha de finalizacion es obligatoria").custom(isDate),
    validarCampos,
  ],

  crearEvento
);

// Actualizar Evento
router.put("/:id", actualizarEvento);

// Borrar Evento
router.delete("/:id", eliminarEvento);

module.exports = router;
