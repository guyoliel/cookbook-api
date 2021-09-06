export interface Scraper<T> {
  scrape(url: string): Promise<T>;
  canScrape(url: string): boolean;
}
