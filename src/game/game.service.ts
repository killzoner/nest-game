import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './game.entity';
import { map, first } from 'rxjs/operators';
import { from } from 'rxjs';

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);

  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
  ) { }

  findAll(publisherName?: string): Promise<Game[]> {

    let query = this.gameRepository.
      createQueryBuilder('game')
      .leftJoinAndSelect('game.publisher', 'publisher')
      .printSql();

    if (publisherName) {
      this.logger.log(`Searching for specific publisher with name ${publisherName}`);
      query = query
        .where('publisher.name = :publisherName', { publisherName })
        .printSql();
    }

    return query.getMany();
  }

  createOne(game: Game): Promise<Game> {
    return this.gameRepository.save(game);
  }

  getOne(id: number): Promise<Game> {
    return this.gameRepository.findOne(id);
  }

  updateOne(id: number, game: Game): Promise<Game> {
    return this.gameRepository.findOne(id).then(
      () => this.gameRepository.update(id, game).then(() => this.gameRepository.findOne(id)));
  }

  deleteOne(id): Promise<void> {
    return from(this.gameRepository.delete(id)).pipe(first(), map(() => { return; })).toPromise();
  }

}
