// Importación de librería para el manejo de Bases de Datos con mysql.
import mysql from 'mysql2/promise.js';

// Fuente de ayuda: https://evertpot.com/executing-a-mysql-query-in-nodejs/

// Credenciales para acceder a la Base de Datos.
const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'CryptoMapa'
});

// Consulta a la Base de Datos. Extrae el TODO el contenido de la Tabla CryptoVariacion.
export const LeerTodoBD = async () => {
  try {
    const Consulta = await connection.query(
      'SELECT * FROM CryptoVariacion LIMIT 300'
    );
    console.log("Consulta ejecutada con éxito.");
    return Consulta;
  } catch (e) {
    console.log("Error en la consulta.");
    console.error(e);
    return [];
  }
};

// Verificación de registro existente en la Base de Datos.
export const VerificaRegistroBD = async (Registro) => {
  try {
    const Consulta = await connection.execute(
      `SELECT * FROM CryptoVariacion WHERE CryptoVariacion.symbol = ${mysql.escape(Registro)}`
    );
    console.log("Verificacion ejecutada con éxito.");
    return Consulta;
  } catch (e) {
    console.log("Error en la consulta.");
    console.error(e);
    return [];
  }
};

// Inserta valores de interés a la Base de Datos.
export const InsertarInformacion = async (symbol,price,priceChangePercent30min,priceChangePercent24hr,volumeChange24hr,name,ath,ath_change_percentage,market_cap_rank,SentidoMovimiento) => {
  try {
    //await connection.execute(connection , `INSERT INTO CryptoVariacion (symbol , price , priceChangePercent30min , priceChangePercent24hr, volumeChange24hr, name, ath, ath_change_percentage, market_cap_rank, SentidoMovimiento) VALUES (${mysql.escape(symbol)} , ${mysql.escape(price)} , ${mysql.escape(priceChangePercent30min)} , ${mysql.escape(priceChangePercent24hr)} , ${mysql.escape(volumeChange24hr)} , ${mysql.escape(name)} , ${mysql.escape(ath)} , ${mysql.escape(ath_change_percentage)} , ${mysql.escape(market_cap_rank)} , ${mysql.escape(SentidoMovimiento)})`);
    await connection.execute(
      `INSERT INTO CryptoVariacion (symbol,price,priceChangePercent30min,priceChangePercent24hr,volumeChange24hr,name,ath,ath_change_percentage,market_cap_rank,SentidoMovimiento) 
      VALUES 
      (${mysql.escape(symbol)},${mysql.escape(price)},${mysql.escape(priceChangePercent30min)},${mysql.escape(priceChangePercent24hr)},${mysql.escape(volumeChange24hr)},${mysql.escape(name)},${mysql.escape(ath)},${mysql.escape(ath_change_percentage)},${mysql.escape(market_cap_rank)}, ${mysql.escape(SentidoMovimiento)}) 
      AS valores 
      ON DUPLICATE KEY UPDATE 
      price = valores.price,
      priceChangePercent30min = valores.priceChangePercent30min,
      priceChangePercent24hr = valores.priceChangePercent24hr,
      volumeChange24hr = valores.volumeChange24hr,
      name = valores.name,
      ath = valores.ath,
      ath_change_percentage = valores.ath_change_percentage,
      market_cap_rank = valores.market_cap_rank,
      SentidoMovimiento = valores.SentidoMovimiento`
    );
    return [];
  } catch (e) {
    console.log("Error en la inserción de información a la Base de Datos.");
    console.error(e);
    return [];
  }
};

