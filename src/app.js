const path = require('path')
const express = require('express')
const hbs = require('hbs')
const { error } = require('console')
const forecast = require('./utils/prediksiCuaca')

const app = express()
const axios = require('axios');
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

//halaman berita
app.get('/berita', (req, res) => {
    const apiKey = 'a3f483f912b4cb69ff55457fb4ea987a'; 
    const searchQuery = 'a'; 

    // Lakukan permintaan ke API
    axios.get(`http://api.mediastack.com/v1/sources?access_key=${apiKey}&search=${searchQuery}`)
        .then((response) => {
            const dataBerita = response.data; // Mengambil data berita dari respons API

            res.render('berita', {
                judul: 'Berita',
                Nama: 'Indah Chania',
                berita: dataBerita // Mengirimkan data berita ke halaman 'berita'
            });
        })
        .catch((error) => {
            console.error('Terjadi kesalahan dalam permintaan API berita:', error);
            res.render('berita', {
                judul: 'Berita',
                Nama: 'Indah Chania',
                berita: [] // Mengirimkan array kosong jika terjadi kesalahan
            });
        });
});

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