const Type = require('./Type')
const Reference = require('./Reference')
const _TypeError = require('./TypeError')
const ValidationError = require('./ValidationError')

Type.Reference = Reference
Type.TypeError = _TypeError
Type.ValidationError = ValidationError

module.exports = Type
