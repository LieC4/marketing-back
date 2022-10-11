const Petuser = require("./users.model");
const bcrypt = require("bcrypt");
const { createToken } = require("../../helpers/utils/token-action");
const { deleteFile } = require("../../middleware/delete-file");
const { setError } = require("../../helpers/utils/error");

const getAllPetusers = async (req, res, next) => {
  try {
    const petuser = await Petuser.find();
    return res.status(200).json({
      message: "All Petusers",
      petuser,
    });
  } catch (error) {
    return next(
      setError(500, error.message | "Failed recovering all petusers")
    );
  }
};

const petuserByID = async (req, res, next) => {
  try {
    const { id } = req.params;
    const petuser = await Petuser.findById(id);
    if (!petuser) return next(setError(404, "User not found"));
    return res.status(200).json(petuser);
  } catch (error) {
    return next(setError(500, error.message || "Failed recovering User"));
  }
};

const register = async (req, res, next) => {
  try {
    const newPetuser = new Petuser(req.body);
    const petusernameExist = await Petuser.findOne({
      username: newPetuser.username,
    });

    if (petusernameExist) {
      return next(setError(409, "User already exists"));
    }

    if (req.file) {
      newPetuser.avatar = req.file.path;
    }
    const petuserInDB = await newPetuser.save();
    res.status(201).json(petuserInDB);
  } catch (error) {
    return next(setError(500, error.message || "Failed creating Petuser"));
  }
};

const login = async (req, res, next) => {
  try {
    const petuserInDb = await Petuser.findOne({
      username: req.body.username,
    });
    if (!petuserInDb) return next(setError(404, "User not found"));

    if (bcrypt.compareSync(req.body.password, petuserInDb.password)) {
      const token = createToken(petuserInDb._id, petuserInDb.password);
      return res.status(200).json({ petuserInDb, token });
    } else {
      return next(setError(401, "Invalid password"));
    }
  } catch (error) {
    return next(setError(500, error.message || "Failed authenticating User"));
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const petuser = new Petuser(req.body);
    petuser._id = id;
    if (req.file) {
      petuser.avatar = req.file.path;
    }
    const updatedPetuser = await Petuser.findByIdAndUpdate(id, petuser);
    if (!updatedPetuser) return next(setError(404, "Petuser not found"));
    return res.status(201).json({
      message: "Updated petuser",
      updatedPetuser,
    });
  } catch (error) {
    return next(setError(500, error.message || "Failed updating Petuser"));
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedPetuser = await Petuser.findOneAndDelete(id);
    if (deletedPetuser.avatar) {
      deleteFile(deletedPetuser.avatar);
    }
    if (!deletedPetuser) {
      return next(setError(404, "Petuser not found"));
    }
    return res.status(200).json({
      message: "User deleted",
      deletedPetuser,
    });
  } catch (error) {
    return next(setError(500, error.message || "Failed deleting Petuser"));
  }
};

module.exports = {
  register,
  login,
  petuserByID,
  update,
  remove,
  getAllPetusers,
};
