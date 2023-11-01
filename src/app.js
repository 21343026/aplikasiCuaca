const path = require('path')
const express = require('express')
const hbs = require('hbs')
const { error } = require('console')
const forecast = require('./utils/prediksiCuaca')

const app = express()
const port = process.env.PORT || 3000

//Mendefinisikan jalur/path untuk konfigurasi express
const direktoriPublic = path.join(__dirname,'../public')
const direktoriViews = path.join(__dirname, '../templates/views')
const direktoriPartials = path.join(__dirname,'../templates/partials')
const geocode = require('./utils/geocode')
//const forecast = require('./utils/prediksiCuaca')

// Setup handlebars engine dan lokasi folder views
app.set('view engine', 'hbs')
app.set('views', direktoriViews)
hbs.registerPartials(direktoriPartials)

// Setup direktori Statis
app.use(express.static(direktoriPublic))

//ini halaman/page utama
app.get('', (req, res) => {
    res.render('index', {
        judul : 'Aplikasi Cek Cuaca',
        Nama : 'Indah Chania'
    });
});

//ini halaman bantuan/FAQ (Frequently Asked Questions)
app.get('/bantuan', (req, res) =>{
    res.render('bantuan', {
        judul : 'Halaman Bantuan',
        Nama : 'Indah Chania',
        teksBantuan : 'Ini adalah halaman bantuan'
    });
});


//ini halaman infoCuaca
app.get('/infoCuaca', (req, res) =>{
    if (!req.query.address) {
        return res.send({
            error : 'Kamu harus memasukan lokasi yang ingin dicari'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error){
            return res.send({error})
        }
        forecast(latitude, longitude, (error, dataPrediksi) => {
            if(error){
                return res.send({error})
            }
            res.send({
                prediksiCuaca : dataPrediksi,
                lokasi: location,
                address: req.query.address
            })
        })
    })
})

//ini halaman tentang
app.get('/tentang', (req, res) =>{
    res.render('tentang', {
        judul : 'Tentang Saya',
        Nama : 'Indah Chania'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        judul: '404',
        Nama : 'Indah Chania',
        pesanKesalahan: 'Halaman tidak ditemukan'
    })
})

app.listen(port, () => {
    console.log('Server berjalan pada port '+ port)
})