require('dotenv').config()


const { readInput, inquirerMenu, pauseInquirer, listPlaces } = require ('./helpers/inquirer')
const Searching = require ('./models/search');

const main = async () => {
    console.clear();

    const searches = new Searching();
    let opt;

    do {
        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                // Mostrar mensaje de busqueda
                const lookPlaces = await readInput('Ciudad: ');
                               
                // Busca los lugares
                const places = await searches.city(lookPlaces);

                // Selecciona el lugar 
                const idPlace = await listPlaces(places);
                if (idPlace === '0') continue;

                const selectCity = places.find( l => l.id === idPlace );
                //Guardar en DB
                searches.historicalData(selectCity.name);
                           
                // Datos de clima 
                const weatherCity = await searches.weatherPlace(selectCity.latitude, selectCity.length);
                
                // Muestra resultados
                console.clear();
                console.log('\nInformacion de la ciudad\n'.green);
                console.log('Ciudad:', selectCity.name);
                console.log('Latitud:', selectCity.latitude);
                console.log('Longitud:', selectCity.length);
                console.log('Temperatura:', selectCity.length);
                console.log('Minima:', weatherCity.min);
                console.log('Maxima:', weatherCity.max);
                console.log('Descripcion del clima:', weatherCity.desc.green);

            break;

            case 2:
                searches.recordCapital.forEach( (place, i) => {
                    const idx = `${ i + 1}.`.green;
                    console.log(`${ idx } ${ place }`);
                })
            break;
        }

        if (opt !== 0 ) await pauseInquirer();

    } while ( opt !== 0 );
  
}

main();