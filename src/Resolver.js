const _ = require('lodash')
const ValidationError = require('./ValidationError')

const isBoolean = val => val === true || val === false
const isString = val => typeof val === 'string'
const isNumber = val => typeof val === 'number'
const isArray = val => Array.isArray(val)
const isObject = val => val instanceof Object && !isArray(val)

const getTypeName = type => (isArray(type) ? 'Array' : type.name)
const isReferenceType = type => getTypeName(type) === 'Reference'
const isComplexType = type => getTypeName(type) === 'Complex'

const throwTypeError = (type, data) => {
  throw new TypeError()
}
const throwValidationError = (type, data, reason) => {
  throw new ValidationError()
}

class Resolver {
  constructor() {
    this.defs = {}
  }

  resolve(type, data) {
    if (_.isNil(data)) {
      throwTypeError(type, data)
    } else if (isComplexType(type)) {
      return this.resolveComplexType(type, data)
    } else if (isReferenceType(type)) {
      return this.resolveReferenceType(type, data)
    } else {
      return this.resolveBaseType(type, data)
    }
  }

  resolveBaseType(type, data) {
    const typeName = getTypeName(type)
    if (typeName === 'String') {
      return isString(data) ? data : throwTypeError(type, data)
    } else if (typeName === 'Boolean') {
      if (isBoolean(data)) {
        return data
      } else if (isString(data)) {
        if (data === 'true') return true
        if (data === 'false') return false
        throwTypeError(type, data)
      } else {
        throwTypeError(type, data)
      }
    } else if (typeName === 'Number') {
      if (isNumber(data)) {
        return data
      } else if (isString(data)) {
        return Number(data)
      } else {
        throwTypeError(type, data)
      }
    } else if (typeName === 'Object') {
      return isObject(data) ? data : throwTypeError(type, data)
    } else if (typeName === 'Array') {
      return isArray(data)
        ? data.map(d => this.resolve(type[0], d))
        : throwTypeError(type, data)
    } else {
      throw new Error('Unknown type name -', typeName)
    }
  }

  resolveReferenceType(type, data) {
    const t = this.defs[type.ref]
    if (!t) throwTypeError(type, data)

    return this.resolve(t, data)
  }

  resolveComplexType(type, data) {
    if (!isObject(data)) throwTypeError(type, data)
    if (type.ref) this.defs[type.ref] = type

    const resolved = {}
    Object.keys(type.definition).forEach(name => {
      const {
        type: _type,
        required: _required,
        default: _default,
        validator: _validator,
      } = type.definition[name]
      const val = data[name]
      let resolvedVal

      if (_.isNil(val)) {
        if (!_.isNil(_default)) {
          resolvedVal = this.resolve(_type, _default)
        } else {
          if (_required) throwValidationError(type, data)
        }
      } else {
        resolvedVal = this.resolve(_type, val)
        if (_validator && !_validator(resolvedVal))
          throwValidationError(type, data)
      }

      if (!_.isNil(resolvedVal)) resolved[name] = resolvedVal
    })

    let fNames = Object.keys(type.definition)
    Object.keys(data).forEach(fName => {
      // check that k is a field in type
      if (fNames.indexOf(fName) === -1) throwValidationError(type, data)
      fNames = fNames.filter(n => n !== fName)
    })

    // Run the type validator
    if (type.validator && !type.validator(data))
      throwValidationError(type, data)

    return resolved
  }
}

module.exports = Resolver
