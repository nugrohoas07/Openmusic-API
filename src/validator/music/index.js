const InvariantError = require('../../exceptions/InvariantError')
const { AlbumPayloadSchema } = require('./schema')

const MusicValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = AlbumPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}

module.exports = MusicValidator
