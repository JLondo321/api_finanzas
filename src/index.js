import app from './app.js'

//Funcion main
const main = () => {
    app.listen(app.get('port'));
    console.log('El puerto es el: ', app.get('port') )
}

main();