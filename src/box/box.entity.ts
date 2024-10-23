import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Schedule } from '../schedule/entities/schedule.entity';
import { Theater } from '../theater/theater.entity';

@Entity({
  name: 'boxes'
})
export class Box {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'enum', nullable: false })
  grade: string;

  @Column({ type: 'int', nullable: false })
  seatCount: number;

  @ManyToOne(() => Theater, (theater) => theater.box)
  theater: Theater;

  @OneToMany(() => Schedule, (schedule) => schedule.box)
  schedule: Schedule;
}