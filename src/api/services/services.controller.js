const Service = require("./services.model");
const bcrypt = require("bcrypt");
const { createToken } = require("../../helpers/utils/token-action");
const { deleteFile } = require("../../middleware/delete-file");
const { setError } = require("../../helpers/utils/error");

const getAllServices = async (req, res, next) => {
  try {
    const service = await Service.find();
    return res.status(200).json({
      message: "All Services",
      service,
    });
  } catch (error) {
    return next(
      setError(500, error.message | "Failed recovering all services")
    );
  }
};

const serviceByID = async (req, res, next) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);
    if (!service) return next(setError(404, "User not found"));
    return res.status(200).json(service);
  } catch (error) {
    return next(setError(500, error.message || "Failed recovering User"));
  }
};

const crear = async (req, res, next) => {
  try {
    const newService = new Service(req.body);
    const servicenameExist = await Service.findOne({
      username: newService.username,
    });

    if (servicenameExist) {
      return next(setError(409, "User already exists"));
    }

    if (req.file) {
      newService.avatar = req.file.path;
    }
    const serviceInDB = await newService.save();
    res.status(201).json(serviceInDB);
  } catch (error) {
    return next(setError(500, error.message || "Failed creating Service"));
  }
};


const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const service = new Service(req.body);
    service._id = id;
    if (req.file) {
        service.avatar = req.file.path;
    }
    const updatedService = await Service.findByIdAndUpdate(id, service);
    if (!updatedService) return next(setError(404, "Service not found"));
    return res.status(201).json({
      message: "Updated Service",
      updatedService,
    });
  } catch (error) {
    return next(setError(500, error.message || "Failed updating Service"));
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedService = await Service.findOneAndDelete(id);
    if (deletedService.avatar) {
      deleteFile(deletedService.avatar);
    }
    if (!deletedService) {
      return next(setError(404, "Service not found"));
    }
    return res.status(200).json({
      message: "User deleted",
      deletedService,
    });
  } catch (error) {
    return next(setError(500, error.message || "Failed deleting Service"));
  }
};

module.exports = {
  crear,
  serviceByID,
  update,
  remove,
  getAllServices,
};

