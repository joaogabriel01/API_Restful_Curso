import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm";
import UsersRepository from "../typeorm/repositories/UsersRepository";
import User from '../typeorm/entities/User';
import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: User;
    token: string;
}

class CreateSessionsService {
    public async execute({ email, password }: IRequest): Promise<IResponse> {
        const usersRepository = getCustomRepository(UsersRepository);
        const user = await usersRepository.findByEmail(email);

        if(!user) {
            throw new AppError('Incorrect email/password combination', 401);
        }

        const passwordCOnfirmed = await compare(password, user.password);

        if(!passwordCOnfirmed) {
            throw new AppError('Incorrect email/password combination', 401);
        }

        const token = sign({},'827f6b3e84b31db5dc85313fe3e58a8b',{
            subject: user.id,
            expiresIn: '1d',
        });

        return {
            user,
            token
        }
    }


}

export default CreateSessionsService;