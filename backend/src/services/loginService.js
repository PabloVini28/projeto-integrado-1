const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const funcionarioRepo = require('../repositories/funcionarioRepository');

const SECRET_KEY = process.env.SECRET_KEY || 'changeme';

async function authenticate(email, password) {
    if (!email || !password) {
        const err = new Error('Email e senha são obrigatórios');
        err.status = 400;
        throw err;
    }

    const user = await funcionarioRepo.findByEmail(email);
    if (!user) {
        const err = new Error('Credenciais inválidas');
        err.status = 401;
        throw err;
    }

    const match = await bcrypt.compare(password, user.senha);
    if (!match) {
        const err = new Error('Credenciais inválidas');
        err.status = 401;
        throw err;
    }

    const payload = {
        id: user.id_funcionario,
        nivel_acesso: user.nivel_acesso
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

    const { senha, ...userSafe } = user || {};
    return { token, user: userSafe };
}

module.exports = { authenticate };