class Reference {
  constructor(ref) {
    this.name = 'Reference'
    this.ref = ref
  }
}

module.exports = ref => new Reference(ref)
