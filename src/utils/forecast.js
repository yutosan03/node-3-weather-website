const request = require('request')

const forecast = (latitude, longtitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=2097256f36fe351855cf51974d6362ee&query=' + latitude + ',' + longtitude + '&units=f'

    request ({ url, json: true}, (error, { body }) => {
        if (error) {
            callback('Unable to connect to location services', undefined)
        } else if (body.error) {
            callback('Unable to find location. Try another search', undefined)
        } 
        else {
            callback(undefined, body.current.weather_descriptions[0] + '. It is currently ' + body.current.temperature + ' degrees out. It feels like ' + body.current.feelslike + ' degrees.')
        }
    })

}

module.exports = forecast