const mongoose = require("mongoose");
const supertest = require("supertest");
const jwt = require("jsonwebtoken");

const helper = require("./test_helper");
const Blog = require("../models/blog");
const User = require("../models/user");
const app = require("../app");
const api = supertest(app);

let users, posterToken, otherToken;
beforeAll(async () => {
  await User.deleteMany({});
  users = await User.insertMany(helper.sampleUsers);

  const poster = {
    username: users[0].username,
    id: users[0].id,
  };
  const other = {
    username: users[1].username,
    id: users[1].id,
  };

  posterToken = "Bearer " + jwt.sign(poster, process.env.SECRET);
  otherToken = "Bearer " + jwt.sign(other, process.env.SECRET);
});

beforeEach(async () => {
  await Blog.deleteMany({});

  const initialBlogs = helper.initialBlogs.map((blog) => ({
    ...blog,
    user: users[0]._id,
  }));
  await Blog.insertMany(initialBlogs);
});

describe("view all blogs", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("there are 7 entries", async () => {
    const res = await api.get("/api/blogs");
    expect(res.body).toHaveLength(7);
  });

  test("a given title is returned", async () => {
    const res = await api.get("/api/blogs");
    const blogs = res.body.map((b) => b.title);

    expect(blogs).toContain("React patterns");
  });

  test("the unique identifier property is named id", async () => {
    const res = await api.get("/api/blogs");
    const id = res.body[0].id;

    expect(id).toBeDefined();
  });
});

describe("addition of a new entry", () => {
  test("a blog can be added", async () => {
    const newEntry = {
      title: "POST test",
      author: "Test",
      url: "https://example.com",
      likes: 10,
    };

    const res = await api
      .post("/api/blogs")
      .set("Authorization", posterToken)
      .send(newEntry);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.status).toEqual(201);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const blogs = blogsAtEnd.map((b) => b.title);
    expect(blogs).toContain("POST test");
  });

  test("if likes is missing, it defaults to 0", async () => {
    const newEntry = {
      title: "POST test",
      author: "Test",
      url: "https://example.com",
    };

    const res = await api
      .post("/api/blogs")
      .set("Authorization", posterToken)
      .send(newEntry);
    expect(res.body.likes).toBe(0);
  });

  test("if title or url are missing, receive status code 400", async () => {
    const newEntry = {
      author: "Test",
      likes: 10,
    };

    const res = await api
      .post("/api/blogs")
      .set("Authorization", posterToken)
      .send(newEntry);
    expect(res.status).toEqual(400);
  });

  test("blog is not added if authorization header is missing", async () => {
    const newEntry = {
      title: "POST test",
      author: "Test",
      url: "https://example.com",
      likes: 10,
    };

    const res = await api.post("/api/blogs").send(newEntry);
    expect(res.status).toEqual(401);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

describe("deletetion of a note", () => {
  test("successful deletion with valid id", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    const res = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", posterToken);
    expect(res.status).toBe(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);

    const titles = blogsAtEnd.map((b) => b.title);
    expect(titles).not.toContain(blogToDelete.title);
  });

  test("fails with status code 404 if id is invalid", async () => {
    const res = await api
      .delete("/api/blogs/123")
      .set("Authorization", posterToken);
    expect(res.status).toBe(400);
  });

  test("rejected if done by another other", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    const res = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", otherToken);
    expect(res.status).toBe(401);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length);
  });
});

describe("update an existing note", () => {
  test("succeeds with valid data", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    const updateObject = {
      likes: blogToUpdate.likes + 1,
    };

    const res = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set("Authorization", posterToken)
      .send(updateObject);
    expect(res.status).toBe(200);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd[0].likes).toBe(updateObject.likes);
  });

  test("fails with status code 404 if data is invalid", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    const updateObject = {
      likes: "five",
    };

    const res = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set("Authorization", posterToken)
      .send(updateObject);
    expect(res.status).toBe(400);
  });

  test("fails with status code 404 if id is invalid", async () => {
    const res = await api
      .put("/api/blogs/123")
      .send({})
      .set("Authorization", posterToken);
    expect(res.status).toBe(400);
  });

  test("rejected if done by another user", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    const updateObject = {
      likes: blogToUpdate.likes + 1,
    };

    const res = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set("Authorization", otherToken)
      .send(updateObject);
    expect(res.status).toBe(401);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd[0].likes).toBe(blogsAtStart[0].likes);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
