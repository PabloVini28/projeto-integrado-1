CREATE TABLE IF NOT EXISTS alunos (
	matricula SERIAL PRIMARY KEY,
	nome_aluno VARCHAR(255) NOT NULL,
	email_aluno VARCHAR(255) UNIQUE NOT NULL,
	cpf_aluno VARCHAR(14) UNIQUE NOT NULL,
	telefone VARCHAR(20),
	data_nascimento DATE NOT NULL, 
	logradouro VARCHAR(255), 
	endereco_aluno VARCHAR(255),
	numero VARCHAR(8),
	status_aluno VARCHAR(64) NOT NULL DEFAULT 'Ativo',
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);