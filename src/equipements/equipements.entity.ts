import { ObjectId } from 'mongodb';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity('Equipment')
export class EquipementsEntity {
  @ObjectIdColumn()
  id: ObjectId;

  @Column({ type: 'string' })
  name: string;
}
