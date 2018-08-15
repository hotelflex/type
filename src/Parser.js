const _ = require('lodash')

ALLOWED_TYPES = [
  'String',
  'Boolean',
  'Number',
  'Array',
  'Object',
  'Complex',
  'Reference',
]
ALLOWED_PROPS = ['type', 'required', 'validator', 'default']

const isArray = val => Array.isArray(val)
const isObject = val => val instanceof Object && !isArray(val)
const getTypeName = type =>
  isArray(type) ? 'Array' : _.isNil(type) ? null : type.name

class Parser {
  parse(type) {
    const fNames = Object.keys(type.definition)

    fNames.forEach(fName => {
      const fDef = type.definition[fName]
      if (!isObject(fDef))
        throw new Error('Field definition should be an object.')

      // if (extra keys in field def) throw new Error('Forbidden properties in field definition.')

      if (ALLOWED_TYPES.indexOf(getTypeName(fDef.type)) === -1)
        throw new Error('Invalid field type.')
    })
  }
}

module.exports = new Parser()
