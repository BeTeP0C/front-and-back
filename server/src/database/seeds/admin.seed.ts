import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../../modules/users/entities/user.entity';

@Injectable()
export class AdminSeeder implements OnModuleInit {
  private readonly logger = new Logger(AdminSeeder.name);

  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async onModuleInit() {
    const adminEmail = 'admin@techstore.com';
    const existing = await this.repo.findOne({
      where: { email: adminEmail },
    });

    if (existing) {
      this.logger.log('Admin user already exists, skipping...');
      return;
    }

    this.logger.log('Creating default admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = this.repo.create({
      email: adminEmail,
      firstName: 'Admin',
      lastName: 'TechStore',
      password: hashedPassword,
      role: UserRole.ADMIN,
    });

    await this.repo.save(admin);
    this.logger.log(
      `Default admin created: ${adminEmail} / admin123`,
    );
  }
}
