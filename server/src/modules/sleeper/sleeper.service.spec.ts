import { Test } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { SleeperService } from './sleeper.service';
import { of } from 'rxjs';

describe('SleeperService', () => {
  let service: SleeperService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SleeperService,
        {
          provide: HttpService,
          useValue: { get: jest.fn() }, // mock — replaces real HttpService
        },
      ],
    }).compile();

    service = module.get(SleeperService);
    httpService = module.get(HttpService);
  });

  it('getUser returns the user from Sleeper', async () => {
    const mockUser = {
      user_id: '123',
      username: 'testuser',
      display_name: 'Test User',
      avatar: null,
    };

    jest
      .spyOn(httpService, 'get')
      .mockReturnValue(of({ data: mockUser } as any));

    const result = await service.getUser('testuser');

    expect(httpService.get).toHaveBeenCalledWith(
      'https://api.sleeper.app/v1/user/testuser',
    );
    expect(result).toEqual(mockUser);
  });

  it('getLeaguesForUser returns leagues array', async () => {
    const mockLeagues = [
      { league_id: 'abc', name: 'My League', season: '2024' },
    ];

    jest
      .spyOn(httpService, 'get')
      .mockReturnValue(of({ data: mockLeagues } as any));

    const result = await service.getLeaguesForUser('123', '2024');

    expect(httpService.get).toHaveBeenCalledWith(
      'https://api.sleeper.app/v1/user/123/leagues/nfl/2024',
    );
    expect(result).toEqual(mockLeagues);
  });
});
