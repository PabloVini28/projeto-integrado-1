const nodemailer = require('nodemailer'); 
const repo = require('../repositories/funcionarioRepository'); 

const CODE_EXPIRY_MINUTES = 60;
const CODE_EXPIRY_MS = CODE_EXPIRY_MINUTES * 60 * 1000;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const generate6Digit = () => String(Math.floor(100000 + Math.random() * 900000));

async function sendVerificationEmail(email, code) {
  const mailOptions = {
    from: `Corpo em Forma - <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Verificação de Email - Boas-Vindas à Corpo em Forma!',
    html: `
        <div>
            <div>
                <h1>Bem-vindo ao Time!</h1>
            </div>
            
            <div>
                <p>
                    Olá, <strong>novo colaborador</strong>!
                </p>
                <p>
                    É com grande entusiasmo que recebemos você na <strong>Academia Corpo em Forma</strong>. Estamos animados para ter seu talento e energia!
                </p>
                
                <div>
                    <p>
                        Seu código de ativação:
                    </p>
                    <strong>
                        ${code}
                    </strong>
                </div>
                
                <p>
                    Este código é pessoal e intransferível.<br>
                    Ele expira em <strong>${CODE_EXPIRY_MINUTES} minutos</strong>.
                </p>
            </div>
            
            <div>
                <p>
                    Seja bem-vindo(a) à nossa missão de transformar vidas!
                </p>
                <p>
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

async function sendPasswordResetEmail(email, code) {
  const mailOptions = {
    from: `SISTEMA <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Redefinição de Senha - Seu Código Único',
    html: `
        <div>
            <div>
                <h2>Redefinição de Senha</h2>
            </div>
            
            <div>
                <p>
                    Olá,
                </p>
                <p>
                    Recebemos uma solicitação para redefinir a senha da sua conta na <strong>Academia Corpo em Forma</strong>.
                </p>
                
                <div>
                    <p>
                        Use este código:
                    </p>
                    <strong>
                        ${code}
                    </strong>
                </div>
                
                <p>
                    Utilize este código na página de redefinição para criar uma nova senha.
                </p>
                
                <p>
                    <strong>IMPORTANTE:</strong> Este código expira em <strong>${CODE_EXPIRY_MINUTES} minutos</strong>.
                    Se você não solicitou esta redefinição, por favor, ignore este email. Sua senha atual permanecerá segura.
                </p>
            </div>
            
            <div>
                <p>
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

async function sendPasswordResetEmail(email, code) {
  const mailOptions = {
    from: `SISTEMA <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Redefinição de Senha - Seu Código Único',
    html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; border: 2px solid #000000; border-radius: 8px; overflow: hidden;">
            <!-- Cabeçalho Preto com Texto Amarelo -->
            <div style="background-color: #000000; color: #F2D95C; padding: 20px; text-align: center; border-bottom: 4px solid #F2D95C;">
                <h2 style="margin: 0; font-size: 22px; text-transform: uppercase;">🔒 Redefinição de Senha</h2>
            </div>
            
            <div style="padding: 30px; text-align: left; background-color: #ffffff;">
                <p style="font-size: 16px; margin-bottom: 20px; color: #000;">
                    Olá,
                </p>
                <p style="font-size: 16px; margin-bottom: 25px; color: #333;">
                    Recebemos uma solicitação para redefinir a senha da sua conta na <strong>Academia Corpo em Forma</strong>.
                </p>
                
                <!-- Box do Código -->
                <div style="background-color: #000000; padding: 20px; border-radius: 8px; margin-bottom: 30px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
                    <p style="font-size: 14px; margin: 0 0 10px 0; color: #ffffff; text-transform: uppercase; letter-spacing: 1px;">
                        Use este código:
                    </p>
                    <strong style="display: inline-block; font-size: 32px; color: #000000; background-color: #F2D95C; padding: 10px 25px; border-radius: 4px; letter-spacing: 3px; font-weight: 800;">
                        ${code}
                    </strong>
                </div>
                
                <p style="font-size: 15px; margin-bottom: 15px; color: #333;">
                    Utilize este código na página de redefinição para criar uma nova senha.
                </p>
                
                <p style="font-size: 13px; color: #666; border-top: 1px solid #eee; padding-top: 15px; margin-top: 20px;">
                    ⚠️ <strong>IMPORTANTE:</strong> Este código expira em <strong>${CODE_EXPIRY_MINUTES} minutos</strong>.
                    Se você não solicitou esta redefinição, por favor, ignore este email. Sua senha atual permanecerá segura.
                </p>
            </div>
            
            <!-- Rodapé Simples -->
            <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #000000; border-top: 1px solid #ddd;">
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