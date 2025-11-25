const nodemailer = require('nodemailer'); 
const repo = require('../repositories/funcionarioRepository'); // Assumindo que este caminho está correto

// --- CONSTANTES ---
const CODE_EXPIRY_MINUTES = 60;
const CODE_EXPIRY_MS = CODE_EXPIRY_MINUTES * 60 * 1000;

// Configuração do Transportador Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

/**
 * Gera um código numérico aleatório de 6 dígitos.
 * @returns {string} Código de 6 dígitos.
 */
const generate6Digit = () => String(Math.floor(100000 + Math.random() * 900000));

/**
 * Envia o email de boas-vindas e verificação para um novo funcionário.
 * @param {string} email O email do destinatário.
 * @param {string} code O código de verificação de 6 dígitos.
 */
async function sendVerificationEmail(email, code) {
  const mailOptions = {
    from: `SISTEMA <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Verificação de Email - Boas-Vindas à Corpo em Forma!',
    html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #007bff; color: white; padding: 20px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px;">👋 Boas-Vindas ao Time Corpo em Forma!</h1>
            </div>
            <div style="padding: 25px; text-align: center;">
                <p style="font-size: 16px; margin-bottom: 20px;">
                    Olá, <strong>novo colaborador</strong>!
                </p>
                <p style="font-size: 16px; margin-bottom: 30px;">
                    É com grande entusiasmo que recebemos você na **Academia Corpo em Forma**. Estamos animados para ter seu talento e energia!
                </p>
                <div style="background-color: #f0f8ff; border: 1px solid #cceeff; border-left: 5px solid #007bff; padding: 15px; border-radius: 4px; margin-bottom: 30px;">
                    <p style="font-size: 18px; margin: 0 0 10px 0; color: #007bff; font-weight: bold;">
                        Para ativar sua conta e começar, use o código abaixo:
                    </p>
                    <strong style="display: inline-block; font-size: 32px; color: #28a745; background-color: #e9ecef; padding: 10px 20px; border-radius: 6px; letter-spacing: 2px;">
                        ${code}
                    </strong>
                </div>
                <p style="font-size: 14px; color: #6c757d;">
                    Este código é pessoal e intransferível. Ele **expira em ${CODE_EXPIRY_MINUTES} minutos** por motivos de segurança.
                </p>
            </div>
            <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #6c757d; border-top: 1px solid #eee;">
                <p style="margin: 5px 0;">
                    Seja bem-vindo(a) à nossa missão de transformar vidas!
                </p>
                <p style="margin: 0;">
                    Equipe Corpo em Forma.
                </p>
            </div>
        </div>
    `
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email de verificação enviado para ${email}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Falha ao enviar email de verificação para ${email}. Erro:`, error);
    throw error;
  }
}

/**
 * Envia o email de redefinição de senha com um código único.
 * @param {string} email O email do destinatário.
 * @param {string} code O código de redefinição de 6 dígitos.
 */
async function sendPasswordResetEmail(email, code) {
  const mailOptions = {
    from: `SISTEMA <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Redefinição de Senha - Seu Código Único',
    html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; border: 1px solid #ffc107; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #ffc107; color: #333; padding: 15px; text-align: center;">
                <h2 style="margin: 0; font-size: 20px;">🔒 Solicitação de Redefinição de Senha</h2>
            </div>
            <div style="padding: 25px; text-align: left;">
                <p style="font-size: 16px; margin-bottom: 20px;">
                    Olá,
                </p>
                <p style="font-size: 16px; margin-bottom: 25px;">
                    Recebemos uma solicitação para redefinir a senha da sua conta na <strong>Academia Corpo em Forma</strong>.
                </p>
                <div style="background-color: #fff3cd; border: 1px solid #ffeeba; padding: 15px; border-radius: 4px; margin-bottom: 30px; text-align: center;">
                    <p style="font-size: 18px; margin: 0 0 10px 0; color: #856404; font-weight: bold;">
                        Seu Código de Redefinição de Senha é:
                    </p>
                    <strong style="display: inline-block; font-size: 30px; color: #dc3545; background-color: #fce8bf; padding: 10px 20px; border-radius: 6px; letter-spacing: 2px;">
                        ${code}
                    </strong>
                </div>
                <p style="font-size: 16px; margin-bottom: 15px;">
                    Utilize este código na página de redefinição para criar uma nova senha.
                </p>
                <p style="font-size: 14px; color: #6c757d; border-top: 1px solid #eee; padding-top: 15px;">
                    ⚠️ <strong>IMPORTANTE:</strong> Este código expira em <strong>${CODE_EXPIRY_MINUTES} minutos</strong>.
                    Se você não solicitou esta redefinição, por favor, ignore este email. Sua senha atual permanecerá segura.
                </p>
            </div>
            <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #6c757d; border-top: 1px solid #eee;">
                <p style="margin: 0;">
                    Segurança da Conta - Academia Corpo em Forma.
                </p>
            </div>
        </div>
    `
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email de reset enviado para ${email}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Falha ao enviar email de reset para ${email}. Erro:`, error);
    throw error;
  }
}

/**
 * Verifica o código de email fornecido e ativa a conta se for válido e não expirado.
 * @param {string} cpf_funcionario O CPF do funcionário.
 * @param {string} code O código de verificação.
 */
async function verifyEmail(cpf_funcionario, code) {
  const funcionario = await repo.findByCpf(cpf_funcionario);

  if (!funcionario) {
    const err = new Error('Funcionário não encontrado');
    err.status = 404;
    throw err;
  }

  const now = new Date();

  if (funcionario.isEnabled) {
    const err = new Error('Email já verificado');
    err.status = 400;
    throw err;
  }

  if (funcionario.verificationCode !== code) {
    const err = new Error('Código de verificação inválido');
    err.status = 400;
    throw err;
  }

  if (now > new Date(funcionario.verificationCodeExpiry)) {
    const err = new Error('Código de verificação expirado');
    err.status = 400;
    throw err;
  }

  await repo.update(cpf_funcionario, {
    isEnabled: true,
    verificationCode: null,
    verificationCodeExpiry: null,
  });

  return { message: 'Email verificado com sucesso. Conta ativada.' };
}

async function verifyTransporter() {
  try {
    await transporter.verify();
    console.log('✅ Conexão SMTP verificada com sucesso. Pronto para enviar e-mails.');
    return { ok: true };
  } catch (err) {
    console.error('❌ Erro na verificação do SMTP. Verifique as variáveis SMTP_USER e SMTP_PASS no seu arquivo .env');
    console.error('Detalhes do erro:', err.message);
    return { ok: false, error: err.message };
  }
}

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  verifyEmail,
  verifyTransporter,
  generate6Digit,
  CODE_EXPIRY_MINUTES,
  CODE_EXPIRY_MS
};