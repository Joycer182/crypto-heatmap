import axios from "axios";

// https://github.com/miscavage/CoinGecko-API

// https://www.coingecko.com/en/api/documentation

// URL base de la API de Coingecko.
const API_BASE_URL = "https://api.coingecko.com/api/v3";

// Obtiene el listado de monedas publicadas en Coingecko.
export const ObtenerListadoMonedasCoingecko = async () => {
    try {
        // { data } es un Objeto JSon, el resultado de la consulta a la API es un Objeto JSon
        const { data } = await axios.get(API_BASE_URL + "/coins/list");
        return data;
    } catch (e) {
        console.error(e);
        return [];
    };
};

// Obtiene la información detallada de cada moneda listada en Coingecko que tambien esta listada en Binance.
export const ObtenerInfoExtraMonedas = async () => {
    try {
        // Cantidad de monedas en Futuros de Binance contra BUSD = 27
        // Cantidad de monedas en Futuros de Binance contra USDT = 142  (Descarcar BTCDOMUSDT y DEFIUSDT), serian 140
        // Descartar ETHUSDT_220930
        // Descartar BTCUSDT_220930
        // Descarcar BTCDOMUSDT
        // Descarcar DEFIUSDT, es un indice que se refiere a las finazas decentralizadas
        // 23 Monedas en comun, contra BUSD y USDT
        // 4 Monedas solo disponibles contra BUSD
        // 140 Monedas solo disponibles contra USDT
        const NombreMonedas0120 = 'bitcoin,ethereum,cardano,binancecoin,maker,serum,coin98,safepal,nem,zencash,metal,basic-attention-token,enjincoin,reserve-rights-token,omisego,automata,iostoken,dogecoin,algorand,ankr';
        const NombreMonedas2140 = 'chiliz,0x,avalanche-2,siacoin,tomochain,arweave,celo,swipe,ocean-protocol,polkadot,unifi-protocol-dao,alpha-finance,harmony,bitshares,elrond-erd-2,dusk-network,republic-protocol,kava,neo,bitcoin-cash';
        const NombreMonedas4160 = 'civic,sushi,livepeer,solana,woo-network,nkn,filecoin,aave,holotoken,gitcoin,apecoin,gala,vechain,aragon,bella-protocol,havven,bakerytoken,storm,reef,origin-protocol';
        const NombreMonedas6180 = 'project-galaxy,iexec-rlc,tezos,eos,coti,storj,helium,immutable-x,optimism,arpa-chain,dash,decentraland,celer-network,the-graph,1inch,oasis-network,kusama,linear,cosmos,chromaway';
        const NombreMonedas81100 = 'iotex,monero,fantom,iota,certik,uniswap,tron,ontology,curve-dao-token,kyber-network-crystal,ravencoin,theta-token,icon,skale,api3,klay-token,waves,alien-worlds,my-neighbor-alice,flow';
        // IOTA asi aparece en Binance = MIOTA asi aparece en coingecko
        const NombreMonedas101120 = 'mask-network,loopring,near,mines-of-dalarnia,audius,constitutiondao,cartesi,matic-network,balancer,zilliqa,ethereum-name-service,digibyte,stellar,jasmycoin,dent,qtum,ftx-token,litecoin,flamingo-finance,thorchain';
        const NombreMonedas121140 = 'zcash,shiba-inu,axie-infinity,band-protocol,stepn,ethereum-classic,tellor,compound-governance-token,internet-computer,chainlink,hedera-hashgraph,ripple,binaryx,raydium,dydx,yearn-finance,litentry,the-sandbox,bluzelle,ecash';
        // 1000SHIB = 1000 x SHIB   /   1000XEC = 1000 x XEC
        
        // Monedas comunes contra BUSD y USDT, actualmente son 23. Fecha: 07-07-2022
        const MonedasComunesBUSDUSDT = 'ripple,alien-worlds,ethereum,ftx-token,binancecoin,fantom,litecoin,stepn,the-sandbox,avalanche-2,near,tron,bitcoin,apecoin,project-galaxy,waves,polkadot,dogecoin,internet-computer,chainlink,gala,cardano,solana';
        
        // Monedas disponibles solo contra BUSD, actualmente son 4. Fecha: 07-07-2022
        const MonedasSoloContraBUSD = 'dodo,terra-luna-2,terra-luna,anchor-protocol';
        // 1000LUNC = 1000 x LUNC => terra-luna

        const MonedasdeEstudio = NombreMonedas0120 + ',' + NombreMonedas2140 + ',' + NombreMonedas4160 + ',' + NombreMonedas6180 + ',' + NombreMonedas81100 + ',' + NombreMonedas101120 + ',' + NombreMonedas121140 + ',' + MonedasSoloContraBUSD;

        // { data } es un Objeto JSon, el resultado de la consulta a la API es un Objeto JSon
        const { data } = await axios.get(API_BASE_URL + `/coins/markets?vs_currency=usd&per_page=250&ids=${(MonedasdeEstudio)}`);
        return data;
    } catch (e) {
        console.error(e);
        return [];
    };
};