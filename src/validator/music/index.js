const InvariantError = require('../../exceptions/InvariantError')
const { AlbumPayloadSchema, SongsPayloadSchema, AlbumCoverHeadersSchema } = require('./schema')

const MusicValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = AlbumPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
  validateAlbumCoverHeaders: (headers) => {
    const validationResult = AlbumCoverHeadersSchema.validate(headers)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
  validateSongsPayload: (payload) => {
    const validationResult = SongsPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}

module.exports = MusicValidator
