setupFlightInfoDependentData()

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
    log('Starting the weather call')
    const weatherProm = calls.next().value
    log('Starting the airline api call')
    const ASAApiProm = calls.next().value

    log('waiting for weather')
    const weather = await weatherProm
    log('waiting for ASA API')
    const ASAApi = await ASAApiProm
    log('finished!')
  }
}

function *callFlightAPIs(FIHandler, ASAInfoHandler, WeatherHandler) {
  let destination
  let flightNum
  yield getFlightInfo()
    .then(res => {
      FIHandler.success(res)
      destination = res.flightInfo.destination
      flightNum = res.flightInfo.flightNum
      return true
    })
    .catch(e => false)
  yield getWeatherData(destination).catch(e => false)
    .then(res => {
      WeatherHandler.success(JSON.stringify(res) + ' ' + destination)
      return true
    })
    .catch(e => false)
  yield getAPIData(flightNum).catch(e => false)
    .then(res => {
      ASAInfoHandler.success(JSON.stringify(res) + ' ' + flightNum)
      return true
    })
    .catch(e => false)
}

function getAPIData(flightNum) {
  const data = {
    flightNum: flightNum,
    gate: "G11",
    meals: ['steak', 'hotdogs']
  }

  return apiCall(data)
}

function getWeatherData(dest) {
  const data = {
    temperature: 75,
    destination: dest,
    description: "It's cloudy"
  }

  return apiCall(data)
}

function getFlightInfo() {
  const data = {
    flightInfo: {
      flightNum: "RGF827",
      tail: "RGF000",
      origin: "ORD",
      destination: "KFL"
    }
  }
  return apiCall(data)
}

function apiCall(data) {
  return new Promise((resolve, reject) => {
    const timeout = Math.floor(Math.random()*1000)
    setTimeout(() => resolve(data), timeout)
  })
}
