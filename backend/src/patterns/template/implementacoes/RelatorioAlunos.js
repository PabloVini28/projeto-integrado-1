const RelatorioTemplate = require('../RelatorioTemplate');

class RelatorioAlunosLista extends RelatorioTemplate {
    gerarCorpo(doc, dados) {
        doc.font('Helvetica-Bold').fontSize(10).fillColor('#000');
        const yBase = doc.y;

        doc.text('NOME', 50, yBase);
        doc.text('MATRÍCULA', 400, yBase);
        doc.text('PLANO', 550, yBase);
        doc.text('STATUS', 700, yBase);

        doc.moveDown(0.5);
        doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke();
        doc.moveDown(0.5);

        doc.font('Helvetica').fontSize(10);
        
        dados.forEach((aluno, index) => {
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
            
            const nome = aluno.nome || 'Sem Nome';
            const matricula = aluno.matricula ? String(aluno.matricula) : '-';
            const plano = aluno.plano || '-';
            const status = aluno.status || '-';

            doc.text(nome, 50, y, { width: 340, ellipsis: true }); 
            doc.text(matricula, 400, y);
            doc.text(plano, 550, y);
            doc.text(status, 700, y);
            
            doc.moveDown(0.8);
        });
    }
}

class RelatorioAlunosDetalhado extends RelatorioTemplate {
    gerarCorpo(doc, alunos) {
        doc.font('Helvetica-Bold').fontSize(8).fillColor('#000');
        const yBase = doc.y;

        doc.text('NOME', 50, yBase);
        doc.text('CPF', 200, yBase);
        doc.text('EMAIL', 280, yBase);
        doc.text('TELEFONE', 430, yBase);
        doc.text('PLANO', 510, yBase);
        doc.text('STATUS', 590, yBase);
        doc.text('ENDEREÇO', 650, yBase);

        doc.moveDown(0.5);
        doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke();
        doc.moveDown(0.5);

        doc.font('Helvetica').fontSize(8);
        
        alunos.forEach((aluno, index) => {
            if (doc.y > 500) {
                doc.addPage({ layout: 'landscape', margin: 50 });
                doc.y = 50; 
            }

            if (index % 2 === 0) {
                doc.save();
                doc.rect(50, doc.y - 2, doc.page.width - 100, 12).fill('#f7f7f7');
                doc.restore();
            }

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
}

module.exports = { RelatorioAlunosLista, RelatorioAlunosDetalhado };