// Inserta valores de interés a la Base de Datos.
export const InsertarInformacionV2 = async (symbol,price,priceChangePercent30min,priceChangePercent24hr,volumeChange24hr,name,ath,ath_change_percentage,market_cap_rank,SentidoMovimiento) => {
  try {
    //await connection.execute(connection , `INSERT INTO CryptoVariacion (symbol , price , priceChangePercent30min , priceChangePercent24hr, volumeChange24hr, name, ath, ath_change_percentage, market_cap_rank, SentidoMovimiento) VALUES (${mysql.escape(symbol)} , ${mysql.escape(price)} , ${mysql.escape(priceChangePercent30min)} , ${mysql.escape(priceChangePercent24hr)} , ${mysql.escape(volumeChange24hr)} , ${mysql.escape(name)} , ${mysql.escape(ath)} , ${mysql.escape(ath_change_percentage)} , ${mysql.escape(market_cap_rank)} , ${mysql.escape(SentidoMovimiento)})`);
    // await connection.query(`INSERT INTO CryptoMapa.CryptoVariacion (symbol, price, priceChangePercent30min, priceChangePercent24hr, volumeChange24hr, name, ath, ath_change_percentage, market_cap_rank, SentidoMovimiento) VALUES (${mysql.escape(symbol)}, ${mysql.escape(price)}, ${mysql.escape(priceChangePercent30min)}, ${mysql.escape(priceChangePercent24hr)}, ${mysql.escape(volumeChange24hr)}, ${mysql.escape(name)}, ${mysql.escape(ath)}, ${mysql.escape(ath_change_percentage)}, ${mysql.escape(market_cap_rank)}, ${mysql.escape(SentidoMovimiento)}) ON DUPLICATE KEY UPDATE symbol = ${mysql.escape(symbol)}, price = ${mysql.escape(price)}, priceChangePercent30min = ${mysql.escape(priceChangePercent30min)}, priceChangePercent24hr = ${mysql.escape(priceChangePercent24hr)}, volumeChange24hr = ${mysql.escape(volumeChange24hr)}, name = ${mysql.escape(name)}, ath = ${mysql.escape(ath)}, ath_change_percentage = ${mysql.escape(ath_change_percentage)}, market_cap_rank = ${mysql.escape(market_cap_rank)}, SentidoMovimiento = ${mysql.escape(SentidoMovimiento)};`);
    console.log("Si entre a la funcion insertar");

    await connection.execute(
      `INSERT INTO CryptoMapa.CryptoVariacion 
      (symbol,price,priceChangePercent30min,priceChangePercent24hr,volumeChange24hr,name,ath,ath_change_percentage,market_cap_rank,SentidoMovimiento) 
      VALUES 
      (?) 
      AS valores 
      ON DUPLICATE KEY UPDATE 
      price = valores.price,
      priceChangePercent30min = valores.priceChangePercent30min,
      priceChangePercent24hr = valores.priceChangePercent24hr,
      volumeChange24hr = valores.volumeChange24hr,
      name = valores.name,
      ath = valores.ath,
      ath_change_percentage = valores.ath_change_percentage,
      market_cap_rank = valores.market_cap_rank,
      SentidoMovimiento = valores.SentidoMovimiento`,
      [datos]
    );
    console.log("Información agregada correctamente a la Base de Datos.");
    return [];
  } catch (e) {
    console.log("Error en la inserción de información a la Base de Datos.");
    console.error(e);
    return [];
  }
};

// Actualiza un registro especifo de la Base de Datos.
export const ActualizarRegistro = async (symbol,price,priceChangePercent30min,priceChangePercent24hr,volumeChange24hr,name,ath,ath_change_percentage,market_cap_rank,SentidoMovimiento) => {
  try {
    //await connection.execute(connection , `UPDATE CryptoVariacion SET price = ${mysql.escape(price)} , priceChangePercent30min = ${mysql.escape(priceChangePercent30min)} , priceChangePercent24hr = ${mysql.escape(priceChangePercent24hr)} , volumeChange24hr = ${mysql.escape(volumeChange24hr)} , name = ${mysql.escape(name)} , ath = ${mysql.escape(ath)} , ath_change_percentage = ${mysql.escape(ath_change_percentage)} , market_cap_rank = ${mysql.escape(market_cap_rank)} , SentidoMovimiento = ${mysql.escape(SentidoMovimiento)} WHERE symbol = ${mysql.escape(symbol)}`);
    await connection.execute(
      `UPDATE CryptoVariacion SET 
      price = ${mysql.escape(price)},
      priceChangePercent30min = ${mysql.escape(priceChangePercent30min)},
      priceChangePercent24hr = ${mysql.escape(priceChangePercent24hr)},
      volumeChange24hr = ${mysql.escape(volumeChange24hr)},
      name = ${mysql.escape(name)},
      ath = ${mysql.escape(ath)},
      ath_change_percentage = ${mysql.escape(ath_change_percentage)},
      market_cap_rank = ${mysql.escape(market_cap_rank)},
      SentidoMovimiento = ${mysql.escape(SentidoMovimiento)} 
      WHERE symbol = ${mysql.escape(symbol)}`
    );
    console.log("Información actualizada correctamente.");
    return [];
  } catch (e) {
    console.log("Error en la actualización del registro en la Base de Datos.");
    console.error(e);
    return [];
  }
};