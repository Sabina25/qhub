import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const url = process.argv[2];
if (!url) { console.error('Usage: node grab.js <url>'); process.exit(1); }

const html = await (await fetch(url)).text();
const $ = cheerio.load(html);

// соберём value из <b ...> (и на всякий случай из <span ...>)
const sel = 'b.ref, b.ramp.ref0, span.ref, span.ramp.ref0';
const result = $(sel).map((_, el) => $(el).attr('value') || '').get().join('');

