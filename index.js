//Project doc https://docs.google.com/spreadsheets/d/1CX5qXuuatgkmBrsMR1yJ4A4iB_yHuo74QSP_VSRooqk/edit#gid=0
const moment = require("moment");

require("dotenv").config();
const puppeteer = require("puppeteer");
const mysql = require("mysql");

const groupId = "189146848441203";
const extractMinAmount = 300;

const { scrapeInfinityItems } = require("./src/scraping.js");
const {
  extractFacebookGroupMember,
  memberSinceToDate,
} = require("./src/extractor.js");
const { saveData, connectDb } = require("./src/database/database.js");
const {
  bulkInsertUsers,
  bulkInsertUsersHaveGroups,
} = require("./src/database/users.js");

const { bulkInsertMerge } = require("./src/database/utils");

const db = connectDb();

const url = `https://www.facebook.com/groups/${groupId}/members`;

async function main() {
  console.log("scraping started");
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
    await page.setDefaultTimeout(60000);
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
    let groupMembers = await scrapeInfinityItems(
      page,
      extractFacebookGroupMember,
      extractMinAmount
    );
    console.log("how many records?: ", groupMembers.length);
    let lastUpdate = moment();
    groupMembers = groupMembers.map((x) => {
      lastUpdate = memberSinceToDate(x.memberSince, lastUpdate);
      return {
        ...x,
        memberSince:
          lastUpdate?.format("YYYY-MM-DD HH:mm:ss") ||
          lastUpdate.format("YYYY-MM-DD HH:mm:ss"),
        lastUpdate: moment().format("YYYY-MM-DD HH:mm:ss"),
      };
    });

    groupMembers = Array.from(new Set(groupMembers.map((s) => s.id))).map(
      (id) => {
        return {
          id: id,
          ...Object.assign({}, ...groupMembers.filter((s) => s.id === id)),
        };
      }
    );

    //SAVE ALL DATA
    // await bulkInsertMerge(db,'groups',group.info)
    await bulkInsertUsers(db, groupMembers);
    await bulkInsertUsersHaveGroups(db, groupMembers);
    await console.log("scraping end");
    //CLOSE
    await browser.close();
    await db.destroy();
  } catch (error) {
    console.error(error);
  }
}

main();
