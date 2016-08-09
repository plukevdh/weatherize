import http from 'axios'

export default function updateProfile(context) {
  const { slackUrl, icon } = context;

  return http.post(slackUrl(icon))
}
