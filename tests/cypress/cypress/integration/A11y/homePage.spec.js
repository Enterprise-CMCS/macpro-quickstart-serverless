describe("Home Page 508 test", () => {
  beforeEach(() => {
    cy.visit("https://dwvboc39mygbu.cloudfront.net/");
  });

  it("Check a11y on AMMAD Page", () => {
    cy.checkA11yOfPage();
  });
});
//Child Core Set Questions Does Not Have a test. Please make the same modifications to that page when making modifications to this page.
