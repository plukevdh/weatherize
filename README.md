# Slack Weatherizer 

Emoji in Slack usernames is pretty 👌. But what if we could make it mean something?

Using this small JS script, you can have your profile info reflect the local weather at will using the [Forecast.io](Forecast.io) API.

Slack will append your weather emoji to the `last_name` field in your profile so that it will show up in your Slack client for all to see.

![](http://drops.articulate.com/1dMyI/1lyZuyxa+)

## Setup

There are two obviously possible ways to use this script:

1. Setup to run periodically as an [AWS Lambda](https://aws.amazon.com/lambda/) timed function.
2. Setup to run as a cron job on a machine with NodeJS installed.

The `Makefile` provided supports Lambda setup.

`make publish` will build the code and publish it to AWS. You will need a number of things before running:

- The [awscli](https://aws.amazon.com/cli/) installed and authenticated (`aws configure`)/
- [jq](https://stedolan.github.io/jq/)
- An IAM role capable of running the lambda (AWS provides a `lambda_basic_execution` role which will suffice. You will need the ARN of this rule before running).
- An `.env` file with the following values:
  - FORECASTIO_API_KEY=api-key-from-[forecast-io](https://developer.forecast.io/)
  - LATITUDE=[latitude][1]-of-weather-location
  - LONGITUDE=[longitude][1]-of-weather-location
  - SLACK_TOKEN=[slack-api-token](https://api.slack.com/docs/oauth-test-tokens)
  - STATUS_PREFIX=last-name-or-other-text-to-prepend-to-the-weather-emoji

If you want to have multiple Lambda functions (say, for multiple people), you can change the default function name that will be created using the `NAME` paramter. A full make command might look like this: `make publish ROLE=lambda-arn NAME=user-weatherize-profile

You will need to be sure your AWS account user is allowed to create lambdas, events and read/pass IAM roles.

To cron this, you'd just need NodeJS installed and accessible to the cron run user. Then just add a cron job:

1. Run `make setup-cron`. This will give you a cron task definition which you will need to copy.
2. `crontab` will open in 10 seconds so you can paste the value into the crontab. You will probably want to set your `EDITOR` before running (e.g. `EDITOR=vim make setup-cron`).

To uninstall, you can just `crontab -r` or (if you have other jobs) just edit as above and remove the weatherize line added above.

[1]: http://mynasadata.larc.nasa.gov/latitudelongitude-finder/
