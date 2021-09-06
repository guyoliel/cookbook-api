import { Ingridient } from 'src/common/entities/ingridient';
import { Recipe } from 'src/common/entities/recipe';
import { Unit } from 'src/common/entities/unit';
import { Scraper } from '../interfaces/scraper';
import * as puppeteer from 'puppeteer';
import { TastyUtilsService } from '../tastyUtils.service';
import { PuppeteerUtils } from '../utils/puppeteerUtils';
import { v4 as uuid } from 'uuid';

export class TastyScraper implements Scraper<Recipe> {
  tastyUtils: TastyUtilsService;
  puppeteerUtils: PuppeteerUtils;

  constructor(puppeteerUtils: PuppeteerUtils, tastyUtils: TastyUtilsService) {
    this.puppeteerUtils = puppeteerUtils;
    this.tastyUtils = tastyUtils;
  }

  async scrape(url: string): Promise<Recipe> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    const title = await this.puppeteerUtils.extractText(page, '.recipe-name');
    const description = await this.puppeteerUtils.tryExtractText(
      page,
      '.description',
      1000,
    );
    const creator = await this.puppeteerUtils.tryExtractText(
      page,
      '.byline',
      1000,
    );
    const imageUrl = await this.puppeteerUtils.getAttribute(
      page,
      '.video-js-player > div',
      'poster',
    );
    const ingridients: Ingridient[] = await this.extractIngridients(page);
    const instructions: string[] = await this.puppeteerUtils.extractTexts(
      page,
      '.prep-steps > li',
    );
    browser.close();
    return {
      id: uuid(),
      title,
      description,
      ingridients,
      instructions,
      platform: 'tasty',
      creator,
      imageUrl,
      originalUrl: url,
    };
  }

  canScrape(url: string): boolean {
    return url.startsWith('https://tasty.co/recipe/');
  }

  private async extractIngridients(
    page: puppeteer.Page,
  ): Promise<Ingridient[]> {
    const ingridientElements: string[] =
      await this.puppeteerUtils.getElementsHtml(
        page,
        '.ingredients__section > ul > li',
      );

    return ingridientElements.map((listItem) => {
      const ingridientText = listItem.split('<!-- -->');
      const ingridientTitle = this.getIngridientTitle(ingridientText);
      const quantityText = ingridientText[0].trimEnd().split(' ');
      const amount = this.getIngridientAmount(quantityText);
      const quantityUnit = this.getIngridientAmountUnit(quantityText);
      return {
        name: ingridientTitle,
        quantity: amount,
        units: quantityUnit,
      };
    });
  }

  private getIngridientAmountUnit(quantityText: string[]): Unit {
    return quantityText.length > 1
      ? Unit[this.tastyUtils.singlify(quantityText[quantityText.length - 1])]
      : undefined;
  }

  private getIngridientAmount(quantityText: string[]): number {
    return (
      quantityText.length > 1
        ? quantityText.slice(undefined, quantityText.length - 1)
        : quantityText
    )
      .map((textPiece) => this.tastyUtils.parseFractionText(textPiece))
      .reduce((num1, num2) => num1 + num2);
  }

  private getIngridientTitle(ingridientText: string[]): string {
    const ingridientTitleIndex = ingridientText[1].includes(', ') ? 0 : 1;
    const spanIndex = ingridientText[ingridientTitleIndex].indexOf('<span');
    const ingridientTitle = ingridientText[ingridientTitleIndex].substr(
      0,
      spanIndex > 0 ? spanIndex : ingridientText[1].length,
    );
    return ingridientTitle;
  }
}
