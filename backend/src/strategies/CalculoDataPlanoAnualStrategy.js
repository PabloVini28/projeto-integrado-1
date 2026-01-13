const CalculoDataStrategy = require('./CalculoDataStrategy');

class CalculoDataAnualStrategy extends CalculoDataStrategy {
    calcular(dataBase) {
        const novaData = new Date(dataBase);
        novaData.setHours(0, 0, 0, 0);
        novaData.setFullYear(novaData.getFullYear() + 1);
        return novaData;
    }
}

module.exports = CalculoDataAnualStrategy;