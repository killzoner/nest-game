import { Controller, Get } from '@nestjs/common';
import { PublisherService } from './publisher.service';
import { ApiUseTags } from '@nestjs/swagger';

@Controller('publisher')
@ApiUseTags('publisher')
export class PublisherController {
  constructor(private readonly publisherService: PublisherService) { }

  @Get()
  getAll() {
    return this.publisherService.findAll();
  }

}
