describe("Test", () => {
  beforeEach(() => {
    cy.visit("https://dwvboc39mygbu.cloudfront.net/");
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
