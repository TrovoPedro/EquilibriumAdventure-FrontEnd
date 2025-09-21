//CHECKSUM:a45ea5d157c3bf8c3461c00abfe94b8f14f090fc7f9b694368dde679a6c615a9
const messageTypesToDiscard = ['request_start_conversation', 'say_something']

if (messageTypesToDiscard.includes(event.type)) {
  event.setFlag(bp.IO.WellKnownFlags.SKIP_DIALOG_ENGINE, true)
}

const saySomethingHook = async () => {
  const text = event.payload.text

  if (event.type === 'say_something' && text && text.length) {
    if (text.startsWith('#!')) {
      /**
       * Sends an existing content element. Event is specified twice, since the first parameters are the
       * element arguments, and the second one is the event destination (required fields: botId, target, threadId, channel)
       */
      const content = await bp.cms.renderElement(text, event, event)
      await bp.events.replyToEvent(event, content)
    } else {
      // Sends a basic text message
      const payloads = await bp.cms.renderElement('builtin_text', { text, typing: true }, event)
      await bp.events.replyToEvent(event, payloads)
    }
  }
}

return saySomethingHook()
