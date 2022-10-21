# Configure the New Relic provider

terraform {
required_version = "~> 1.0"
provider "newrelic" {
  api_key       =  var.api_key
 # admin_api_key =  ""
  account_id    =  var.account_id
  region        =  var.newrelic_region
 }

  backend "s3" {
    key     = ""
    region  = "us-east-1"
    encrypt = true
  }
}

resource "newrelic_synthetics_monitor" "Browser" {
  name = "foo"
  type = "BROWSER"
  frequency = 5
  status = "ENABLED"
  locations = ["AWS_US_EAST_1"]

  uri                       = var.uri             # required for type "SIMPLE" and "BROWSER"
  validation_string         = var.validation_string # optional for type "SIMPLE" and "BROWSER"
  verify_ssl                = true                                # optional for type "SIMPLE" and "BROWSER"
  bypass_head_request       = true                                # Note: optional for type "BROWSER" only
  treat_redirect_as_failure = true                                # Note: optional for type "BROWSER" only
}


resource "newrelic_synthetics_monitor" "nr_script_browser" {
  name = var.synthetic_monitor_name
  type = "SCRIPT_BROWSER"
  frequency = 5
  status = "ENABLED"
  locations = ["AWS_US_EAST_1"]
}


data "template_file" "script_browser_file" {
  template = file("${path.module}/browser_script.tpl")
}

resource "newrelic_synthetics_monitor_script" "nr_script" {
  monitor_id = newrelic_synthetics_monitor.foo.id
  text = data.template_file.script_browser_file.rendered
}