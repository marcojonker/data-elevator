const environment = process.env.NODE_ENV ? process.env.NODE_ENV : 'developent'

const config = {
  levelControllerConfig: {
    fileName: 'current_level.json'
  }
}

switch (environment) {
  case 'development':
    break
}

module.exports = config
