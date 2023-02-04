class MatchParser{
  constructor({logger}) {
    this.logger = logger.child({ module: 'MatchParser'})
  }

  matchEntities(entities, message) {
    console.log(entities, message)
    return ['works']
  }
}

export default MatchParser