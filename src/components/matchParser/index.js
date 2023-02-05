import errors from "common-errors";
const wordInString = (s, word) => new RegExp('\\b' + word + '\\b', 'i').test(s);

class MatchParser{
  constructor({logger}) {
    this.logger = logger.child({ module: 'MatchParser'})
  }

  matchEntities(entities, message) {
    const identifiedEntities = [];
    this.logger.info('Searching for entities matches')
    for(const entity of entities) {
      console.log(entity)
      for (const match of entity.matches) {
        if(match.synonyms) {
          match.synonyms.forEach((synonym) => {
            if(wordInString(message, synonym)) {
              identifiedEntities.push(`${entity.name}.${match.name}`)
            }
          })
        } 
        if (match.regex) {
          const testRegex = new RegExp(match.regex).test(message)
          console.log(testRegex)
          if(testRegex) identifiedEntities.push(`${entity.name}.${match.name}`)
        }
      }
    }
    return identifiedEntities
  }

  validateMatches(entities) {
    try {
      entities.forEach((entity) => {
        if(entity.regex) {
          new RegExp(entity.regex)
        }
      })
    } catch (e) {
      throw new errors.ValidationError('Invalid regex')
    }
  }
}

export default MatchParser