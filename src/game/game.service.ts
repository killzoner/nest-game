import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './game.entity';

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

  getOne(id: string): Promise<Game> {
    return this.gameRepository.findOne(id);
  }

  updateOne(id: string, game: Game): Promise<Game> {
    return this.gameRepository.save(game);
  }

  deleteOne(): Promise<Game[]> {
    return this.gameRepository.find({ relations: ['publisher'] });
  }

}
