import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  DRAFT_POLL_INTERVAL_MS,
  DraftPollerService,
} from './draft-poller.service';
import { SleeperService } from '../sleeper/sleeper.service';
import { League } from '../../entities/league.entity';
import { Player } from '../../entities/player.entity';
import { DraftPick } from '../../entities/draft-pick.entity';

async function flushMicrotasks(): Promise<void> {
  for (let i = 0; i < 10; i++) {
    await Promise.resolve();
  }
}

describe('DraftPollerService', () => {
  let service: DraftPollerService;
  let sleeperService: { getDraftPicks: jest.Mock };
  let leagueRepo: { findOne: jest.Mock };
  let playerRepo: { findOne: jest.Mock };
  let draftPickRepo: { create: jest.Mock; save: jest.Mock };

  beforeEach(async () => {
    jest.useFakeTimers();

    sleeperService = { getDraftPicks: jest.fn() };
    leagueRepo = { findOne: jest.fn() };
    playerRepo = { findOne: jest.fn() };
    draftPickRepo = {
      create: jest.fn((x) => x),
      save: jest.fn((x) => Promise.resolve(x)),
    };

    const module = await Test.createTestingModule({
      providers: [
        DraftPollerService,
        { provide: SleeperService, useValue: sleeperService },
        { provide: getRepositoryToken(League), useValue: leagueRepo },
        { provide: getRepositoryToken(Player), useValue: playerRepo },
        { provide: getRepositoryToken(DraftPick), useValue: draftPickRepo },
      ],
    }).compile();

    service = module.get(DraftPollerService);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('relays only new picks on each poll and dedupes by pick_no', async () => {
    sleeperService.getDraftPicks
      .mockResolvedValueOnce([
        {
          round: 1,
          pick_no: 1,
          player_id: 'p1',
          picked_by: 'u1',
          roster_id: 1,
          draft_id: 'd1',
        },
      ])
      .mockResolvedValueOnce([
        {
          round: 1,
          pick_no: 1,
          player_id: 'p1',
          picked_by: 'u1',
          roster_id: 1,
          draft_id: 'd1',
        },
        {
          round: 1,
          pick_no: 2,
          player_id: 'p2',
          picked_by: 'u2',
          roster_id: 2,
          draft_id: 'd1',
        },
      ]);
    leagueRepo.findOne.mockResolvedValue({ id: 'league-1', draftId: 'd1' });
    playerRepo.findOne.mockResolvedValue(null);

    const onNewPicks = jest.fn();
    service.subscribe('d1', onNewPicks);
    await flushMicrotasks();

    expect(onNewPicks).toHaveBeenCalledTimes(1);
    expect(onNewPicks.mock.calls[0][0]).toEqual([
      {
        draftId: 'd1',
        round: 1,
        pickNumber: 1,
        pickedBy: 'u1',
        sleeperPlayerId: 'p1',
      },
    ]);

    jest.advanceTimersByTime(DRAFT_POLL_INTERVAL_MS);
    await flushMicrotasks();

    expect(onNewPicks).toHaveBeenCalledTimes(2);
    expect(onNewPicks.mock.calls[1][0]).toEqual([
      {
        draftId: 'd1',
        round: 1,
        pickNumber: 2,
        pickedBy: 'u2',
        sleeperPlayerId: 'p2',
      },
    ]);

    service.unsubscribe('d1');
  });

  it('skips persistence but still relays when no League matches the draftId', async () => {
    sleeperService.getDraftPicks.mockResolvedValue([
      {
        round: 1,
        pick_no: 1,
        player_id: 'p1',
        picked_by: 'u1',
        roster_id: 1,
        draft_id: 'orphan',
      },
    ]);
    leagueRepo.findOne.mockResolvedValue(null);

    const onNewPicks = jest.fn();
    service.subscribe('orphan', onNewPicks);
    await flushMicrotasks();

    expect(draftPickRepo.save).not.toHaveBeenCalled();
    expect(onNewPicks).toHaveBeenCalledTimes(1);

    service.unsubscribe('orphan');
  });

  it('stops polling only after the last subscriber unsubscribes (refcount)', async () => {
    sleeperService.getDraftPicks.mockResolvedValue([]);
    service.subscribe('d1', jest.fn());
    service.subscribe('d1', jest.fn());
    await Promise.resolve();

    service.unsubscribe('d1');
    jest.advanceTimersByTime(DRAFT_POLL_INTERVAL_MS);
    await Promise.resolve();
    expect(sleeperService.getDraftPicks).toHaveBeenCalledTimes(2);

    service.unsubscribe('d1');
    jest.advanceTimersByTime(DRAFT_POLL_INTERVAL_MS);
    await Promise.resolve();
    expect(sleeperService.getDraftPicks).toHaveBeenCalledTimes(2);
  });
});
