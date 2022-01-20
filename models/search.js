const fs = require('fs');
const axios = require('axios');
// const { readInput } = require('../helpers/inquirer');

class SearcheCity {
    record = [];
    dbPath = './db/data.json';
    
    constructor() {
        // Leer DB si es que existe 
        this.readDB();
    }

    get recordCapital () {
        //Coloca en MAYS cada palabra
        return this.record.map( place => {
            let words = place.split(' ');
            words = words.map( p => p[0].toUpperCase() + p.substring(1)  );

            return words.join(' ');
        });
    }

    get paramsMapBox () {
        return {
            // 'pk.eyJ1Ijoib2RpbnNvbjI1IiwiYSI6ImNreWptYXU3azAza3QybnBlMnltMWI4N2MifQ.QWu_PA47uvwQeIyKL5DndA'
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'languaje': 'es'
        }
    }

    get paramsWeather () {
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }

    async city ( place = '') {

        try {
            //Agregaremos peticion HTTP
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
                params: this.paramsMapBox
            });

            const resp = await instance.get();
            return resp.data.features.map( places => ({ // Me retornara un objeto 
                // Configuro los elementos que deseo obtener de la api 
                id: places.id,
                name: places.place_name,
                length: places.center[0],
                latitude: places.center[1]
            }));

        } catch (error) {
            return []; //Retorna los lugares 
        }
         
    }

    async weatherPlace ( lat, lon ) {
        try {
            const request = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsWeather, lat, lon } //Desestructuracion 
            })

            const resp = await request.get();
            const { weather, main } = resp.data;

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }
            
        } catch (error) {
            console.log(error, 'Weather not found')
        }
    }

    historicalData( place = ''){
        //Busca TODO previene duplicado
        if ( this.record.includes( place.toLocaleLowerCase() )){
            return;
        }

        this.record = this.record.splice(0,5);

        this.record.unshift( place.toLocaleLowerCase() );

        this.saveDB();
    }

    saveDB(){

        const payload = {
            record: this.record
        };

        fs.writeFileSync(this.dbPath, JSON.stringify(payload))
    }

    readDB () {
        if ( !fs.existsSync(this.dbPath) ) return;
        console.error('errpr')
    
        const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });

        const data = JSON.parse(info);
        console.log(data, 'Aqui es el error');
        this.record = data.record;
    }
} 



module.exports = SearcheCity;