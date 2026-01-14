const CalculoDataStrategy = require('./CalculoDataStrategy');

class CalculoDataDiarioStrategy extends CalculoDataStrategy {
    calcular(dataBase) {
        const novaData = new Date(dataBase);
        novaData.setHours(0, 0, 0, 0);
        novaData.setDate(novaData.getDate() + 1);
        return novaData;
    }
}

module.exports = CalculoDataDiarioStrategy;