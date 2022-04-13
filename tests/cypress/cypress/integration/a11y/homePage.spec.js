describe("Home Page 508 test", () => {
  beforeEach(() => {
    cy.visit("https://dwvboc39mygbu.cloudfront.net/");
  });

  it("Check a11y on AMMAD Page", () => {
    cy.checkA11yOfPage();
  });
});
