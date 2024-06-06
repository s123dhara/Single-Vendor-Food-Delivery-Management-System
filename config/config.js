const crypto = require('crypto')

const env = 'development'
// const env = 'testing'

module.exports = {
    JWT_SECRET_KEY : crypto.randomBytes(10).toString("hex"), env
}
