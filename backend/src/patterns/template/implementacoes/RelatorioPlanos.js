const RelatorioTemplate = require('../RelatorioTemplate');

class RelatorioPlanos extends RelatorioTemplate {
    gerarCorpo(doc, dados) {
        doc.font('Helvetica-Bold').fontSize(10).fillColor('#000');
        const yBase = doc.y;

        doc.text('NOME DO PLANO', 50, yBase);
        doc.text('CÓDIGO', 300, yBase);
        doc.text('VALOR', 400, yBase);
        doc.text('DURAÇÃO', 550, yBase);
        doc.text('STATUS', 700, yBase);

        doc.moveDown(0.5);
        doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke();
        doc.moveDown(0.5);

        doc.font('Helvetica').fontSize(10);
        
        dados.forEach((plano, index) => {
            if (doc.y > 500) {
                doc.addPage({ layout: 'landscape', margin: 50 });
                doc.y = 50; 
            }

            if (index % 2 === 0) {
                doc.save();
                doc.rect(50, doc.y - 2, doc.page.width - 100, 15).fill('#f7f7f7');
                doc.restore();
            }

            const y = doc.y;

            const status = plano.status || 'Inativo';
            const corStatus = status.toLowerCase() === 'ativo' ? '#008000' : '#d00000';

            doc.fillColor('#000').text(plano.nome, 50, y, { width: 240, ellipsis: true });
            doc.text(plano.codigo, 300, y);
            doc.text(`R$ ${Number(plano.valor).toFixed(2)}`, 400, y);
            doc.text(plano.duracao, 550, y);
            
            doc.fillColor(corStatus).text(status, 700, y);

            doc.moveDown(0.8);
        });
    }
}

module.exports = RelatorioPlanos;