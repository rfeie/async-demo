// log to doc function
// main function
// async
//

setupFlightInfoDependentData()
Number.parseInt();

function display () {
  const container = document.querySelector('.content')
  const element = () => document.createElement('p')
  return (...texts) => {
    const el = element()
    el.innerText = texts.join(' | ')
    container.appendChild(el)
  }
}
const log = display()

function setupFlightInfoDependentData() {
  generateFlightInfoData()
}

async function generateFlightInfoData() {
const success = (text) => log('Success! ', JSON.stringify(text))
const error = (text) => log('ERROR:', JSON.stringify(text))
  const handlers = {
    flight: {
      success: success,
      error: error
    },
    weather: {
      success: success,
      error: error
    },
    api: {
      success: success,
      error: error
    }
  }
  const calls = callFlightAPIs(handlers.flight, handlers.weather, handlers.api)
  const flightInfo = await calls.next().value
  if (flightInfo) {
    const weatherProm = calls.next().value
    const ASAApiProm = calls.next().value
    const weather = await weatherProm
    const ASAApi = await ASAApiProm
  }
}

function *callFlightAPIs(FIHandler, ASAInfoHandler, WeatherHandler) {
  let num
  yield apiCall()
    .then(res => {
      FIHandler.success(res)
      num = res
      return true
    })
    .catch(e => false)
  yield apiCall().catch(e => false)
    .then(res => {
      WeatherHandler.success(res + ' ' + num)
      return true
    })
    .catch(e => false)
  yield apiCall().catch(e => false)
    .then(res => {
      ASAInfoHandler.success(res + ' ' + num)
      return true
    })
    .catch(e => false)
}


function apiCall() {
  return new Promise((resolve, reject) => {
    const timeout = Math.floor(Math.random()*1000)
    setTimeout(() => resolve(timeout), timeout)
  })
}
