const Parser = require('./Parser')
const Resolver = require('./Resolver')

module.exports = class Type {
  constructor(definition, validator) {
    if (definition instanceof Object === false) {
      throw new Error('definition must be atleast an empty object.')
    }
    this.name = 'CustomType'
    this.definition = definition
    this.validator = validator
    Parser.parse(this)
  }

  fields() {
    return Object.keys(this.definition)
  }

  static resolve(type, data) {
    return Resolver.resolve(type, data)
  }
}
