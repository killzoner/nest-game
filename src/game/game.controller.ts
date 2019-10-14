import { Controller, Get, Param, Res, HttpStatus, Put, Post, Body, Logger, Delete, Query } from '@nestjs/common';
import { GameService } from './game.service';
import { Response } from 'express';
import { from, of } from 'rxjs';
import { map, first, switchMap, catchError } from 'rxjs/operators';
import { Game } from './game.entity';
import { ApiUseTags } from '@nestjs/swagger';
import { GameDTO } from './game.dto';
import { Publisher } from '../publisher/publisher.entity';
import { QueryFailedError } from 'typeorm';

@Controller('game')
@ApiUseTags('game')
export class GameController {
  private readonly logger = new Logger(GameController.name);
  private runningCleanup = false;

  constructor(private readonly gameService: GameService) { }

  /**
   * Triggers the process to remove old games and make
   * promotion to remaining old ones
   * @param id
   * @param res
   */
  @Post('/cleanup')
  doDiscountAndCleanup(@Res() res: Response) {
    if (this.runningCleanup) {
      return res.status(HttpStatus.CONFLICT).json();
    }
    this.runningCleanup = true;
    this.gameService.discountProcess().then(() => this.runningCleanup = false);
    return res.status(HttpStatus.OK).json();
  }

  @Get()
  getAll(@Query('publisherName') publisherName) {
    return this.gameService.findAll(publisherName);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @Res() res: Response) {
    return from(this.gameService.getOne(id))
      .pipe(
        first(),
        map((game) => {
          if (game) {
            return res.status(HttpStatus.OK).json(game);
          }
          this.logger.warn(`Game with id ${id} not found`);
          return res.status(HttpStatus.NOT_FOUND).json();
        }));
  }

  @Post()
  createOne(@Body() body: GameDTO, @Res() res: Response) {
    const foundGame = from(this.gameService.getOne(body.id)).pipe(first());
    return foundGame.pipe(
      switchMap((game) => {
        if (game) {
          this.logger.warn(`Game with id ${game.id} already exists`);
          return of(res.status(HttpStatus.CONFLICT).json());
        }
        const newGame = new Game();
        newGame.price = body.price;
        newGame.releaseDate = body.releaseDate;
        newGame.tags = body.tags;
        newGame.title = body.title;
        newGame.publisher = Object.assign(new Publisher(), { id: body.publisherId });
        const create = from(this.gameService.createOne(newGame)).pipe(first());
        return create.pipe(
          map(
            (value) => res.status(HttpStatus.CREATED).json(value),
          ));
      }),
      catchError((error) => {
        this.logger.error(error);
        if (error instanceof QueryFailedError) {
          return of(res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error.message));
        }
        throw error.message;
      }),
    );
  }

  @Put(':id')
  updateOne(@Param('id') id, @Body() body: GameDTO, @Res() res: Response) {
    const foundGame = from(this.gameService.getOne(id)).pipe(first());
    return foundGame.pipe(
      switchMap((game) => {
        if (!game) {
          this.logger.warn(`Game with id ${game.id} does not exists`);
          return of(res.status(HttpStatus.NOT_FOUND).json());
        }
        const newGame = new Game();
        newGame.id = id;
        newGame.price = body.price;
        newGame.releaseDate = body.releaseDate;
        newGame.tags = body.tags;
        newGame.title = body.title;
        newGame.publisher = Object.assign(new Publisher(), { id: body.publisherId });
        const create = from(this.gameService.createOne(newGame)).pipe(first());
        return create.pipe(
          map(
            (value) => res.status(HttpStatus.OK).json(value),
          ));
      }),
      catchError((error) => {
        this.logger.error(error);
        if (error instanceof QueryFailedError) {
          return of(res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error.message));
        }
        throw error.message;
      }),
    );
  }

  @Delete(':id')
  deleteOne(@Param('id') id: number, @Res() res: Response) {
    return from(this.gameService.getOne(id))
      .pipe(
        first(),
        switchMap((game) => {
          if (!game) {
            this.logger.warn(`Game with id ${id} not found`);
            return of(res.status(HttpStatus.NOT_FOUND).json());
          }
          const create = from(this.gameService.deleteOne(id)).pipe(first());
          return create.pipe(
            map(
              (value) => res.status(HttpStatus.OK).json(value),
            ));
        }));
  }

}
