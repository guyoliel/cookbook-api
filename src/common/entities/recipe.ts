import { Ingridient } from './ingridient';
import { Entity, Column, ObjectIdColumn } from 'typeorm';

@Entity()
export class Recipe {
  @ObjectIdColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column((type) => Ingridient)
  ingridients: Ingridient[];

  @Column()
  instructions: string[];

  @Column()
  platform: string;

  @Column()
  creator: string;

  @Column()
  imageUrl?: string;

  @Column()
  originalUrl: string;
}
