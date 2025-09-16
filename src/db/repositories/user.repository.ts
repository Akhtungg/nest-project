import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/db/entities/user.entity';
import { CreateUserDto } from 'src/dto/create.user.dto';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserRepository {
    private readonly userRepository: Repository<UserEntity>;

    constructor(private dataSource: DataSource) {
        this.userRepository = dataSource.getRepository(UserEntity);
    }

    async createUser(data: CreateUserDto): Promise<UserEntity> {
        try {
            const user = this.userRepository.create(data);
            return await this.userRepository.save(user);
        } catch (error) {
            throw error;
        }
    }

    async findAll(): Promise<UserEntity[]> {
        try {
            return this.userRepository.find({});
        } catch (error) {
            throw new Error('Users not found');
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this.userRepository.delete(id);
        } catch (error) {
            throw new Error(error);
        }
    }

    async findByEmail(email: string): Promise<UserEntity> {
        try {
            return this.userRepository.findOneBy({ email });
        } catch (error) {
            throw new Error('User not found');
        }
    }

    async findById(userId: string): Promise<UserEntity> {
        try {
            return this.userRepository.findOne({ where: { id: userId } });
        } catch (error) {
            throw new Error('User not found');
        }
    }
}
