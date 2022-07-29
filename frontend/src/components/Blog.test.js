import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

const blog = {
  title: "Test blog",
  author: "Tester",
  url: "https://tests.com",
  likes: 0,
  id: "1234567890",
  user: {
    name: "Tester name",
    username: "Tester username",
  },
};

const loggedUser = {
  username: "localstorage",
  name: "name",
  token: "superHashedToken",
};

beforeAll(() => {
  class LocalStorageMock {
    constructor() {
      this.store = {
        loggedUser: JSON.stringify(loggedUser),
      };
    }

    clear() {
      this.store = {};
    }

    getItem(key) {
      return this.store[key] || null;
    }

    setItem(key, value) {
      this.store[key] = String(value);
    }

    removeItem(key) {
      delete this.store[key];
    }
  }

  Object.defineProperty(window, "localStorage", {
    value: new LocalStorageMock(),
  });
});

let likeBlog, removeBlog;
beforeEach(() => {
  likeBlog = jest.fn();
  removeBlog = jest.fn();
  render(<Blog blog={blog} likeBlog={likeBlog} removeBlog={removeBlog} />);
});

test("Render blog outline", () => {
  const element = screen.getByText("Test blog by Tester");
  expect(element).toBeDefined();
  expect(element).toHaveClass("blogOutline");

  const blogDetails = screen.queryByText("likes");
  expect(blogDetails).toBeNull();
});

test("Render blog details", async () => {
  const element = screen.getByText("Test blog by Tester");
  expect(element).toBeDefined();
  expect(element).toHaveClass("blogOutline");

  const user = userEvent.setup();
  const button = screen.getByText("view");
  await user.click(button);

  expect(element).toHaveClass("blogDetails");
  expect(element).toHaveTextContent("likes: 0");
  expect(element).toHaveTextContent("https://tests.com");
});

test("function received as prop is called when the like button is pressed", async () => {
  const user = userEvent.setup();
  const button = screen.getByText("view");
  await user.click(button);

  const likeButton = screen.getByText("like");
  await user.click(likeButton);
  await user.click(likeButton);

  expect(likeBlog.mock.calls).toHaveLength(2);
  expect(likeBlog.mock.calls[0][1]).toBe(blog.id);
});
