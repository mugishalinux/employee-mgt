// src/utils/entity/sequence.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Sequence {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    key: string;

    @Column()
    value: number;

    static findOne(options: object) {
        // Define static method if not using repositories
        return this.findOne(options);
    }

    static save(sequence: Sequence) {
        // Define static method if not using repositories
        return this.save(sequence);
    }
}
