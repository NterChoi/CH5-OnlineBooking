import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Box } from '../box/box.entity';
import { Schedule } from '../schedule/entities/schedule.entity';

@Entity({
  name: 'theaters',
})
export class Theater {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  name: string;

  @Column({ type: 'string', nullable: false })
  address: string;

  @OneToMany(() => Box, (box) => box.theater)
  box: Box;

  @OneToMany(() => Schedule, (schedule) => schedule.theater)
  schedule: Schedule;
}