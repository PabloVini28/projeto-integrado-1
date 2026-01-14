class AlunoBuilder {
  constructor() {
    this.aluno = {};
  }

  comIdentificacao(nome, cpf, email) {
    if (nome) this.aluno.nome_aluno = nome;
    if (cpf) this.aluno.cpf_aluno = cpf;
    if (email) this.aluno.email_aluno = email;
    return this;
  }

  comMatricula(matricula) {
    if (matricula) this.aluno.matricula = matricula;
    return this;
  }

  comContato(telefone, logradouro, numero) {
    if (telefone) this.aluno.telefone = telefone;
    if (logradouro) this.aluno.logradouro = logradouro;
    if (numero) this.aluno.numero = numero;
    return this;
  }

  comDadosPessoais(genero, dataNascimento) {
    if (genero) this.aluno.genero = genero;
    if (dataNascimento) this.aluno.data_nascimento = dataNascimento;
    return this;
  }

  comPlano(codPlano, dataExpiracao, status) {
    if (codPlano !== undefined) this.aluno.cod_plano = codPlano;
    if (dataExpiracao) this.aluno.data_expiracao = dataExpiracao;
    if (status) this.aluno.status_aluno = status;
    return this;
  }

  build() {
    return this.aluno;
  }
}

module.exports = AlunoBuilder;