import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Organization } from '../entities/organization.entity';
import { Role } from '@task-management/data';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockOrgRepository = {
    findOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(() => 'mock-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Organization),
          useValue: mockOrgRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate JWT token on login', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: '$2b$10$hashedPassword',
      name: 'Test User',
      role: Role.ADMIN,
      organizationId: 1,
    };

    mockUserRepository.findOne.mockResolvedValue(mockUser);

    const result = await service.login({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result).toHaveProperty('access_token');
    expect(result).toHaveProperty('user');
  });
});
