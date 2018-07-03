const Type = require('./Type')
const _TypeError = require('./TypeError')
const ValidationError = require('./ValidationError')

Type.TypeError = _TypeError
Type.ValidationError = ValidationError

module.exports = Type
