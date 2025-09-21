//CHECKSUM:3be5d03a50a425fcfcc184f3c8763a6dac9778d6168a8b4539306678f2e30a2b
const axios = require('axios')

async function execute() {
  try {
    const axiosConfig = await bp.http.getAxiosConfigForBot(event.botId, { localUrl: true })
    await axios.post('/mod/testing/processedEvent', event, axiosConfig)
  } catch (err) {
    console.error('Error processing', err.message)
  }
}

return execute()
