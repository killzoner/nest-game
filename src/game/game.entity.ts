import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Publisher } from '../publisher/publisher.entity';

@Entity({ name: 'GAME' })
export class Game {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 128 })
    title: string;

    @Column('int')
    price: number;

    @ManyToOne(() => Publisher, (pub: Publisher) => pub.games, { eager: true })
    @JoinColumn({ name: 'publisher' })
    publisher: Publisher;

    @Column('simple-array')
    tags: string[];

    @Column()
    releaseDate: Date;
}
