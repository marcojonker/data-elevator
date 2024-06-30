/* eslint-disable no-undef */
const environment = process.env.NODE_ENV ? process.env.NODE_ENV : 'developent'
/* eslint-enable no-undef */

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
