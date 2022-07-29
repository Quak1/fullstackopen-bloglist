// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add("login", (username, password) => {
  cy.request("POST", "http://localhost:3003/api/login", {
    username,
    password,
  }).then(({ body }) => {
    localStorage.setItem("loggedUser", JSON.stringify(body));
    cy.visit("http://localhost:3000");
  });
});

Cypress.Commands.add("createUser", (name, username, password) => {
  const user = { name, username, password };

  cy.request("POST", "http://localhost:3003/api/users", user);
});

Cypress.Commands.add("createBlog", (title, author, url) => {
  cy.request({
    method: "POST",
    url: "http://localhost:3003/api/blogs",
    body: { title, author, url },
    headers: {
      Authorization: `bearer ${
        JSON.parse(localStorage.getItem("loggedUser")).token
      }`,
    },
  }).then(() => cy.visit("http://localhost:3000"));
});

Cypress.Commands.add("logout", () => {
  localStorage.removeItem("loggedUser");
  cy.visit("http://localhost:3000");
});
