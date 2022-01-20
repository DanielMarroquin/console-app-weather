const inquirer = require ('inquirer');
// const Tareas = require('../models/tareas');
require('colors');

const questions = [
    {
        type: 'list',
        name: 'option',
        message: '¿Que acción desea hacer?',
        choices: [
            {
                value: 1,
                name: `${ '1.'.yellow} Buscar Ciudad`
            },
            {
                value: 2,
                name: `${ '2.'.yellow} Historial de Busqueda`
            },
            {
                value: 0,
                name: `${ '0.'.yellow} Salir`
            }
        ]
    }
]

const inquirerMenu = async() => {

    console.clear();
    console.log('================================'.green);
    console.log('      Seleccione una opción     '.blue);
    console.log('================================\n'.green);

    const { option } = await inquirer.prompt(questions);

    return option;
}

const pauseInquirer = async() => {
 
    const question1 = [
        {
            type: 'input',
            name: 'enter',
            message: `Presione ${'enter'.green} para continuar`
        }
    ]

    console.log('\n');
    await inquirer.prompt(question1)
}

const readInput = async (message) => {
    const question1 = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate (value) {
                if (value.length === 0) {
                    return 'Por favor ingresa un valor';
                }

                return true;
            }
        }
    ];

    const { desc } = await inquirer.prompt(question1);
    return desc;
}

const listPlaces = async ( places = [] ) => {
    const choices = places.map( (place, i ) => {
        
        const idx = `${i + 1}.`.green;

        return {
            value: place.id,
            name: `${idx} ${place.name}`
            
        }
    });

    choices.unshift({
        value: '0',
        name: '0.'.red + 'Cancelar'
    });

    const asks = [
        {
            type: 'list',
            name: 'id',
            message: 'Ciudad Seleccionada: ',
            choices
        }
    ]

    const { id } = await inquirer.prompt(asks);
    
    return id;
}

const deleteConfirm = async (message) => {
    const question = [
        {
            type: 'confirm',
            name: 'ok',
            message
        }   
    ];
    const { ok } = await inquirer.prompt(question);
    return ok;   
}

const chelistTasks = async ( tasks = [] ) => {
    const choices = tasks.map( (task, i ) => {
        
        const idx = `${i + 1}.`.green;

        return {
            value: task.id,
            name: `${idx} ${task.desc}`,
            checked: (task.completeIn) ? true : false 
        }
    });

    const ask = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Selecciones',
            choices
        }
    ]

    const { ids } = await inquirer.prompt(ask);
    return ids;
}



module.exports = {
    inquirerMenu,
    pauseInquirer,
    readInput,
    listPlaces,
    deleteConfirm,
    chelistTasks
}