const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

class RelatorioTemplate {

    gerar(res, dados, tituloRelatorio) {
        const doc = new PDFDocument({ margin: 50, size: 'A4', layout: 'landscape' });

        doc.pipe(res);

        this.gerarCabecalho(doc, tituloRelatorio);
        this.gerarCorpo(doc, dados);
        this.gerarRodape(doc);

        doc.end();
    }

    gerarCabecalho(doc, titulo) {
        const larguraPagina = doc.page.width - 100;
        
        const caminhoImagem = path.join(__dirname, '../../assets/logo.png');

        if (fs.existsSync(caminhoImagem)) {
            doc.image(caminhoImagem, 50, 45, { width: 40 });
        } else {
            doc.rect(50, 45, 40, 40).fill('#e0e0e0');
            console.warn(`Aviso: Logo não encontrado em ${caminhoImagem}`);
        }

        doc.fillColor('#000000').fontSize(16).font('Helvetica-Bold')
           .text('Corpo em Forma', 100, 50);

        doc.fillColor('#4d4d4d').fontSize(9).font('Helvetica')
           .text('Rua Tabelião Eneas, 60, Centro, Quixadá, Ceará', 100, 68)
           .text('CNPJ: 40.522.014/0001-90 | Tel: (88) 996106590', 100, 80);

        doc.fillColor('#000000').fontSize(14).font('Helvetica-Bold')
           .text(titulo, 50, 50, { align: 'right', width: larguraPagina });

        const dataHoje = new Date().toLocaleDateString('pt-BR');
        doc.fillColor('#4d4d4d').fontSize(10).font('Helvetica')
           .text(`Emitido em: ${dataHoje}`, 50, 70, { align: 'right', width: larguraPagina });

        doc.moveDown(2);
        doc.moveTo(50, 100).lineTo(doc.page.width - 50, 100).strokeColor('#aaaaaa').stroke();
        doc.moveDown(2);
    }

    gerarRodape(doc) {
        const bottom = doc.page.height - 50;
        const larguraPagina = doc.page.width - 100;
        
        doc.fontSize(8).fillColor('#888888')
           .text('Corpo em Forma Gestão - Relatório Gerado Automaticamente', 50, bottom, { 
               align: 'center', width: larguraPagina 
           });
    }

    gerarCorpo(doc, dados) {
        throw new Error("O método 'gerarCorpo' deve ser implementado pela subclasse!");
    }
}

module.exports = RelatorioTemplate;