const { response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    let usuario = await Usuario.findOne({ email });

    console.log("Usuario", usuario);

    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: "Ese correo ya está registrado",
      });
    }
    usuario = new Usuario(req.body);

    // Encriptar la contraseña
    const salt = bcrypt.genSaltSync(10);
    usuario.password = bcrypt.hashSync(password, salt);

    await usuario.save();

    // Generar el JWT
    const token = await generarJWT(usuario.id, usuario.name);

    res.status(201).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error al crear el usuario, Hable con el Admiistrador",
    });
  }
};

const loginUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "El correo no existe con ese email",
      });
    }

    // Validar la contraseña
    const validPassword = bcrypt.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Contraseña incorrecta",
      });
    }

    // Generar el JWT
    const token = await generarJWT(usuario.id, usuario.name);

    res.json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token,
    });
  } catch {
    res.status(500).json({
      ok: false,
      msg: "Error al iniciar sesión, Hable con el Admiistrador",
    });
  }

  res.status(201).json({
    ok: true,
    msg: "login",
    email,
    password,
  });
};

const revalidarToken = async (req, res = response) => {
  const { uid, name } = req;

  // Generar el JWT y retornarlo en esta peticion
  const token = await generarJWT(uid, name);

  res.json({
    ok: true,
    token,
  });
};

module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken,
};
