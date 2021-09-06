import { Unit } from './unit';
import { Column } from 'typeorm';

export class Ingridient {
  @Column()
  name: string;
  @Column()
  quantity: number;
  @Column()
  units: Unit;
}
