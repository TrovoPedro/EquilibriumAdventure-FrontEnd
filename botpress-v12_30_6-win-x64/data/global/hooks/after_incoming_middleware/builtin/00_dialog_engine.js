//CHECKSUM:7169f147bb81583f446af89f37e73462918429442c7b3acd733777bf695806ea
const messageTypesToDiscard = ['session_reset', 'typing', 'visit', 'session_reference']

if (messageTypesToDiscard.includes(event.type)) {
  event.setFlag(bp.IO.WellKnownFlags.SKIP_DIALOG_ENGINE, true)
}
