import { Role } from '../types/userRole.type';
import { BeforeInsert, Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import bcrypt from 'bcrypt';
@Index('email', ['email'], { unique: true })
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

  @BeforeInsert() // 이벤트 훅을 이용하여 데이터가 삽입되기 전에 무조건 해싱을 함
  async hashPasswordBeforeInsert(){
    this.password = await bcrypt.hash(this.password, 10);
  }
}
