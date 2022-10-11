const CustomersRoutes = require("express").Router();
const { authorize } = require("../../middleware/auth");
const upload = require("../../middleware/file");

const {
  crear,
  customerByID,
  update,
  remove,
  getAllCustomers,
} = require("./customers.controller");


CustomersRoutes.post("/crear", upload.single("avatar"), crear);
CustomersRoutes.get("/getall", getAllCustomers);
CustomersRoutes.get("/:id", customerByID);
CustomersRoutes.patch("/:id", upload.single("avatar"), update);
CustomersRoutes.delete("/:id", remove);

module.exports = CustomersRoutes;
