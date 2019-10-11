import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './game.entity';
import { map, first } from 'rxjs/operators';
import { from } from 'rxjs';

@Injectable()
export class GameService {

  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
  ) { }

  findAll(): Promise<Game[]> {
    return this.gameRepository.find({ relations: ['publisher'] });
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
