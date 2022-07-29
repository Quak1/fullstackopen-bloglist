describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    cy.createUser("Tester Name", "myUser", "password");
    cy.visit("http://localhost:3003");
  });

  it("Login form is shown", function () {
    cy.contains("login");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.contains("Username").type("myUser");
      cy.contains("Password").siblings().find("input").type("password");
      cy.contains("login").click();

      cy.contains("Tester Name logged in");
      cy.contains("You have logged in!");
    });

    it("fails with wrong credentials", function () {
      cy.contains("Username").type("badUser");
      cy.contains("Password").siblings().find("input").type("password");
      cy.contains("login").click();

      cy.contains("Wrong username or password");
    });
  });

  describe("When logged in", function () {
    beforeEach(function () {
      cy.login("myUser", "password");
    });

    it("A blog can be created", function () {
      cy.contains("new blog").click();
      cy.contains("title").siblings().find("input").type("A New Blog");
      cy.contains("author").siblings().find("input").type("Blogger");
      cy.contains("url").siblings().find("input").type("https://example.com");
      cy.contains("create").click();

      cy.contains("A New Blog by Blogger");
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
        cy.contains("Existing Blog by Existing Author").click();
      });

      it("A blog can be liked", function () {
        cy.contains("Likes: 0");
        cy.contains("like").click();
        cy.contains("Likes: 1");
        cy.contains("You liked a post!");
      });

      it("A blog can be deleted", function () {
        cy.contains("remove").click();
        cy.get("html").should("not.contain", "Existing Blog");
        cy.contains("Blog deleted");
      });

      it("A different user cannot delete a blog", function () {
        cy.createUser("Another Name", "anotherUser", "password");
        cy.logout();
        cy.login("anotherUser", "password");

        cy.contains("Existing Blog by Existing Author").click();
        cy.contains("remove").should("not.exist");
      });

      it("Blogs are ordered by likes", function () {
        cy.contains("blogs").click();
        cy.get("li").first().contains("Existing Blog");

        cy.contains("Another Blog").click();
        cy.contains("like").click();
        cy.contains("Likes: 1");
        cy.contains("blogs").click();

        cy.get("li").first().contains("Another Blog");
      });
    });
  });
});
