async function scrapeInfinityItems(
  page,
  extractItems,
  itemCount,
  scrollDelay = 800
) {
  let items = [];
  try {
    let previousHeight;
    while (items.length < itemCount) {
      console.log(
        `${items.length} item is extracted. it will scrape until ${itemCount}`
      );
      items = await page.evaluate(extractItems);
      previousHeight = await page.evaluate("document.body.scrollHeight");
      await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
      await page.waitForFunction(
        `document.body.scrollHeight > ${previousHeight}`
      );
      await page.waitForTimeout(scrollDelay);
    }
  } catch (e) {
    console.log("loop error: ", e);
  }
  return items;
}

module.exports = {
  scrapeInfinityItems,
};
