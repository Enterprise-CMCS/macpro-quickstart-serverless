describe("Test", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Test", () => {
    /* ==== Generated with Cypress Studio ==== */
    cy.get("h1").should("have.text", "APS Submission App");
    cy.get("h3").should("have.text", "Do you have questions or need support?");
    /* ==== End Cypress Studio ==== */
  });
});
