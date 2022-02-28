import AppError from "@shared/errors/AppError";
import { compare, hash } from 'bcryptjs'
import { getCustomRepository } from "typeorm";
import Customer from "../typeorm/entities/Customer";
import CustomersRepository from "../typeorm/repositories/CustomersRepository";

interface IREquest {
    id: string;
    name: string;
    email: string;

}

class UpdateCustomerService {
    public async execute({ id, name, email }: IREquest): Promise<Customer>{
        const customerRepository = getCustomRepository(CustomersRepository);
        
        const customer = await customerRepository.findById(id);
        if(!customer) {
            throw new AppError('User not found');
        }

        const customerUpadeEmail = await customerRepository.findByEmail(email);
        if(customerUpadeEmail && customerUpadeEmail.id != id) {
            throw new AppError('There is already one customer with this email');
        }

        customer.name = name;
        customer.email = email;
        
        await customerRepository.save(customer);

        return customer;
    }


}

export default UpdateCustomerService;