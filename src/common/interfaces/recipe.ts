interface Recipe {
  title: string;
  description: string;
  ingridients: Ingridient[];
  instructions: string[];
  platform: string;
  creator: string;
  makingTime?: number;
  imageUrl?: string;
}
