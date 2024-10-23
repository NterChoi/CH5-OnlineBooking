import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Status } from '../type/showStatus.type';
import { Schedule } from '../../schedule/entities/schedule.entity';

@Entity({
  name: 'shows',
})
export class Show {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  image: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  category: string;

  @Column({ type: 'text', nullable: true })
  info: string;

  @Column({ type: 'enum', enum:Status, nullable: false })
  status: Status;

  @Column({ type: 'date', nullable: false })
  openDate: string;

  @Column({ type: 'date', nullable: true })
  endDate: string;

  @OneToMany(() => Schedule, (schedule) => schedule.show)
  schedule: Schedule;

}
