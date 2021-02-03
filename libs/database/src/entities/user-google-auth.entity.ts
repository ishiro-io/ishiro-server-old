import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import BaseEntity from "./base-entity";
import User from "./user.entity";

@Entity()
export default class UserGoogleAuthentication extends BaseEntity {
  @Column({ unique: true })
  accountId: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
