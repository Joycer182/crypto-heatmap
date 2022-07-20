// npm i uuid
// npm i node-cron
// https://crontab.guru/
// https://support.acquia.com/hc/en-us/articles/360004224494-Cron-time-string-format
// https://www.digitalocean.com/community/tutorials/nodejs-cron-jobs-by-examples
// https://www.npmjs.com/package/node-cron
import nodecron from 'node-cron';

// Importación del programa principal que hace la gestion de consultas API, calculos y actualizacion de la Base de Datos.
import Principal from "./calculos.js";

// Cada 15 segundos se hace la actualizacion de la base de datos
nodecron.schedule('*/15 * * * * *', () => {
  console.log('Cada 15 Segundos se ejecuta esto');
  Principal();
});