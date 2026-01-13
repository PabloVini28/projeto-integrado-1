const RelatorioTemplate = require('../RelatorioTemplate');

class RelatorioAlunos extends RelatorioTemplate {
    
    constructor(tipo) {
        super();
        this.tipo = tipo; 
    }

    gerarCorpo(doc, dados) {
        if (this.tipo === 'detalhado') {
            this.renderDetalhado(doc, dados);
        } else {
            this.renderSimples(doc, dados);
        }
    }

    renderSimples(doc, dados) {
        doc.font('Helvetica-Bold').fontSize(10).fillColor('#000');
        const yBase = doc.y;

        doc.text('NOME', 50, yBase);
        doc.text('MATRÍCULA', 400, yBase);
        doc.text('PLANO', 550, yBase);
        doc.text('STATUS', 700, yBase);

        this.desenharLinhaDivisoria(doc);

        doc.font('Helvetica').fontSize(10);
        
        dados.forEach((aluno, index) => {
            this.verificarNovaPagina(doc);
            this.desenharZebrado(doc, index, 15);

            const y = doc.y;
            
            doc.text(aluno.nome || 'Sem Nome', 50, y, { width: 340, ellipsis: true }); 
            doc.text(aluno.matricula ? String(aluno.matricula) : '-', 400, y);
            doc.text(aluno.plano || '-', 550, y);
            doc.text(aluno.status || '-', 700, y);
            
            doc.moveDown(0.8);
        });
    }

    renderDetalhado(doc, dados) {
        doc.font('Helvetica-Bold').fontSize(8).fillColor('#000');
        const yBase = doc.y;

        doc.text('NOME', 50, yBase);
        doc.text('CPF', 200, yBase);
        doc.text('EMAIL', 280, yBase);
        doc.text('TELEFONE', 430, yBase);
        doc.text('PLANO', 510, yBase);
        doc.text('STATUS', 590, yBase);
        doc.text('ENDEREÇO', 650, yBase);

        this.desenharLinhaDivisoria(doc);

        doc.font('Helvetica').fontSize(8);
        
        dados.forEach((aluno, index) => {
            this.verificarNovaPagina(doc);
            this.desenharZebrado(doc, index, 12);

            const y = doc.y;
            const end = aluno.endereco ? `${aluno.endereco.logradouro || ''}, ${aluno.endereco.numero || ''}` : '-';

            doc.text(aluno.nome || '-', 50, y, { width: 145, ellipsis: true });
            doc.text(aluno.cpf || '-', 200, y);
            doc.text(aluno.email || '-', 280, y, { width: 140, ellipsis: true });
            doc.text(aluno.telefone || '-', 430, y);
            doc.text(aluno.plano || '-', 510, y, { width: 75, ellipsis: true });
            doc.text(aluno.status || '-', 590, y);
            doc.text(end, 650, y, { width: 140, ellipsis: true });

            doc.moveDown(0.8);
        });
    }

    desenharLinhaDivisoria(doc) {
        doc.moveDown(0.5);
        doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke();
        doc.moveDown(0.5);
    }

    verificarNovaPagina(doc) {
        if (doc.y > 500) {
            doc.addPage({ layout: 'landscape', margin: 50 });
            doc.y = 50; 
        }
    }

    desenharZebrado(doc, index, height) {
        if (index % 2 === 0) {
            doc.save();
            doc.rect(50, doc.y - 2, doc.page.width - 100, height).fill('#f7f7f7');
            doc.restore();
        }
    }
}

module.exports = RelatorioAlunos;