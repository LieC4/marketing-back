const ServicesRoutes = require("express").Router();
const { authorize } = require("../../middleware/auth");
const upload = require("../../middleware/file");

const {
  crear,
  serviceByID,
  update,
  remove,
  getAllServices,
} = require("./services.controller");


ServicesRoutes.post("/crear", upload.single("avatar"), crear);
ServicesRoutes.get("/getall", getAllServices);
ServicesRoutes.get("/:id", serviceByID);
ServicesRoutes.patch("/:id", upload.single("avatar"), update);
ServicesRoutes.delete("/:id", remove);

module.exports = ServicesRoutes;