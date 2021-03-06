const request = require("supertest");
const app = require("../src/app");
const Machine = require("../src/models/machine");
const Failure = require("../src/models/failure");
const {
  setupDatabase,
  machineOne,
  machineOneId,
  machineTwo,
  wrongId
} = require("./fixtures/db");

beforeEach(setupDatabase);

// POST TESTS
test("Should add new machine", async () => {
  const response = await request(app)
    .post("/api/machines")
    .send({ name: "Test Machine Name" })
    .expect(201);

  const machine = await Machine.findById(response.body._id);
  expect(response.body).toMatchObject({ name: "Test Machine Name" });
  expect(machine.name).toBe("Test Machine Name");
});

test("Should return error if adding new machine with name that is taken", async () => {
  await request(app)
    .post("/api/machines")
    .send({ name: machineOne.name })
    .expect(400);
});

test("Should return error if adding new machine with empty name", async () => {
  await request(app)
    .post("/api/machines")
    .send({ name: "" })
    .expect(400);
});

// GET TESTS
test("Should get all machines", async () => {
  const response = await request(app)
    .get("/api/machines")
    .send()
    .expect(200);

  expect(response.body.length).toBe(2);
});

test("Should get a machine by ID", async () => {
  const response = await request(app)
    .get(`/api/machines/${machineOneId}`)
    .send()
    .expect(200);

  const machine = await Machine.findById(machineOneId);
  const failures = await Failure.find({ machine: machine._id });
  expect(machine.name).toBe(response.body.name);
  expect(failures.length).toBe(response.body.failures.length);
});

test("Should return error if getting a machine by nonexisting ID", async () => {
  const response = await request(app)
    .get(`/api/machines/${wrongId}`)
    .send()
    .expect(404);

  expect(response.body.error).toBe("Not found");
});

test("Should return error if getting a machine by random route (not ID type)", async () => {
  await request(app)
    .get("/api/machines/somerandomroute")
    .send()
    .expect(400);
});

// UPDATE TESTS
test("Should update machine if machine exists", async () => {
  const response = await request(app)
    .patch(`/api/machines/${machineOneId}`)
    .send({ name: "Updated Machine Name" })
    .expect(200);

  const machine = await Machine.findById(machineOneId);
  expect(machine.name).toBe(response.body.name);
  expect(response.body.name).toBe("Updated Machine Name");
});

test("Should return error if updating machine that doesn't exists", async () => {
  const response = await request(app)
    .patch(`/api/machines/${wrongId}`)
    .send({ name: "Updated Machine Name" })
    .expect(404);

  expect(response.body.error).toBe("Not found");
});

test("Should return error if updating machine on random route (not ID type)", async () => {
  await request(app)
    .patch("/api/machines/somerandomroute")
    .send({ name: "Updated Machine Name" })
    .expect(400);
});

test("Should return error if updating machine with name that is taken", async () => {
  await request(app)
    .patch(`/api/machines/${machineOneId}`)
    .send({ name: machineTwo.name })
    .expect(400);
});

test("Should return error if updating machine with invalid values", async () => {
  const response = await request(app)
    .patch(`/api/machines/${machineOneId}`)
    .send({ name: "" })
    .expect(400);

  expect(response.body.errors.name.kind).toBe("required");
});

test("Should return error if updating machine with nonexisting fields", async () => {
  const response = await request(app)
    .patch(`/api/machines/${machineOneId}`)
    .send({ manufacturer: "MAN" })
    .expect(400);

  expect(response.body.error).toBe("Invalid updates");
});

// DELETE TESTS
test("Should delete machine if machine exists", async () => {
  await request(app)
    .delete(`/api/machines/${machineOneId}`)
    .send()
    .expect(200);

  const machine = await Machine.findById(machineOneId);
  expect(machine).toBeNull();
});

test("Should return error if deleting machine that doesn't exists", async () => {
  const response = await request(app)
    .delete(`/api/machines/${wrongId}`)
    .send()
    .expect(404);

  expect(response.body.error).toBe("Not found");
});

test("Should return error if deleting machine on random route (not ID type)", async () => {
  await request(app)
    .delete("/api/machines/somerandomroute")
    .send()
    .expect(400);
});
