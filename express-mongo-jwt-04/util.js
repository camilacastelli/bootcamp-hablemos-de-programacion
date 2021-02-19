const createError = require("http-errors");
const lodash = require("lodash");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

const manejadorDeErrores = ({ error, next }) => {
  let err = null;
  switch (error.name) {
    case "ValidationError":
      const errors = Object.entries(error.errors)
        .map((elementoError) => {
          const mensaje = lodash.get(elementoError, "1.message", "");
          return mensaje;
        })
        .join(" ");
      err = new createError[400](errors);
      break;
    default:
      err = new createError[500](error.message);
  }
  return next(err);
};

const removerPaswordDeRespuestas = (objeto) => {
  if (!(typeof objeto.toJSON === "function"))
    throw new Error("no es instancia de mongoose");
  objeto = objeto.toJSON();
  const { password, ...resto } = objeto;
  return resto;
};

const estaAutenticado = (req, res, next) => {
  let auth = lodash.get(req, "headers.authorization", null);
  if (!auth && auth.length) {
    const err = new createError.Unauthorized("Falta el token");
    return next(err);
  }
  const [_bearer, token] = auth.split(" ");
  console.log({ auth, _bearer, token });
  jwt.verify(token, SECRET_KEY, (error, decoded) => {
    if (error) {
      console.log(JSON.stringify({ error }, null, 2));
      const err = new createError[500]("error al verificar token");
      return next(err);
    }
    if (decoded) {
      console.log({ decoded });
      next();
    }
  });
};

module.exports = {
  manejadorDeErrores,
  removerPaswordDeRespuestas,
  estaAutenticado,
};
