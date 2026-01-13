const { 
    RelatorioFinanceiro, 
    RelatorioAlunosLista, 
    RelatorioAlunosDetalhado,
    RelatorioPatrimonio,
    RelatorioPlanos 
} = require('../patterns/template/implementacoes');

const financeiroRepo = require('../repositories/financeiroRepository');

let alunoRepo; try { alunoRepo = require('../repositories/alunoRepository'); } catch (e) { console.log("Repo Alunos não encontrado"); }
let patrimonioRepo; try { patrimonioRepo = require('../repositories/patrimonioRepository'); } catch (e) { console.log("Repo Patrimonio não encontrado"); }
let planosRepo; try { planosRepo = require('../repositories/planosRepository'); } catch (e) { console.log("Repo Planos não encontrado"); }

exports.baixarRelatorio = async (req, res) => {
    const { tipo } = req.params;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=relatorio_${tipo}.pdf`);

    try {
        let relatorio;
        let dados; 
        let titulo;

        const tiposListaFinanceira = ['financeiro', 'receitas_alunos', 'outras_receitas', 'todas_receitas', 'todas_despesas'];
        
        if (tipo === 'balancete_mes') {
            relatorio = new RelatorioFinanceiro();
            titulo = "DEMONSTRATIVO DE RESULTADO (BALANCETE)";
            
            const tudo = await financeiroRepo.findAll();
            
            const receitasAlunos = tudo
                .filter(i => i.tipo === 'Receita' && i.categoria === 'Alunos')
                .reduce((acc, curr) => acc + Number(curr.valor), 0);
                
            const outrasReceitas = tudo
                .filter(i => i.tipo === 'Receita' && i.categoria !== 'Alunos')
                .reduce((acc, curr) => acc + Number(curr.valor), 0);
                
            const despesas = tudo
                .filter(i => i.tipo === 'Despesa')
                .reduce((acc, curr) => acc + Number(curr.valor), 0);
            
            const resultado = (receitasAlunos + outrasReceitas) - despesas;

            dados = {
                receitasAlunos,
                outrasReceitas,
                despesas,
                resultado
            };
            
            relatorio.gerar(res, dados, titulo);
        }

        else if (tiposListaFinanceira.includes(tipo)) {
            relatorio = new RelatorioFinanceiro();
            titulo = `RELATÓRIO: ${tipo.toUpperCase().replace(/_/g, ' ')}`;
            
            const dadosBrutos = await financeiroRepo.findAll();
            
            let listaFormatada = dadosBrutos.map(item => ({
                data: item.data ? new Date(item.data).toLocaleDateString('pt-BR') : '-',
                descricao: item.descricao || item.nome,
                tipo: item.tipo, 
                categoria: item.categoria, 
                valor: Number(item.valor)
            }));
            
            if (tipo === 'todas_despesas') {
                dados = listaFormatada.filter(d => d.tipo === 'Despesa');
            } 
            else if (tipo === 'todas_receitas') {
                dados = listaFormatada.filter(d => d.tipo === 'Receita');
            }
            else if (tipo === 'receitas_alunos') {
                dados = listaFormatada.filter(d => d.tipo === 'Receita' && d.categoria === 'Alunos');
            }
            else if (tipo === 'outras_receitas') {
                dados = listaFormatada.filter(d => d.tipo === 'Receita' && d.categoria !== 'Alunos');
            }
            else {
                dados = listaFormatada;
            }
            
            relatorio.gerar(res, dados, titulo);
        } 
        
        else if (tipo.startsWith('alunos')) {
            if (tipo === 'alunos_detalhado') {
                relatorio = new RelatorioAlunosDetalhado();
                titulo = "RELATÓRIO DE ALUNOS (DETALHADO)";
            } else {
                relatorio = new RelatorioAlunosLista();
                titulo = "RELATÓRIO DE ALUNOS (SIMPLES)";
            }
            
            const brutos = alunoRepo ? await alunoRepo.findAll() : [];
            dados = brutos.map(a => ({ 
                nome: a.nome || a.nome_aluno || 'Sem Nome', 
                matricula: a.matricula ? String(a.matricula) : '-', 
                plano: a.nome_plano || a.plano || (a.cod_plano ? `Cód. ${a.cod_plano}` : 'Sem Plano'), 
                status: a.status || a.status_aluno || 'Ativo', 
                cpf: a.cpf || a.cpf_aluno || '-', 
                telefone: a.telefone || '-', 
                email: a.email || a.email_aluno || '-', 
                endereco: { logradouro: a.logradouro || '', numero: a.numero || '' } 
            }));

            relatorio.gerar(res, dados, titulo);
        }

        else if (tipo === 'patrimonio') {
            relatorio = new RelatorioPatrimonio();
            titulo = "RELATÓRIO DE PATRIMÔNIO";
            const brutos = patrimonioRepo ? await patrimonioRepo.findAll() : [];
            dados = brutos.map(p => ({ 
                nome: p.nome, 
                codigo: p.codigo || p.id_patrimonio, 
                dataAquisicao: p.data_aquisicao ? new Date(p.data_aquisicao).toLocaleDateString('pt-BR') : '-', 
                status: p.status || p.status_patrimonio || 'Ativo' 
            }));
            relatorio.gerar(res, dados, titulo);
        }

        else if (tipo === 'planos') {
            relatorio = new RelatorioPlanos();
            titulo = "RELATÓRIO DE PLANOS";
            const planosBrutos = planosRepo ? await planosRepo.findAll() : [];
            dados = planosBrutos.map(p => ({
                nome: p.nome_plano || p.nome,
                codigo: p.cod_plano || p.codigo || '-',
                valor: p.valor_plano || p.valor || 0,
                duracao: p.duracao_unidade || p.duracao || '-',
                status: p.status_plano || p.status || 'Ativo'
            }));
            relatorio.gerar(res, dados, titulo);
        }

        else {
            console.log("Tipo inválido:", tipo);
            res.status(400).send("Tipo inválido");
        }

    } catch (erro) {
        console.error("Erro CRÍTICO no RelatorioController:", erro);
        res.status(500).json({ error: "Erro interno ao gerar PDF", details: erro.message });
    }
};