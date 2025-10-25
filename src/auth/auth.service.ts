import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthResponse } from './types/auth-response.type';
import { SignupInput } from './dto/signup.input';
import { UsersService } from 'src/users/users.service';
import { LoginInput } from './dto/login.input';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async signup(signupInput: SignupInput): Promise<AuthResponse> {

        const user = await this.usersService.create(signupInput);

        const token = this.jwtService.sign({ id: user.id });

        return {
            user,
            token,
        };
    }

    async login(loginInput: LoginInput): Promise<AuthResponse> {

        const { email, password } = loginInput;
        const user = await this.usersService.findOneByEmail(email);

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            throw new BadRequestException('Invalid credentials');
        }

        const token = this.jwtService.sign({ id: user.id });

        return {
            user,
            token,
        };
    }

    async validateUser(id: number): Promise<User> {

        const result =  await this.usersService.findOneById(id);

        //Quitar password del objeto user
        const { password, ...user } = result;

        if (!user.isActive) {
            throw new BadRequestException('User is inactive');
        }

        return user as User;
    }

    revalidateToken(user: User): AuthResponse {
        const token = this.jwtService.sign({ id: user.id });
        return { user, token };
    }
}
