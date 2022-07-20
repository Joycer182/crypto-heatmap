// npm i uuid
// npm i node-cron
// https://crontab.guru/
// https://support.acquia.com/hc/en-us/articles/360004224494-Cron-time-string-format
// https://www.digitalocean.com/community/tutorials/nodejs-cron-jobs-by-examples
// https://www.npmjs.com/package/node-cron
// https://www.youtube.com/watch?v=co43f11I7Js
import nodecron from 'node-cron';

// Importación del programa principal que hace la gestion de consultas API, calculos y actualizacion de la Base de Datos.
import { ProcesarTODO } from "./calculos.js";

// Cada 15 segundos se hace la actualizacion de la base de datos
nodecron.schedule('*/30 * * * * *', async () => {
  console.log('Cada 30 Segundos se ejecuta esto');
  await ProcesarTODO();
  console.log('Listo');
});