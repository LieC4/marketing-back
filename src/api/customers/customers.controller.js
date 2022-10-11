const Customer = require("./customers.model");
const bcrypt = require("bcrypt");
const { createToken } = require("../../helpers/utils/token-action");
const { deleteFile } = require("../../middleware/delete-file");
const { setError } = require("../../helpers/utils/error");

const getAllCustomers = async (req, res, next) => {
  try {
    const customer = await Customer.find();
    return res.status(200).json({
      message: "All Customers",
      customer,
    });
  } catch (error) {
    return next(
      setError(500, error.message | "Failed recovering all customers")
    );
  }
};

const customerByID = async (req, res, next) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);
    if (!customer) return next(setError(404, "User not found"));
    return res.status(200).json(customer);
  } catch (error) {
    return next(setError(500, error.message || "Failed recovering User"));
  }
};

const crear = async (req, res, next) => {
  try {
    const newCustomer = new Customer(req.body);
    const customernameExist = await Customer.findOne({
      username: newCustomer.username,
    });

    if (customernameExist) {
      return next(setError(409, "User already exists"));
    }

    if (req.file) {
      newCustomer.avatar = req.file.path;
    }
    const customerInDB = await newCustomer.save();
    res.status(201).json(customerInDB);
  } catch (error) {
    return next(setError(500, error.message || "Failed creating customer"));
  }
};



const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const customer = new Customer(req.body);
    customer._id = id;
    if (req.file) {
        customer.avatar = req.file.path;
    }
    const updatedCustomer = await Customer.findByIdAndUpdate(id, customer);
    if (!updatedCustomer) return next(setError(404, "customer not found"));
    return res.status(201).json({
      message: "Updated customer",
      updatedCustomer,
    });
  } catch (error) {
    return next(setError(500, error.message || "Failed updating customer"));
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedCustomer = await Customer.findOneAndDelete(id);
    if (deletedCustomer.avatar) {
      deleteFile(deletedCustomer.avatar);
    }
    if (!deletedCustomer) {
      return next(setError(404, "customer not found"));
    }
    return res.status(200).json({
      message: "User deleted",
      deletedCustomer,
    });
  } catch (error) {
    return next(setError(500, error.message || "Failed deleting customer"));
  }
};

module.exports = {
  crear,
  customerByID,
  update,
  remove,
  getAllCustomers,
};

