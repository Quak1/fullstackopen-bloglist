describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    cy.createUser("Tester Name", "myUser", "password");
    cy.visit("http://localhost:3000");
  });

  it("Login form is shown", function () {
    cy.contains("Log in to application");
    cy.contains("login");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.contains("username").find("input").type("myUser");
      cy.contains("password").find("input").type("password");
      cy.contains("login").click();

      cy.contains("Tester Name logged in");
      cy.contains("You have logged in!").should(
        "have.css",
        "color",
        "rgb(0, 128, 0)"
      );
    });

    it("fails with wrong credentials", function () {
      cy.contains("username").find("input").type("badUser");
      cy.contains("password").find("input").type("password");
      cy.contains("login").click();

      cy.contains("Log in to application");
      cy.contains("Wrong username or password").should(
        "have.css",
        "color",
        "rgb(255, 0, 0)"
      );
    });
  });

  describe("When logged in", function () {
    beforeEach(function () {
      cy.login("myUser", "password");
    });

    it("A blog can be created", function () {
      cy.contains("new blog").click();
      cy.get('[placeholder="title"]').type("A New Blog");
      cy.get('[placeholder="author"]').type("Blogger");
      cy.get('[placeholder="url"]').type("https://example.com");
      cy.contains("create").click();

      cy.contains("view");
      cy.contains("A new blog A New Blog by Blogger has been added").should(
        "have.css",
        "color",
        "rgb(0, 128, 0)"
      );
    });

    describe("With existing blog", function () {
      beforeEach(function () {
        cy.createBlog(
          "Existing Blog",
          "Existing Author",
          "htttps://existing.com"
        );
        cy.createBlog(
          "Another Blog",
          "Existing Author",
          "htttps://existing.com"
        );
        cy.contains("Existing Blog").contains("view").click();
      });

      it("A blog can be liked", function () {
        cy.contains("likes: 0");
        cy.contains("like").click();
        cy.contains("likes: 1");
        cy.contains("You liked a post!").should(
          "have.css",
          "color",
          "rgb(0, 128, 0)"
        );
      });

      it("A blog can be deleted", function () {
        cy.contains("remove").click();
        cy.get("html").should("not.contain", "Existing Blog");
        cy.contains("You removed a post!").should(
          "have.css",
          "color",
          "rgb(0, 128, 0)"
        );
      });

      it("A different user cannot delete a blog", function () {
        cy.createUser("Another Name", "anotherUser", "password");
        cy.logout();
        cy.login("anotherUser", "password");

        cy.contains("view").click();
        cy.get(".blogDetails").should("not.contain", "remove");
      });

      it("Blogs are ordered by likes", function () {
        cy.contains("hide").click();
        cy.get(".blogOutline").eq(0).contains("Existing Blog");
        cy.get(".blogOutline").eq(1).contains("Another Blog");

        cy.contains("Another Blog").contains("view").click();
        cy.get(".blogDetails").contains("like").click();
        cy.contains("likes: 1");
        cy.visit("http://localhost:3000");

        cy.get(".blogOutline").eq(0).contains("Another Blog");
        cy.get(".blogOutline").eq(1).contains("Existing Blog");
      });
    });
  });
});
