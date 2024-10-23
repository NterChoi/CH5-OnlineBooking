import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Show } from '../../show/entities/show.entity';
import { Theater } from '../../theater/theater.entity';
import { Box } from '../../box/box.entity';

@Entity({
  name: 'schedules',
})
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'datetime', nullable: false})
  showTime: string;

  @ManyToOne(() => Show, (show) => show.schedule)
  show: Show

  @ManyToOne(() => Theater, (theater) => theater.schedule)
  theater: Theater

  @ManyToOne(() => Box, (box) => box.schedule)
  box: Box


}
