// Convertir Fecha y hora actual a TimeStamp UNIX - UTC
// Fuente: https://thewebdev.info/2021/04/17/how-to-convert-a-date-string-to-timestamp-in-javascript/
export const ConvierteTimestamp = (FechaHora) => {  
    const TimeStamp = new Date(FechaHora).getTime();  
    return TimeStamp; // Regresa el TimeStamp en milisegundos, formato UNIX.
};  

// Convertir TimeStamp UNIX a Fecha y hora UTC
// Fuente: https://www.delftstack.com/es/howto/javascript/javascript-convert-timestamp-to-date/
export const ConvierteFechaHora = (TimeStamp) => {
    const FechaHora = new Date(TimeStamp);
    return FechaHora.getTime();
};