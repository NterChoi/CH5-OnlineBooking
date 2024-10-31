import { Role } from '../types/userRole.type';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Point } from '../../point/entities/point.entity';
import { Reservation } from '../../reservation/entities/reservation.entity';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', select: false, nullable: false })
  password: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  nickname: string;

  @Column({ type: 'enum', enum: Role, default: Role.User, nullable: false })
  role: Role;

  @OneToMany(() => Point, (point) => point.user)
  point: Point;

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservation: Reservation;

  // @BeforeInsert() // 이벤트 훅을 이용하여 데이터가 삽입되기 전에 무조건 해싱을 함
  // async hashPasswordBeforeInsert(){
  //   console.log('이 로그가 나오면 이벤트 훅이 된거야')
  //   this.password = await bcrypt.hash(this.password, 10);
  // }
}
