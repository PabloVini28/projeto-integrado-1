CREATE TABLE IF NOT EXISTS funcionarios (
	id_funcionario VARCHAR(64) PRIMARY KEY,
	nome_funcionario VARCHAR(255) NOT NULL,
	email_funcionario VARCHAR(255) UNIQUE NOT NULL,
	cpf_funcionario VARCHAR(14) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    nivel_acesso VARCHAR(64) NOT NULL DEFAULT 'Funcionario'
);