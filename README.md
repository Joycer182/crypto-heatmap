# crypto-heatmap
Monitor del comportamiento de las criptomonedas listadas en Futuros de Binance, empleando para ello un filtrado específico para la aplicación de una estrategia de Scalping.

# Características:
El programa hace las consultas pertinentes a la API de Futuros de Binance para obtener la información de interés para la aplicación de la estrategia de Scalping.

Adicionalmente, se hacen consultas a la API de Coingecko para obtener información adicional de las criptomonedas listadas en Futuros de Binance.

Los resultados, del procesamiento de cada criptomoneda, son almacenados en una Base de Datos MySQL, con el fin de poder ser consultados posteriormente por una herramienta de análisis y visualización de métricas, como lo es Grafana.

# Informacion obtenida por cada criptomeda:
* Par de estudio, referente a Futuros de Binance (ej. BTCUDT,EHTBUSD).
* Precio actual de la Criptomoneda en Futuros de Binance.
* Variación porcentual del precio de la Criptomoneda, en los últimos 30 minutos (calculado en temporalidad de 1 minuto).
* Variación porcentual del precio de la Criptomoneda, en las últimas 24 horas.
* Volumen de negociación de la Criptomoneda durante las últimas 24 horas, expresado en millones de USDT o BUSD.
* Nombre de la Criptomoneda (ej. Bitcoin, Ethereum).
* Máximo histórico (All Time High = ATH).
* Distancia porcentual desde el Precio actual al ATH.
* Posición general de la Criptomoneda según su capitalizacion de mercado.
* Sentido del Movimiento calculado. Alcista =1 o Bajista = 0.

Por defecto el análisis se basa en la temporalidad de 1m y en un intervalo de estudio de 30 minutos, esto puede ser cambiado para aplicar otros tipos de estrategias en otras temporalidades (esto está sujeto a la disponibilidad de temporalidades e información disponible en la API de Futuros de Binance).