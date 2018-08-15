const Parser = require('./Parser')
const Resolver = require('./Resolver')

class Type {
  constructor(definition, { validator, ref } = {}) {
    this.name = 'Complex'
    this.definition = definition
    if (validator) this.validator = validator
    if (ref) this.ref = ref
    Parser.parse(this)
  }

  fields() {
    return Object.keys(this.definition)
  }

  static resolve(type, data) {
    const resolver = new Resolver()
    return resolver.resolve(type, data)
  }
}

module.exports = Type
