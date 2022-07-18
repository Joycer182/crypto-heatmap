// Importación de librería para el manejo de solicitudes HTTP para comunicación con la API.
import axios from "axios";

// URL base de la API de Futuros de Binance.
const API_BASE_URL = "https://fapi.binance.com/fapi/v1";

// Obtiene el listado de monedas y su precio actual en Futuros de Binance.
export const ObtenerPrecioActual = async () => {
    try {
        // { data } es un Objeto JSon, el resultado de la consulta a la API es un Objeto JSon
        const { data } = await axios.get(API_BASE_URL + "/ticker/price");
        return data;
    } catch (e) {
        console.error(e);
        return [];
    };
};

// Obtiene el histórico de los últimos "Limite" minutos, espaciados por "Intervalo" minutos, de la moneda de estudio en Futuros de Binance.
export const ObtenerHistoricoCompleto = async (MonedaEstudio , Intervalo , Limite) => {
    try {
        // { data } es un Objeto JSon, el resultado de la consulta a la API es un Objeto JSon
        const { data } = await axios.get(API_BASE_URL + `/klines?symbol=${(MonedaEstudio)}&interval=${(Intervalo)}m&limit=${(Limite)}`);
        return data;
    } catch (e) {
        console.error(e);
        return [];
    };
};

// Obtiene el valor histórico de la vela de la fecha = FechaPasada, espaciado en la temporalidad de "Intervalo" minutos, de la moneda de estudio en Futuros de Binance.
export const ObtenerHistoricoEspecifico = async (MonedaEstudio , Intervalo , FechaPasada) => {
    try {
        // { data } es un Objeto JSon, el resultado de la consulta a la API es un Objeto JSon
        const { data } = await axios.get(API_BASE_URL + `/klines?symbol=${(MonedaEstudio)}&interval=${(Intervalo)}m&startTime=${(FechaPasada)}&limit=1`);
        return data;
    } catch (e) {
        console.error(e);
        return [];
    };
};

// Obtiene el histórico de las últimas 24 horas de TODAS las monedas en Futuros de Binance.
export const ObtenerHistorico24Hr = async () => {
    try {
        // { data } es un Objeto JSon, el resultado de la consulta a la API es un Objeto JSon
        const { data } = await axios.get(API_BASE_URL + "/ticker/24hr");
        return data;
    } catch (e) {
        console.error(e);
        return [];
    };
};