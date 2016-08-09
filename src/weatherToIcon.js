import http from 'axios'
import R from 'ramda'

const selectIcon = R.flip(R.prop)({
  "clear-day": '☀️',
  "clear-night": '🌙',
  "rain": '🌧',
  "snow": '🌨',
  "sleet": '💀',
  "wind": '🌬',
  "fog": '🌫',
  "cloudy": '☁️',
  "partly-cloudy-day": '⛅️',
  "partly-cloudy-night": '☁️',
})

// Defaults to 'clear-day' icon
const parseIcon = R.pathOr('clear-day', ['data', 'currently', 'icon']);

export default function weatherToIcon(context) {
  const { forecastUrl } = context;

  return http.get(forecastUrl)
    .then(parseIcon)
    .then(selectIcon)
    .then(R.curry(R.assoc)('icon', R.__, context))
}
