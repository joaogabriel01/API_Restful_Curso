import AppError from "@shared/errors/AppError";
import { config } from "process";
import path from 'path';
import { getCustomRepository } from "typeorm";
import UsersRepository from "../typeorm/repositories/UsersRepository";
import UserTokensRepository from "../typeorm/repositories/UserTokensRepository";
import EtherealMail from '@config/mail/EtherealMail';

interface IRequest {
    email: string;
}

class SendForgotPasswordEmailService {
    public async execute({ email}: IRequest): Promise<void> {
        const usersRepository = getCustomRepository(UsersRepository);
        const userTokenRepository = getCustomRepository(UserTokensRepository);

        const user = await usersRepository.findByEmail(email);

        if(!user){
            throw new AppError('User does not exists.');
        }

        console.log(user);

        const { token } = await userTokenRepository.generate(user.id);
        const forgotPasswordTemplate = path.resolve(__dirname, '..', 'views','forgot_password.hbs');

        console.log(token);
        await EtherealMail.sendMail({
            to: {
                name: user.name,
                email: user.email,
            },
            subject: '[API Vendas] Recuperação de senha',
            templateData: {
                file: forgotPasswordTemplate,
                variables: {
                    name: user.name,
                    link: `http://localhost:3000/reset_password?token=${token}`,
                }
            }
        });
        
    }

}

export default SendForgotPasswordEmailService;