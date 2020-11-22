var { service } = require('./service')

const main = async event => {
  console.log('Event:', event)
  return `Service Exit: ${await service()}`
}

exports.handler = main