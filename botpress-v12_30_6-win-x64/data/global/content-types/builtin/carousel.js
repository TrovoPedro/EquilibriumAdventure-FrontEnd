//CHECKSUM:fc51ae5299dc94b6d6fc95294b7882b15b43475e0ecb563310cf95de962ec3e2
const base = require('./_base')
const Card = require('./card')
const utils = require('./_utils')

function renderElement(data, channel) {
  return utils.extractPayload('carousel', data)
}

module.exports = {
  id: 'builtin_carousel',
  group: 'Built-in Messages',
  title: 'module.builtin.types.carousel.title',

  jsonSchema: {
    description: 'module.builtin.types.carousel.description',
    type: 'object',
    required: ['items'],
    properties: {
      items: {
        type: 'array',
        title: 'module.builtin.types.carousel.cards',
        items: Card.jsonSchema
      },
      ...base.typingIndicators
    }
  },
  computePreviewText: formData => formData.items && `Carousel: (${formData.items.length}) ${formData.items[0].title}`,
  renderElement: renderElement
}
