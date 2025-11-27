const bcrypt = require('bcrypt');
const repo = require('../repositories/funcionarioRepository'); 
const { sendVerificationEmail, sendPasswordResetEmail } = require('./emailService'); 

const CODE_EXPIRY_MINUTES = 10;

function generate6Digit() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function resendVerificationCode(cpf_funcionario) {
  const funcionario = await repo.findByCpf(cpf_funcionario);

  if (!funcionario) {
    const err = new Error('Funcionário não encontrado');
    err.status = 404;
    throw err; 
  }

  if (funcionario.isEnabled) {
    const err = new Error('Email já verificado');
    err.status = 400;
    throw err;
  }

  const newCode = generate6Digit();
  const expiresAt = new Date(Date.now() + 1000 * 60 * CODE_EXPIRY_MINUTES);

  await repo.update(cpf_funcionario, {
    verificationcode: newCode, 
    verificationcodeexpiry: expiresAt.toISOString(),
  }); 

  await sendVerificationEmail(funcionario.email, newCode);
  return { message: 'Novo código de verificação enviado.' };
}

async function initiatePasswordReset(email) {
  const funcionario = await repo.findByEmail(email);

  if (!funcionario) {
    console.log("DEBUG: Funcionário não encontrado pelo email:", email);
    return { message: 'Se o email estiver registrado, o código de reset foi enviado.' };
  }

  // --- ÁREA DE DEBUG (Adicione isso) ---
  console.log("DEBUG: Objeto Funcionário Completo:", JSON.stringify(funcionario, null, 2));
  
  const idParaUpdate = funcionario.cpf || funcionario.cpf_funcionario;
  console.log("DEBUG: ID que será usado no UPDATE:", idParaUpdate);
  // ------------------------------------

  const newCode = generate6Digit();
  const expiresAt = new Date(Date.now() + 1000 * 60 * CODE_EXPIRY_MINUTES);

  // Armazene o resultado do update para ver se ele retorna algo
  const resultadoUpdate = await repo.update(idParaUpdate, {
    passwordresetcode: newCode,               
    passwordresetexpiry: expiresAt.toISOString(), 
  });
  
  console.log("DEBUG: Resultado do Update:", resultadoUpdate);

  await sendPasswordResetEmail(email, newCode);

  return { message: 'Se o email estiver registrado, o código de reset foi enviado.' };
}

async function resetPassword(email, code, newPassword) {
  const funcionario = await repo.findByEmail(email);

  if (!funcionario) {
    const err = new Error('Funcionário não encontrado');
    err.status = 404;
    throw err;
  }

  const now = new Date();
  
  const dbExpiry = funcionario.passwordResetExpiry || funcionario.passwordresetexpiry;
  const dbCode = funcionario.passwordResetCode || funcionario.passwordresetcode;

  const expiryDate = new Date(dbExpiry);

  if (dbCode !== code) {
    const err = new Error('Código de reset inválido');
    err.status = 400;
    throw err;
  }

  if (now > expiryDate) {
    const err = new Error('Código de reset expirado');
    err.status = 400;
    throw err;
  }

  const hashedNewPassword = await bcrypt.hash(String(newPassword), 10);

  await repo.update(funcionario.cpf || funcionario.cpf_funcionario, {
    senha: hashedNewPassword,
    passwordresetcode: null,
    passwordresetexpiry: null,
  });

  return { message: 'Senha redefinida com sucesso.' };
}

module.exports = {
  resendVerificationCode,
  initiatePasswordReset,
  resetPassword
};