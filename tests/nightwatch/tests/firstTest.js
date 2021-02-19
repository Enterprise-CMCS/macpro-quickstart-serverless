module.exports = {
  "My first test case"(browser) {
    browser
      .url(`${process.env.APPLICATION_ENDPOINT}`)
      .waitForElementVisible(".navbar-brand")
      .assert.containsText(".navbar-brand", "APS Home")
      .saveScreenshot("tests_output/My_first_test_case_screenshot.png");
  },
};
