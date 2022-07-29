const listHelper = require("../utils/list_helper");
const { initialBlogs } = require("./test_helper");

test("dummy returns one", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

describe("total likes", () => {
  test("of empty list is zero", () => {
    const result = listHelper.totalLikes([]);
    expect(result).toBe(0);
  });

  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes([initialBlogs[0]]);
    expect(result).toBe(7);
  });

  test("of a bigger list is calculated right", () => {
    const result = listHelper.totalLikes(initialBlogs);
    expect(result).toBe(48);
  });
});

describe("favorite blog", () => {
  test("of empty list is empty object", () => {
    const result = listHelper.favoriteBlog([]);
    expect(result).toEqual({});
  });

  test("of one blog is that blog", () => {
    const result = listHelper.favoriteBlog([initialBlogs[0]]);
    expect(result).toEqual(initialBlogs[0]);
  });

  test("of many blogs is right", () => {
    const result = listHelper.favoriteBlog(initialBlogs);
    expect(result).toEqual(initialBlogs[2]);
  });
});

describe("most blogs", () => {
  test("of empty list is empty object", () => {
    const result = listHelper.mostBlogs([]);
    expect(result).toEqual({});
  });

  test("of one blog is the author of that blog", () => {
    const result = listHelper.mostBlogs([initialBlogs[0]]);
    expect(result).toEqual({
      author: initialBlogs[0].author,
      blogs: 1,
    });
  });

  test("of many blogs is right", () => {
    const result = listHelper.mostBlogs(initialBlogs);
    expect(result).toEqual({
      author: "Robert C. Martin",
      blogs: 3,
    });
  });
});

describe("most likes", () => {
  test("of empty list is empty object", () => {
    const result = listHelper.mostLikes([]);
    expect(result).toEqual({});
  });

  test("of one blog is the number of likes of that blog", () => {
    const result = listHelper.mostLikes([initialBlogs[0]]);
    expect(result).toEqual({
      author: initialBlogs[0].author,
      blogs: 7,
    });
  });

  test("of many blogs is right", () => {
    const result = listHelper.mostLikes(initialBlogs);
    expect(result).toEqual({
      author: "Edsger W. Dijkstra",
      blogs: 17,
    });
  });
});
