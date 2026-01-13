const RelatorioTemplate = require('../RelatorioTemplate');

class RelatorioPatrimonio extends RelatorioTemplate {
    gerarCorpo(doc, dados) {
         doc.font('Helvetica-Bold').fontSize(10).fillColor('#000');
        const yBase = doc.y;

        doc.text('NOME DO ITEM', 50, yBase);
        doc.text('CÓDIGO', 400, yBase);
        doc.text('DATA AQUISIÇÃO', 550, yBase);
        doc.text('STATUS', 700, yBase);
        doc.moveDown(0.5);
        doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke();
        doc.moveDown(0.5);
        doc.font('Helvetica').fontSize(10);

        dados.forEach((item, index) => {
            if (doc.y > 500) { doc.addPage({ layout: 'landscape', margin: 50 }); doc.y = 50; }
            if (index % 2 === 0) { doc.save(); doc.rect(50, doc.y - 2, doc.page.width - 100, 15).fill('#f7f7f7'); doc.restore(); }
            
            const y = doc.y;

            doc.fillColor('#000').text(item.nome, 50, y, { width: 340, ellipsis: true });
            doc.text(item.codigo, 400, y);
            doc.text(item.dataAquisicao, 550, y);
            doc.text(item.status, 700, y);
            doc.moveDown(0.8);
        });
    }
}
module.exports = RelatorioPatrimonio;