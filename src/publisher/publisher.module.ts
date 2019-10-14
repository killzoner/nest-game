import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublisherService } from './publisher.service';
import { Publisher } from './publisher.entity';
import { PublisherController } from './publisher.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Publisher]),
  ],
  controllers: [PublisherController],
  providers: [PublisherService],
  exports: [TypeOrmModule],
})
export class PublisherModule { }
