module.exports = {
  "My first test case"(browser) {
    browser
      .url(`${process.env.APPLICATION_ENDPOINT}`)
      .waitForElementVisible(".lander")
      .assert.containsText(".lander", "APS Submission App")
      .saveScreenshot("tests_output/My_first_test_case_screenshot.png");
  },
};
