describe("Test", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Test", () => {
    /* ==== Generated with Cypress Studio ==== */
    cy.get(".lander > p").should(
      "have.text",
      "ACME's Amendment to Planned Settlement (APS) submission application"
    );
    /* ==== End Cypress Studio ==== */
  });
});
