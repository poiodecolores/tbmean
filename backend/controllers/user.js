import user from "../models/user.js";
import role from "../models/role.js";
import bcrypt from "bcrypt";

const registerUser = async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password)
    return res.status(400).send({ message: "Incomplete data" });

  const existingUser = await user.findOne({ email: req.body.email });
  if (existingUser)
    return res.status(400).send({ message: "The user is already registered" });
//es un password encriptado, 10 codigo que recomienda el hash para tomar 10 caracteres  al azar y arme la contraseña encriptada , el mismo hash lo recomienda , ese código encriptado, hash un tipo de encriptacion que existe como unas reglas
  const passHash = await bcrypt.hash(req.body.password, 10);

  //necesita asignar el role de user
  const roleId = await role.findOne({ name: "user" });
  if (!role) return res.status(400).send({ message: "No role was assigned" });
//se cre ael esquema que se va a guardar , el nombre del usuario,correo etc
  const userRegister = new user({
    name: req.body.name,
    email: req.body.email,
    password: passHash,//aqui llega el código encriptado
    roleId: roleId,//el role id que le asignamos
    dbStatus: true,
  });

  const result = await userRegister.save();
  return !result
    ? res.status(400).send({ message: "Failed to register user" })
    : res.status(200).send({ result });
};

const registerAdminUser = async (req, res) => {
  if (
    !req.body.name ||
    !req.body.email ||
    !req.body.password ||
    !req.body.roleId
  )
    return res.status(400).send({ message: "Incomplete data" });

  const existingUser = await user.findOne({ email: req.body.email });
  if (existingUser)
    return res.status(400).send({ message: "The user is already registered" });

  const passHash = await bcrypt.hash(req.body.password, 10);

  const userRegister = new user({
    name: req.body.name,
    email: req.body.email,
    password: passHash,
    roleId: req.body.roleId,
    dbStatus: true,
  });

  const result = await userRegister.save();
  return !result
    ? res.status(400).send({ message: "Failed to register user" })
    : res.status(200).send({ result });
};

const listUsers = async (req, res) => {
  const userList = await user.find();
  return userList.length === 0
    ? res.status(400).send({ message: "Empty users list" })
    : res.status(200).send({ userList });
};

const findUser = async (req, res) => {
  const userfind = await user.findById({ _id: req.params["_id"] });
  return !userfind
    ? res.status(400).send({ message: "No search results" })
    : res.status(200).send({ userfind });
};

const updateUser = async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.roleId)//si no esta el password aca, es porque es un dato obligatorio
    return res.status(400).send({ message: "Incomplete data" });

  const changeEmail = await user.findById({ _id: req.body._id });
  if (req.body.email !== changeEmail.email)//el correo que llego es diferente al que esta dentro del json de la base de datos
    return res
      .status(400)
      .send({ message: "The email should never be changed" });

      //como no cambiaron la ontraseña
      //el password que estaba o el que cambiaron
      //un string vacio
      //siempre hay que declarar las variables con un parametro
      //porque tenemos dos opciones registre la de antes o la nueva
  let pass = "";

  if (req.body.password) {
    pass = await bcrypt.hash(req.body.password, 10);
  } else {
    const userFind = await user.findOne({ email: req.body.email });
    pass = userFind.password;
  }

  const existingUser = await user.findOne({
    name: req.body.name,
    email: req.body.email,
    password: pass,
    roleId: req.body.roleId,
  });
  if (existingUser)
    return res.status(400).send({ message: "you didn't make any changes" });

  const userUpdate = await user.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    email: req.body.email,
    password: pass,
    roleId: req.body.roleId,
  });

  return !userUpdate
    ? res.status(400).send({ message: "Error editing user" })
    : res.status(200).send({ message: "User updated" });
};

const deleteUser = async (req, res) => {
  const userDelete = await user.findByIdAndDelete({ _id: req.params["_id"] });
  return !userDelete
    ? res.status(400).send({ message: "User no found" })
    : res.status(200).send({ message: "User deleted" });
};

const login = async (req, res) => {
  if (!req.body.email || !req.body.password)
    return res.status(400).send({ message: "Incomplete data" });

  const userLogin = await user.findOne({ email: req.body.email });
  if (!userLogin)
    return res.status(400).send({ message: "Wrong email" });//wrong equivocado

  const hash = await bcrypt.compare(req.body.password, userLogin.password);
  if (!hash)
    return res.status(400).send({ message: "Wrong password" });

  return !userLogin
    ? res.status(400).send({ message: "User no found" })
    : res.status(200).send({ userLogin });
};

export default {
  registerUser,
  registerAdminUser,
  listUsers,
  findUser,
  updateUser,
  deleteUser,
  login,
};
