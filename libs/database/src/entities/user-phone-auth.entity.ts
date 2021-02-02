import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import BaseEntity from "./base-entity";
import User from "./user.entity";

@Entity()
export default class UserPhoneAuthentication extends BaseEntity {
  @Column({ unique: true })
  phoneNumber: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
