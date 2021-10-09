require("dotenv").config();
const puppeteer = require("puppeteer");
const mysql = require("mysql");


const groupId = "1470416143036444";
const extractMinAmount = 40;

const { scrapeInfinityItems } = require("./src/scraping.js");
const { extractFacebookGroupMember } = require("./src/extractor.js");
const { saveData, connectDb } = require("./src/database/database.js");
const {bulkInsertUsers,bulkInsertUsersHaveGroups} = require("./src/database/users.js");

const db = connectDb();



const url = `https://www.facebook.com/groups/${groupId}/members`;

async function main() {
  console.log('scraping started')
  try {
    //LOGIN TO FACEBOOK AND OPEN THE GROUP PAGE
    const browser = await puppeteer.launch({
      headless: true,
      slowMo: 20,
    });
    const context = browser.defaultBrowserContext();
    context.overridePermissions("https://www.facebook.com", [
      "geolocation",
      "notifications",
    ]);

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.setViewport({ width: 1000, height: 600 });
    await page.goto("https://www.facebook.com");
    await page.waitForSelector("#email");
    await page.type("#email", process.env.email);
    await page.type("#pass", process.env.password);
    await page.click(`[type="submit"]`);
    await page.waitForNavigation();

    await page.goto(url);

    //WAIT FOR PAGE READY
    const listItem =
      ".obtkqiv7 .ow4ym5g4.auili1gw.rq0escxv.j83agx80.buofh1pr.g5gj957u.i1fnvgqd.oygrvhab.cxmmr5t8.hcukyx3x.kvgmc6g5.nnctdnn4.hpfvmrgz.qt6c0cv9.jb3vyjys.l9j0dhe7.du4w35lb.bp9cbjyn.btwxx1t3.dflh9lhu.scb9dxdr";
    await page.waitForSelector(listItem, 250, 1500);

    //START SCRAPING
    const items = await scrapeInfinityItems(
      page,
      extractFacebookGroupMember,
      extractMinAmount
    );

    //SAVE ALL DATA

    // await bulkInsertUsers(db,items)
    await bulkInsertUsersHaveGroups(db,items)
    await console.log("scraping end")
    //CLOSE
    await browser.close();
    await db.destroy();
  } catch (error) {
    console.error(error);
  }
}

main();
