import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("blacklist")
export class Blacklist extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column("text")
  token: string;
  @Column()
  created_at: Date;
}
