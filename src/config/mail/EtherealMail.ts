import nodemailder from 'nodemailer';
import HandlebarsMailsTemplate from './HandlebarsMailTemplate';


interface ITemplateVariable{
    [key: string]: string | number;
}

interface IPareseMailTemplate {
    template: string;
    variables: ITemplateVariable;
}

interface IMailContact {
    name: string;
    email: string;
}

interface ISendMail {
    to: IMailContact;
    from?: IMailContact;
    subject: string;
    templateData: IPareseMailTemplate;
}

export default class EtherealMail {
    static async sendMail({to, from, subject, templateData}: ISendMail): Promise<void> {

        const mailTemplate = new HandlebarsMailsTemplate();

        const account = await nodemailder.createTestAccount();
        const transporter = nodemailder.createTransport({
               host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass
                }
            }
        );
        const message = await transporter.sendMail( {
            from: {
                name: from?.name || 'Equipe API Vendas',
                address: from?.email || 'equipe@apivendas.com.br',
            },
            to: {
                name: to.name,
                address: to.email,
            },
            subject,
            html: await mailTemplate.parse(templateData),
        });

        console.log('Message sent: %s', message.messageId);
        console.log('Preview URL: %s', nodemailder.getTestMessageUrl(message));
    }
    
}