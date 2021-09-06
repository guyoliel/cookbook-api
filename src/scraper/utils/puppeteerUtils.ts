import { Page } from 'puppeteer';

export class PuppeteerUtils {
  async extractText(page: Page, selector: string): Promise<string> {
    return await page.$eval(selector, (element) => {
      return element.textContent;
    });
  }

  async tryExtractText(
    page: Page,
    selector: string,
    timeout: number,
  ): Promise<string> {
    let text;
    try {
      await page.waitForSelector(selector, { timeout });
      text = page.$eval(selector, (element) => {
        return element.textContent;
      });
    } catch (error) {
      text = '';
    }
    return text;
  }

  async extractTexts(page: Page, selector: string): Promise<string[]> {
    return await page.$$eval(selector, (elements: HTMLInputElement[]) => {
      return elements.map((element) => element.textContent);
    });
  }

  async getAttribute(
    page: Page,
    selector: string,
    attribute: string,
  ): Promise<string> {
    return await page.$eval(
      selector,
      (element, attribute: string) => {
        return element.getAttribute(attribute);
      },
      attribute,
    );
  }

  async getElementsHtml(page, selector): Promise<string[]> {
    await page.waitForSelector(selector);
    return await page.$$eval(selector, (elements: HTMLInputElement[]) => {
      return elements.map((element) => element.innerHTML);
    });
  }
}
