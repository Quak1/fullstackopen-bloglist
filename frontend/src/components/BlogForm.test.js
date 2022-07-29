import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import BlogForm from "./BlogForm";

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

test("Render blog details", async () => {
  const user = userEvent.setup();
  const createBlog = jest.fn();
  render(<BlogForm createBlog={createBlog} />);

  const title = screen.getByPlaceholderText("title");
  const author = screen.getByPlaceholderText("author");
  const url = screen.getByPlaceholderText("url");
  const button = screen.getByText("create");

  await user.type(title, "New test blog");
  await user.type(author, "New Author");
  await user.type(url, "example.com");
  await user.click(button);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: "New test blog",
    author: "New Author",
    url: "example.com",
  });
});
