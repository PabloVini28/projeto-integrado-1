// backend/src/patterns/AlunoBuilder.js

class AlunoBuilder {
  constructor() {
    this.aluno = {};
  }

  // Identificação básica
  comIdentificacao(nome, cpf, email) {
    if (nome) this.aluno.nome_aluno = nome;
    if (cpf) this.aluno.cpf_aluno = cpf;
    if (email) this.aluno.email_aluno = email;
    return this;
  }

  // Dados de sistema
  comMatricula(matricula) {
    if (matricula) this.aluno.matricula = matricula;
    return this;
  }

  // Endereço e Contato
  comContato(telefone, logradouro, numero) {
    if (telefone) this.aluno.telefone = telefone;
    if (logradouro) this.aluno.logradouro = logradouro;
    if (numero) this.aluno.numero = numero;
    return this;
  }

  // Dados Pessoais
  comDadosPessoais(genero, dataNascimento) {
    if (genero) this.aluno.genero = genero;
    if (dataNascimento) this.aluno.data_nascimento = dataNascimento;
    return this;
  }

  // Plano e Status
  comPlano(codPlano, dataExpiracao, status) {
    if (codPlano !== undefined) this.aluno.cod_plano = codPlano;
    if (dataExpiracao) this.aluno.data_expiracao = dataExpiracao;
    if (status) this.aluno.status_aluno = status;
    return this;
  }

  // Método final que entrega o objeto
  build() {
    return this.aluno;
  }
}

module.exports = AlunoBuilder;