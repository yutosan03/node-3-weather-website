const path = require('path')
const express = require('express')
const hbs = require ('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

// __dirname, __filenameの使い方
// console.log(__dirname)
// console.log(__filename)
// console.log(path.join(__dirname, '../public'))


// publicDirectoryPathをvariableに保存して、その下のapp.useで呼び出す
const app = express()
const port = process.env.PORT || 3000

// Define paths for Expre
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
// handlebarを使うためのコード
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to server
app.use(express.static(publicDirectoryPath))

// rootを指定する
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Yuto'
    })
})

//getの1つ目がDirectory
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Yuto'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text.',
        title: 'Help',
        name: 'Yuto'
    })
})


app.get('', (req, res) => {
    res.send('<h1>Weather</h1>')
})

// app.get('/help', (req, res) => {
//     res.send([{name: 'Yuto'},{name: 'Andrew'}])
// })
    
// app.get('/about', (req, res) => {
//     res.send('<h1>About</h1>')
// })

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    }
    
    // console.log(req.query.address)
    // res.send({
    //     address: req.query.address,
    //     forecast: 'Currently 2 degree',
    //     location: 'Tokyo'
    // })

    const location = req.query.address

    if (!location) {
        console.log('Please provide address')
    } else {
        
        geocode(location, (error, {latitude, longtitude, location} = {}) => {
    
            if (error) {
                return res.send({error})
            } 
            
            forecast(latitude, longtitude, (error, forecastData) => {
        
                if (error) {
                    return res.send({error})
                }
        
                res.send({
                    forecast: forecastData, location,
                    address: req.query.address
                })
            })
        })
    }
    


})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }

    console.log(req.query.search)  
    
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('error', {
        title: '404 Page Error',
        text: 'Help article not found'
    })
})

app.get('*', (req, res) => {
    res.render('error', {
        title: '404 Page Error',
        text: 'Page not found'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})