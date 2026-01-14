const CalculoDataMensalStrategy = require('./CalculoDataMensalStrategy');
const CalculoDataAnualStrategy = require('./CalculoDataAnualStrategy');
const CalculoDataDiarioStrategy = require('./CalculoDataDiarioStrategy');

class CalculoData {
    static criarStrategy(duracao) {
        const d = duracao ? duracao.toLowerCase() : "";
        
        if (d === 'mensal') {
            return new CalculoDataMensalStrategy();
        } else if (d === 'anual') {
            return new CalculoDataAnualStrategy();
        } else if (d === 'diário' || d === 'diario') {
            return new CalculoDataDiarioStrategy();
        } else {
            return new CalculoDataMensalStrategy();
        }
    }
}

module.exports = CalculoData;