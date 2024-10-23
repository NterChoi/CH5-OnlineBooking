import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Status } from '../type/showStatus.type';

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

  @Column({ type: 'enum', nullable: false })
  status: Status;

  @Column({ type: 'date', nullable: false })
  openDate: string;

  @Column({ type: 'date', nullable: true })
  endDate: string;

}
