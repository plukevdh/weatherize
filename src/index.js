import loadEnv from './loadEnv'
import weatherToIcon from './weatherToIcon'
import updateProfile from './updateProfile'

// noops for local run
const succeed = () => {}
const fail = succeed

export function handler(event={}, context={ succeed, fail }) {
  return loadEnv()
    .then(weatherToIcon)
    .then(updateProfile)
    .then(console.log)
    .then(context.succeed)
    .catch(err => context.fail(err.stack))
}
