const CalculoDataStrategy = require('./CalculoDataStrategy');

class CalculoDataMensalStrategy extends CalculoDataStrategy {
    calcular(dataBase) {
        const novaData = new Date(dataBase);
        novaData.setHours(0, 0, 0, 0);
        novaData.setMonth(novaData.getMonth() + 1);
        return novaData;
    }
}

module.exports = CalculoDataMensalStrategy;