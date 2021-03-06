import { Location } from "../../../api/location/entities/location.entity";
import { User } from "../../../api/user/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("alerts")
export class Alert {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text", nullable: false })
  message: string;

  @Column("uuid")
  location_id: string;

  @ManyToOne(() => Location, { onDelete: "CASCADE" })
  @JoinColumn({ name: "location_id" })
  location: Location;

  @Column({ type: "boolean", nullable: true, default: true })
  isActive: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "sentTo" })
  receiver: User;

  @Column("uuid")
  sentTo: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "handledBy" })
  handler: User;

  @Column({ type: "uuid", nullable: true })
  handledBy: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
