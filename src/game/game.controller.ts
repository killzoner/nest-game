import { Controller, Get, Param, Res, HttpStatus, Put, Post, Body } from '@nestjs/common';
import { GameService } from './game.service';
import { Response } from 'express';
import { from } from 'rxjs';
import { map, first, switchMap } from 'rxjs/operators';
import { Game } from './game.entity';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) { }

  @Get()
  getAll() {
    return this.gameService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id, @Res() res: Response) {
    return from(this.gameService.getOne(id))
      .pipe(
        first(),
        map((game) => {
          if (game) {
            return res.status(HttpStatus.OK).json(game);
          }
          return res.status(HttpStatus.NOT_FOUND).json();
        }));
  }

  @Post()
  createOne(@Body() body: Game, @Res() res: Response) {
    return from(this.gameService.createOne(body))
      .pipe(
        first(),
        map((game) => {
          if (game) {
            return res.status(HttpStatus.OK).json(game);
          }
          return res.status(HttpStatus.NOT_FOUND).json();
        }));
  }

  @Put(':id')
  updateOne(@Param('id') id, @Body() body: Game, @Res() res: Response) {
    return from(this.gameService.getOne(id))
      .pipe(
        first(),
        map((game) => {
          if (game) {
            return res.status(HttpStatus.OK).json(game);
          }
          return res.status(HttpStatus.NOT_FOUND).json();
        }));
  }
}
