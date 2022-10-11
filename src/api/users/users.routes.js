const PetuserRoutes = require("express").Router();
const { authorize } = require("../../middleware/auth");
const upload = require("../../middleware/file");

const {
  register,
  login,
  petuserByID,
  update,
  remove,
  getAllPetusers,
} = require("./users.controller");

PetuserRoutes.post("/login", login);
PetuserRoutes.post("/register", upload.single("avatar"), register);
PetuserRoutes.get("/getall", getAllPetusers);
PetuserRoutes.get("/:id",  petuserByID);
PetuserRoutes.patch("/:id", upload.single("avatar"), update);
PetuserRoutes.delete("/:id",  remove);

module.exports = PetuserRoutes;
