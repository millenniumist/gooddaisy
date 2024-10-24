import chrome from '@sparticuz/chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

export async function getServerlessBrowser() {
  return puppeteer.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless,
  });
}
