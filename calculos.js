// Importación de las funciones del Manejador de la Base de Datos.
import { InsertarInformacion } from "./gestionbd.js";

// Importación de las funciones del Manejador de la API de Futuros de Binance.
import { ObtenerPrecioActual , ObtenerHistoricoCompleto , ObtenerHistoricoEspecifico , ObtenerHistorico24Hr } from "./binanceapi.js";

// Importación de las funciones del Manejador de la API de Coingecko.
import { ObtenerListadoMonedasCoingecko , ObtenerInfoExtraMonedas } from "./coingeckoapi.js";

// Importación de las funciones del manejador de Fecha y Hora. Convertidor desde y hacia TimeStamp UNIX.
import { ConvierteTimestamp , ConvierteFechaHora } from "./manejofecha.js";

// Intervalo de tiempo requerido para el estudio del histórico por moneda. Por defecto 1 minuto.
const IntervaloEstudio = 1;

// Cantidad de velas requeridos para el estudio del histórico por moneda. Por defecto 30 minutos.
const LimiteEstudio = 30;

// Contendrá la informacion que será registrada y actualizada en la Base de Datos. Es un Objeto Json.
let InformacionParaRegistrarBD = [];

export const ProcesarTODO = async () => {

//(async () => {

    console.time('Duracion del Ciclo');
    console.log('Iniciando consultas...');

    // InfoActual = Contiene el listado de monedas disponibles y el precio actual, en Futuros de Binance.
    // Info24horas = Contiene el histórico de las últimas 24 horas de TODAS las monedas listadas en Futuros de Binance.
    // Promise.all Optimiza el tiempo de respuesta de las consultas a la API de Futuros de Binance.
    const [ InfoActual , Info24horas , InfoExtraCoingecko ] = await Promise.all( [ ObtenerPrecioActual() , ObtenerHistorico24Hr() , ObtenerInfoExtraMonedas() ] );

    
// Pendiente el catch de error


    // Obtiene la Fecha y Hora actual de la PC referenciado a UTC.
    let now = new Date();

    // Obtiene el resultado de la conversion de Fecha y Hora actual UTC a TimeStamp UNIX.
    const TimeStamp = ConvierteTimestamp(now);

    // Calculo de la FechaPasada, para hacer la consulta especifica a la API de Futuros de Binance.
    const FechaPasada = TimeStamp - ( LimiteEstudio * 60 * 1000 );

    // Se recorre cada elemento de la lista de monedas disponibles en Futuros de Binance.
    // LoteConsultasAPINoProcesadas, es la acumulacion de todas las consultas realizadas a la API de Futuros de Binance.
    const LoteConsultasAPINoProcesadas = InfoActual.map( ( InfoMonedaListada ) => {
        // Nombre de la moneda en estudio.
        const MonedaEstudio = InfoMonedaListada.symbol;

        // Se obtiene el histórico de los últimos LimiteEstudio minutos, espaciados por IntervaloEstudio minutos, de cada moneda 
        // listada en Futuros de Binance.
        return ObtenerHistoricoEspecifico( MonedaEstudio, IntervaloEstudio , FechaPasada );
    });

    // LoteConsultasAPIProcesadas es un arreglo que contiene el resultado de todas las promesas que fueron resueltas. El contenido de cada elemento
    // de LoteConsultasAPIProcesadas es el resultado de la consulta individual a la API de Futuros de Binance.
    const LoteConsultasAPIProcesadas = await Promise.all( LoteConsultasAPINoProcesadas );


// Pendiente el catch de error


    // Se hace el procesamiento de toda la data recolectada.
    InfoActual.map( ( InfoMonedaListada , Posicion ) => {
        // Se descartan las monedas que NO se van a operar. DEFIUSDT , ETHUSDT_220930 , BTCUSDT_220930 y BTCDOMUSDT.
        if ( InfoMonedaListada.symbol != 'DEFIUSDT' && InfoMonedaListada.symbol != 'ETHUSDT_220930' && InfoMonedaListada.symbol != 'BTCUSDT_220930' && InfoMonedaListada.symbol != 'BTCDOMUSDT' ) {
            
            // Simbolo completo de la moneda en estudio.
            const MonedaEstudio = InfoMonedaListada.symbol;

            // Precio actual de la moneda en estudio.
            const PrecioActual = InfoMonedaListada.price;

            // Extrae la información de la vela de hace LimiteEstudio minutos.
            const VelaEstudio = LoteConsultasAPIProcesadas[Posicion];

// Por alguna razon el arreglo devuelto es de la forma [ [ Objeto1, Objeto2, ... , ObjetoN] ]

            // Extrae el precio de Inicio de la vela en estudio.
            const InicioVela = VelaEstudio[0][1];

            // Extrae el precio de Cierre de la vela en estudio.
            const CierreVela = VelaEstudio[0][4];

            // Extrae la información de las últimas 24 Horas de la moneda en estudio.
            const Info24horasEstudio = Info24horas.filter(Info24horas => Info24horas.symbol === MonedaEstudio );

            // Extrae el Volumen de las últimas 24 horas, en Millones de USDT, de la moneda en estudio.
            const Volumen24HorasMM = ( Info24horasEstudio[0].quoteVolume / 1000000 );

            // Extrae la variación porcentual del precio en las últimas 24 horas, de la moneda en estudio.
            const VariacionPorcentual24Horas = Info24horasEstudio[0].priceChangePercent;

            // Calculos para la variación del precio en los últimos LimiteEstudio minutos.

            // Definir si la vela de hace LimiteEstudio minutos fue alcista (Verde = 1) o bajista (Roja = 0).
            let TipoVela = 1; // Vela Verde.
            if (InicioVela >= CierreVela ) {
                TipoVela = 0; // Vela Roja.
            };

            // Definir sentido del Movimiento. Bajista = 0, Alcista = 1 , Alcista-VelaRoja = 1 y Bajista-VelaVerde = 0.
            let SentidoMovimiento = 0;
            if ( InicioVela >= InfoMonedaListada.price ) {
                if ( CierreVela >= InfoMonedaListada.price ) {
                    SentidoMovimiento = 0; // Bajista.
                } else {
                    SentidoMovimiento = 1; // Alcista-VelaRoja.
                };
            } else {
                if ( CierreVela <= InfoMonedaListada.price ) {
                    SentidoMovimiento = 1; // Alcista.
                } else {
                    SentidoMovimiento = 0; // Bajista-VelaVerde.
                };
            };

            // Definir la referencia de precio, para el calculo, segun el tipo de vela y direccion del movimiento.
            let ReferenciaPrecio = 0;
            if ( SentidoMovimiento = 1 ) { // Movimiento Alcista?
                if ( TipoVela = 0 ) { // La vela es Verde?
                    ReferenciaPrecio = InicioVela; // La referencia es tomada desde el Inicio de la Vela.
                } else { // La vela es Roja
                    ReferenciaPrecio = CierreVela; // La referencia es tomada desde el Cierre de la Vela.
                };
            } else {
                if ( SentidoMovimiento = 0 ) { // Movimiento Bajista?
                    if ( TipoVela = 0 ) { // La vela es Verde?
                        ReferenciaPrecio = CierreVela; // La referencia es tomada desde el Cierre de la Vela.
                    } else { // La vela es Roja
                        ReferenciaPrecio = InicioVela; // La referencia es tomada desde el Inicio de la Vela.
                    };
                } else { // Para el caso Alcista-VelaRoja y Bajista-VelaVerde, la referencia sera tomada desde el Cierre de la Vela.
                    ReferenciaPrecio = CierreVela; // La referencia es tomada desde el Cierre de la Vela.
                };
            };

            // Calculo de la variación porcentual del Precio de los últimos LimiteEstudio minutos.
            let VariacionPorcentual = Math.abs( ( ( InfoMonedaListada.price - ReferenciaPrecio ) / InfoMonedaListada.price ) * 100 );
            if ( ( InfoMonedaListada.price - ReferenciaPrecio ) < 0 ) {
                SentidoMovimiento = 0; // Bajista.
            } else {
                SentidoMovimiento = 1; // Alcista.
            };

            // Extrae el simbolo de la Moneda en Estudio, sin la terminación USDT o BUSD.
            let SimboloMoneda = InfoMonedaListada.symbol.slice(0,-4).toLowerCase();

            // Variable usada para mostrar la información extraída de Coingecko una vez filtrada.
            let CoincidenciaCorrecta = false;

            // Se recorre el resultado de la consulta de Coningecko para extraer la informacion extra necesaria.
            InfoExtraCoingecko.map((InfoMoneda) => {
                // Se hace la comparación de los Simbolos de Futuros de Binance y de Coingecko para extraer, de este ultimo, la
                // información extra necesaria.
                switch( InfoMoneda.symbol ) {
                    case SimboloMoneda:
                        CoincidenciaCorrecta = true;
                    break;
                    case 'shib':
                        if ( SimboloMoneda == '1000shib') {
                            CoincidenciaCorrecta = true;
                        };
                    break;
                    case 'luna':
                        if ( SimboloMoneda == 'luna2') {
                            CoincidenciaCorrecta = true;
                        };
                    break;
                    case 'lunc':
                        if ( SimboloMoneda == '1000lunc') {
                            CoincidenciaCorrecta = true;
                        };
                    break;
                    case 'xec':
                        if ( SimboloMoneda == '1000xec') {
                            CoincidenciaCorrecta = true;
                        };
                    break;
                    case 'miota':
                        if ( SimboloMoneda == 'iota') {
                            CoincidenciaCorrecta = true;
                        };
                    break;  
                    default:
                        CoincidenciaCorrecta = false;
                    };

                if ( CoincidenciaCorrecta ) {

                    // Información a registrar en la Base de Datos:
                    // symbol: Par de estudio, referente a Futuros de Binance.
                    // price: Precio actual de la Criptomoneda en Futuros de Binance.
                    // priceChangePercent30min: Variación porcentual del precio de la Criptomoneda, en los últimos 30 minutos.
                    // priceChangePercent24hr: Variación porcentual del precio de la Criptomoneda, en las últimas 24 horas.
                    // volumeChange24hr: Volumen de negociación de la Criptomoneda (en millones de USDT o BUSD) durante las últimas 24 horas.
                    // name: Nombre de la Criptomoneda.
                    // ath: Máximo histórico.
                    // ath_change_percentage: Distancia porcentual desde el Precio actual al ATH.
                    // market_cap_rank: Posición general de la Criptomoneda según su market cap.
                    // SentidoMovimiento: Sentido del Movimiento calculado. Alcista =1 o Bajista = 0.

                    // Se registra en InformacionParaRegistrarBD cada Criptomoneda procesada.
                    InformacionParaRegistrarBD.push({
                        'symbol' : MonedaEstudio,
                        'price' : PrecioActual,
                        'priceChangePercent30min' : VariacionPorcentual,
                        'priceChangePercent24hr' : VariacionPorcentual24Horas,
                        'volumeChange24hr' : Volumen24HorasMM,
                        'name' : InfoMoneda.name,
                        'ath' : InfoMoneda.ath,
                        'ath_change_percentage' : InfoMoneda.ath_change_percentage,
                        'market_cap_rank' : InfoMoneda.market_cap_rank,
                        'SentidoMovimiento' : SentidoMovimiento
                      });

                    CoincidenciaCorrecta = false;
                };
            });
        };
    });

    for ( let i = 0; i < InformacionParaRegistrarBD.length; i++) {
        await InsertarInformacion(
            InformacionParaRegistrarBD[i].symbol,
            InformacionParaRegistrarBD[i].price,
            InformacionParaRegistrarBD[i].priceChangePercent30min,
            InformacionParaRegistrarBD[i].priceChangePercent24hr,
            InformacionParaRegistrarBD[i].volumeChange24hr,
            InformacionParaRegistrarBD[i].name,
            InformacionParaRegistrarBD[i].ath,
            InformacionParaRegistrarBD[i].ath_change_percentage,
            InformacionParaRegistrarBD[i].market_cap_rank,
            InformacionParaRegistrarBD[i].SentidoMovimiento
            );
    };

    console.timeEnd('Duracion del Ciclo');

    // Finalización del Proceso
    console.log("Fin del Proceso asíncrono.");
    // process.exit(0);

    return [];
};
//})();