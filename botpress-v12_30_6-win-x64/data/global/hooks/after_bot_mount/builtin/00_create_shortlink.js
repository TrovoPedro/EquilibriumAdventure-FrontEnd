//CHECKSUM:295521a4e8ec8c9045df4e4baa058db3ad7b75e1428607cada4042bbb6cb12c4
const chatOptions = {
  hideWidget: true,
  config: {
    enableReset: true,
    enableTranscriptDownload: true
  }
}

const params = {
  m: 'channel-web',
  v: 'Fullscreen',
  options: JSON.stringify(chatOptions)
}

// Bot will be available at $EXTERNAL_URL/s/$BOT_NAME
bp.http.createShortLink(botId, `${process.EXTERNAL_URL}/lite/${botId}/`, params)
