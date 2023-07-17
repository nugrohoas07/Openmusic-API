const Joi = require('joi')

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required()
})

const AlbumCoverHeadersSchema = Joi.object({
  'content-type': Joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/webp', 'image/svg+xml').required()
}).unknown()

const SongsPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number(),
  albumId: Joi.string()
})

module.exports = { AlbumPayloadSchema, SongsPayloadSchema, AlbumCoverHeadersSchema }
