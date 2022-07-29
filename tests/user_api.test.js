const mongoose = require("mongoose");
const supertest = require("supertest");

const helper = require("./test_helper");
const User = require("../models/user");
const app = require("../app");
const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
  await User.insertMany(helper.sampleUsers);
});

test("view all users", async () => {
  const res = await api.get("/api/users");

  expect(res.status).toBe(200);
  expect(res.headers["content-type"]).toMatch(/json/);
  expect(res.body).toHaveLength(2);

  const usernames = res.body.map((u) => u.username);
  expect(usernames).toContain("test");
  expect(usernames).toContain("test 2");
});

describe("user creation", () => {
  test("create a new user", async () => {
    const newUser = {
      username: "new-user",
      name: "New User",
      password: "new password",
    };

    const res = await api.post("/api/users").send(newUser).expect(201);
    expect(res.body.username).toBe("new-user");
  });

  test("duplicate username gets rejected", async () => {
    const newUser = {
      username: "test",
      name: "New User",
      password: "new password",
    };

    await api.post("/api/users").send(newUser).expect(400);
  });

  test("missing username returns status code 400", async () => {
    const newUser = {
      username: "",
      name: "New User",
      password: "new password",
    };

    await api.post("/api/users").send(newUser).expect(400);
  });

  test("missing password returns status code 400", async () => {
    const newUser = {
      username: "new-user",
      name: "New User",
    };

    await api.post("/api/users").send(newUser).expect(400);
  });

  test("if username is less than 3 characters long returns status code 400", async () => {
    const newUser = {
      username: "ne",
      name: "New User",
      password: "new password",
    };

    await api.post("/api/users").send(newUser).expect(400);
  });

  test("if password is less than 3 characters long returns status code 400", async () => {
    const newUser = {
      username: "new-user",
      name: "New User",
      password: "ne",
    };

    await api.post("/api/users").send(newUser).expect(400);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
