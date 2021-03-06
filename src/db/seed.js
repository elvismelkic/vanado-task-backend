const mongoose = require("mongoose");
const Machine = require("../../src/models/machine");
const Failure = require("../../src/models/failure");
require("./mongoose");

const machineOneId = new mongoose.Types.ObjectId();
const machineOne = {
  _id: machineOneId,
  name: "Machine 1"
};

const machineTwoId = new mongoose.Types.ObjectId();
const machineTwo = {
  _id: machineTwoId,
  name: "Machine 2"
};

const failureOne = {
  _id: new mongoose.Types.ObjectId(),
  name: "Failure 1",
  description: "Description of failure 1",
  fixed: false,
  machine: machineOneId,
  priority: "high"
};

const failureTwo = {
  _id: new mongoose.Types.ObjectId(),
  name: "Failure 2",
  description: "Description of failure 2",
  fixed: true,
  machine: machineOneId,
  priority: "low"
};

const failureThree = {
  _id: new mongoose.Types.ObjectId(),
  name: "Failure 3",
  description: "Description of failure 3",
  fixed: false,
  machine: machineOneId,
  priority: "moderate"
};

const failureFour = {
  _id: new mongoose.Types.ObjectId(),
  name: "Failure 4",
  description: "Description of failure 4",
  fixed: true,
  machine: machineTwoId,
  priority: "low"
};

const failureFive = {
  _id: new mongoose.Types.ObjectId(),
  name: "Failure 5",
  description: "Description of failure 5",
  fixed: false,
  machine: machineTwoId,
  priority: "high"
};

const setupDatabase = async () => {
  await Failure.deleteMany();
  await Machine.deleteMany();

  console.log("Inserting data...");

  await new Machine(machineOne).save();
  await new Machine(machineTwo).save();
  await new Failure(failureOne).save();
  await new Failure(failureTwo).save();
  await new Failure(failureThree).save();
  await new Failure(failureFour).save();
  await new Failure(failureFive).save();

  console.log("Completed!");
};

setupDatabase();
