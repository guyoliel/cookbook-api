import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Recipe } from 'src/common/entities/recipe';
import { Repository } from 'typeorm';
import { Scraper } from './interfaces/scraper';

@Injectable()
export class ScraperService {
  constructor(
    @Inject('Scraper') private scraper: Scraper<Recipe>,
    @InjectRepository(Recipe) private recipesRepository: Repository<Recipe>,
  ) {
    this.scraper = scraper;
    this.recipesRepository = recipesRepository;
  }

  async scrape(url: string): Promise<Recipe> {
    const existingRecipe = await this.recipesRepository.findOne({
      originalUrl: url,
    });
    if (!existingRecipe) {
      if (this.scraper.canScrape(url)) {
        const recipe = await this.scraper.scrape(url);
        await this.recipesRepository.insert(recipe);
        return recipe;
      } else {
        throw new Error("Can't scrape recipe with current scraper");
      }
    } else {
      throw new Error('Recipe already exists in database');
    }
  }
}
