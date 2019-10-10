import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Game } from '../game/game.entity';

@Entity({ name: 'PUBLISHER' })
export class Publisher {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 128 })
    name: string;

    @Column('bigint')
    siret: number;

    @Column({ type: 'varchar', length: 50 })
    phone: string;

    @OneToMany(() => Game, game => game.publisher, { eager: false })
    public games: Game[];
}
