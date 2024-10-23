import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Schedule } from '../schedule/entities/schedule.entity';
import { Theater } from '../theater/theater.entity';
import { Grade } from './boxGrade.type';

@Entity({
  name: 'boxes'
})
export class Box {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'int', nullable: false })
  goldSeatCount: number;

  @Column({ type: 'int', nullable: false })
  silverSeatCount: number;

  @Column({ type: 'int', nullable: false })
  bronzeSeatCount: number;

  @ManyToOne(() => Theater, (theater) => theater.box)
  theater: Theater;

  @OneToMany(() => Schedule, (schedule) => schedule.box)
  schedule: Schedule;
}