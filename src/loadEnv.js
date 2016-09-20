import dotenv from 'dotenv'

const FORCASTIO_URI = "https://api.darksky.net/forecast/"
const SLACK_URI = "https://slack.com/api/users.profile.set"

export default function loadEnv() {
  console.log(__dirname)
  dotenv.config();
  const { FORECASTIO_API_KEY, LATITUDE, LONGITUDE, SLACK_TOKEN, SLACK_USER, STATUS_PREFIX } = process.env;

  const forecastUrl = `${FORCASTIO_URI}/${FORECASTIO_API_KEY}/${LATITUDE},${LONGITUDE}`
  const slackUrl = (icon) => {
    const profile = encodeURIComponent(JSON.stringify({ "last_name": `${STATUS_PREFIX} ${icon}` }))

    return `${SLACK_URI}?token=${SLACK_TOKEN}&profile=${profile}`;
  }

  return Promise.resolve({ forecastUrl, slackUrl });
}
