import { Publisher } from '../publisher/publisher.entity';
import { ApiModelProperty } from '@nestjs/swagger';

export class GameDTO {
    @ApiModelProperty()
    id: number;

    @ApiModelProperty()
    title: string;

    @ApiModelProperty()
    price: number;

    @ApiModelProperty()
    publisherId: number;

    @ApiModelProperty()
    tags: string[];

    @ApiModelProperty()
    releaseDate: Date;
}
