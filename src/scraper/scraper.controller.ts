import { Controller, Get, Param } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Ingridient } from 'src/common/interfaces/ingridient';
import { Unit } from 'src/common/interfaces/unit';
import { Recipe } from '../common/interfaces/recipe';
import { TastyUtilsService } from './tastyUtils.service';
@Controller('scraper')
export class ScraperController {
  constructor(private tastyUtils: TastyUtilsService) {}
  @Get()
  getScrape(): string {
    return '<h1>lets start scraping!</h1>';
  }

  @Get(':site')
  async startScraping(@Param('site') site: string): Promise<Recipe> {
    let recipe: Recipe;
    await (async () => {
      // Wait for browser launching.
      const browser = await puppeteer.launch();
      // Wait for creating the new page.
      const page = await browser.newPage();

      await page.goto(site, { waitUntil: 'networkidle2' });
      const title = await page.$eval('.recipe-name', (element) => {
        return element.textContent;
      });

      let description;
      try {
        await page.waitForSelector('.description', { timeout: 1000 });
        description = page.$eval('.description', (element) => {
          return element.textContent;
        });
      } catch (error) {
        description = '';
      }

      let creator;
      try {
        await page.waitForSelector('.byline', { timeout: 1000 });
        creator = await page.$eval('.byline', (element) => {
          return element.textContent;
        });
      } catch (error) {
        creator = '';
      }

      const imageUrl = await page.$eval('.video-js-player > div', (element) => {
        return element.getAttribute('poster');
      });
      await page.waitForSelector('.ingredients__section > ul > li');

      const ingridientsElements: string[] = await page.$$eval(
        '.ingredients__section > ul > li',
        (elements: HTMLInputElement[]) => {
          return elements.map((element) => element.innerHTML);
        },
      );

      const ingridients: Ingridient[] = ingridientsElements.map((listItem) => {
        const ingridientText = listItem.split('<!-- -->');
        const ingridientTitleIndex = ingridientText[1].includes(', ') ? 0 : 1;
        const spanIndex = ingridientText[ingridientTitleIndex].indexOf('<span');
        const ingridientTitle = ingridientText[ingridientTitleIndex].substr(
          0,
          spanIndex > 0 ? spanIndex : ingridientText[1].length,
        );
        const quantityText = ingridientText[0].trimEnd().split(' ');
        const quantityAmount = (
          quantityText.length > 1
            ? quantityText.slice(undefined, quantityText.length - 1)
            : quantityText
        )
          .map((textPiece) => this.tastyUtils.parseFractionText(textPiece))
          .reduce((num1, num2) => num1 + num2);
        const quantityUnit =
          quantityText.length > 1
            ? Unit[
                this.tastyUtils.singlify(quantityText[quantityText.length - 1])
              ]
            : undefined;
        return {
          name: ingridientTitle,
          quantity: quantityAmount,
          units: quantityUnit,
        };
      });

      const instructions: string[] = await page.$$eval(
        '.prep-steps > li',
        (elements: HTMLInputElement[]) => {
          return elements.map((element) => element.textContent);
        },
      );
      browser.close();
      recipe = {
        title,
        description,
        ingridients,
        instructions,
        platform: 'tasty',
        creator,
        imageUrl,
        originalUrl: site,
      };
    })();
    return recipe;
  }
}
