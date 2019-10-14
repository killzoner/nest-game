import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './game.entity';
import { map, first } from 'rxjs/operators';
import { from } from 'rxjs';
import * as moment from 'moment';

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

  discountProcess(): Promise<void> {
    /**
     * Remove older than 18 months
     */
    const remove = this.getTooOldGames();

    /**
     * Discount of 20%
     * to games between 12 and 18 months
     */
    const promo = this.getOldGames();

    return Promise.all([remove, promo]).then(() => { return; });
  }

  private getTooOldGames(): Promise<void> {
    const eighteenMonthsAgo = moment().subtract(18, 'months').calendar();
    this.logger.log(`Removing games older than  ${eighteenMonthsAgo}`);
    this.gameRepository
      .createQueryBuilder('game')
      .where('game.releaseDate < :eighteenMonthsAgo', { eighteenMonthsAgo })
      .getMany().then((values) => {
        const ids = values.map(v => v.id);
        if (ids.length) {
          this.logger.log(`Removing games with ids ${ids}`);
          this.gameRepository.delete(ids);
        }
        console.log(values);
      });
    return Promise.resolve();
  }

  private getOldGames(): Promise<void> {
    const eighteenMonthsAgo = moment().subtract(18, 'months').calendar();
    const twelveMonthsAgo = moment().subtract(12, 'months').calendar();
    this.logger.log(`Promo on games between  ${eighteenMonthsAgo} and ${twelveMonthsAgo}`);
    this.gameRepository
      .createQueryBuilder('game')
      .where('game.releaseDate >= :eighteenMonthsAgo AND game.releaseDate <= :twelveMonthsAgo ',
        {
          eighteenMonthsAgo,
          twelveMonthsAgo,
        },
      )
      .getMany().then((values) => {
        const ids = values.map(v => v.id);
        if (ids.length) {
          this.logger.log(`Promo on games with ids ${ids}`);
          values.map((v) => { v.price = +(v.price * 0.8).toFixed(2); });
          this.gameRepository.save(values);
        }
        console.log(values);
      });
    return Promise.resolve();
  }

}
