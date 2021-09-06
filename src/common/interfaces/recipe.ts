import { Ingridient } from './ingridient';

export interface Recipe {
  title: string;
  description: string;
  ingridients: Ingridient[];
  instructions: string[];
  platform: string;
  creator: string;
  imageUrl?: string;
  originalUrl: string;
}
