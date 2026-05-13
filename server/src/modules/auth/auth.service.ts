import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../../entities/user.entity';
import { SleeperService } from '../sleeper/sleeper.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { LinkSleeperDto } from './dto/link-sleeper.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly sleeperService: SleeperService,
  ) {}

  async signup(dto: SignupDto) {
    const existing = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({ email: dto.email, passwordHash });

    await this.userRepo.save(user);

    return this.issueToken(user);
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.issueToken(user);
  }

  async linkSleeper(userId: string, dto: LinkSleeperDto) {
    const sleeperUser = await this.sleeperService.getUser(dto.username);

    if (!sleeperUser) {
      throw new BadRequestException('Sleeper username not found');
    }

    const taken = await this.userRepo.findOne({
      where: { sleeperId: sleeperUser.user_id },
    });

    if (taken) {
      throw new ConflictException('This Sleeper account is already linked');
    }

    await this.userRepo.update(userId, {
      sleeperId: sleeperUser.user_id,
      username: sleeperUser.username,
      displayName: sleeperUser.display_name,
      avatar: sleeperUser.avatar ?? undefined,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...user } = await this.userRepo.findOneOrFail({
      where: { id: userId },
    });

    return user;
  }

  private issueToken(user: User) {
    return {
      access_token: this.jwtService.sign({ sub: user.id, email: user.email }),
    };
  }
}
