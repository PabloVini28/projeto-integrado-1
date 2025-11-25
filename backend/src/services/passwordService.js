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
    verificationCode: newCode,
    verificationCodeExpiry: expiresAt.toISOString(),
  });

  await sendVerificationEmail(funcionario.email, newCode);

  return { message: 'Novo código de verificação enviado.' };
}

async function initiatePasswordReset(email) {
  const funcionario = await repo.findByEmail(email);

  if (!funcionario) {
    return { message: 'Se o email estiver registrado, o código de reset foi enviado.' };
  }

  const newCode = generate6Digit();
  const expiresAt = new Date(Date.now() + 1000 * 60 * CODE_EXPIRY_MINUTES);

  await repo.update(funcionario.cpf, {
    passwordResetCode: newCode,
    passwordResetExpiry: expiresAt.toISOString(),
  });

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

  if (funcionario.passwordResetCode !== code) {
    const err = new Error('Código de reset inválido');
    err.status = 400;
    throw err;
  }

  if (now > new Date(funcionario.passwordResetExpiry)) {
    const err = new Error('Código de reset expirado');
    err.status = 400;
    throw err;
  }

  const hashedNewPassword = await bcrypt.hash(String(newPassword), 10);

  await repo.update(funcionario.cpf, {
    senha: hashedNewPassword,
    passwordResetCode: null,
    passwordResetExpiry: null,
  });

  return { message: 'Senha redefinida com sucesso.' };
}