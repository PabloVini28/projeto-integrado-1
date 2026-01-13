const RelatorioTemplate = require('../RelatorioTemplate');

class RelatorioFinanceiro extends RelatorioTemplate {
    gerarCorpo(doc, dados) {
        
        if (Array.isArray(dados)) {
            this.gerarTabelaLista(doc, dados);
        } 
        
        else {
            this.gerarBalanceteResumo(doc, dados);
        }
    }

    gerarTabelaLista(doc, dados) {
        doc.font('Helvetica-Bold').fontSize(9).fillColor('#000');
        const yBase = doc.y;
        
        doc.text('DATA', 50, yBase);
        doc.text('DESCRIÇÃO', 130, yBase);
        doc.text('CATEGORIA', 400, yBase); 
        doc.text('TIPO', 550, yBase);
        doc.text('VALOR', 700, yBase, { align: 'right', width: 90 });

        doc.moveDown(0.5);
        doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke();
        doc.moveDown(0.5);

        doc.font('Helvetica').fontSize(9);
        let total = 0;

        dados.forEach((item, index) => {
            if (doc.y > 500) {
                doc.addPage({ layout: 'landscape', margin: 50 });
                doc.y = 50; 
            }

            if (index % 2 === 0) {
                doc.save();
                doc.rect(50, doc.y - 2, doc.page.width - 100, 14).fill('#f7f7f7');
                doc.restore();
            }

            const isReceita = item.tipo === 'Receita';
            const cor = isReceita ? '#008000' : '#d00000';
            const yAtual = doc.y;

            doc.fillColor('#000').text(item.data, 50, yAtual);
            doc.text(item.descricao, 130, yAtual, { width: 260, ellipsis: true });
            doc.text(item.categoria || '-', 400, yAtual, { width: 140, ellipsis: true });
            doc.text(item.tipo, 550, yAtual);
            doc.fillColor(cor).text(`R$ ${item.valor.toFixed(2)}`, 700, yAtual, { align: 'right', width: 90 });
            
            if (isReceita) total += item.valor; else total -= item.valor;
            doc.moveDown(0.8);
        });

        doc.moveDown();
        doc.font('Helvetica-Bold').fontSize(12).fillColor('#000')
           .text(`SALDO TOTAL: R$ ${total.toFixed(2)}`, 50, doc.y, { align: 'right', width: doc.page.width - 100 });
    }

    gerarBalanceteResumo(doc, dados) {
        const larguraPagina = doc.page.width - 100;
        let y = doc.y + 20;

        const desenharLinha = (titulo, valor, corValor = '#000') => {
            doc.save();
            doc.rect(50, y - 10, larguraPagina, 30).fill('#f5f5f5');
            doc.restore();

            doc.fillColor('#000').font('Helvetica').fontSize(12)
               .text(titulo, 70, y);
            
            doc.fillColor(corValor).font('Helvetica-Bold').fontSize(12)
               .text(`R$ ${valor.toFixed(2)}`, 50, y, { align: 'right', width: larguraPagina });
            
            y += 40; 
        };

        desenharLinha('(+) Receitas de Mensalidades/Planos', dados.receitasAlunos, '#008000');

        desenharLinha('(+) Outras Receitas', dados.outrasReceitas, '#008000');

        desenharLinha('(-) Despesas Totais', dados.despesas, '#d00000');

        doc.moveDown();
        doc.moveTo(50, y).lineTo(doc.page.width - 50, y).lineWidth(2).strokeColor('#333').stroke();
        y += 20;

        const resultado = dados.resultado;
        const corResultado = resultado >= 0 ? '#008000' : '#d00000';
        const corFundo = resultado >= 0 ? '#e8f5e9' : '#ffebee'; 

        doc.save();
        doc.rect(50, y - 15, larguraPagina, 45).fill(corFundo);
        doc.restore();
        
        doc.fillColor('#000').font('Helvetica-Bold').fontSize(16)
           .text('RESULTADO DO PERÍODO', 70, y);
        
        doc.fillColor(corResultado).fontSize(16)
           .text(`R$ ${resultado.toFixed(2)}`, 50, y, { align: 'right', width: larguraPagina });
    }
}

module.exports = RelatorioFinanceiro;