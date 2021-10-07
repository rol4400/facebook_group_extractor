require("dotenv").config();
const puppeteer = require("puppeteer");
const { Parser } = require("json2csv");
var fs = require("fs");
const groupId = "1470416143036444";
const extractMinAmount = 4000;

const url = `https://www.facebook.com/groups/${groupId}/members`;

async function main() {
  try {
    //LOGIN TO FACEBOOK AND OPEN THE GROUP PAGE
    const browser = await puppeteer.launch({
      headless: false,
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
    const items = await scrapeItems(page, extractItems, extractMinAmount);

    //SAVE ALL DATA IN JSON FILE
    fs.writeFile(
      "results.json",
      JSON.stringify(items, null, 2),
      function (err) {
        if (err) {
          console.log(err);
        }
      }
    );
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(items);
    fs.writeFile("results.csv", csv, function (err) {
      if (err) {
        console.log(err);
      }
    });

    //CLOSE
    await browser.close();
  } catch (error) {
    console.error(error);
  }
}

async function scrapeItems(page, extractItems, itemCount, scrollDelay = 800) {
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

function extractItems() {
  const name =
    ".obtkqiv7 .ue3kfks5.pw54ja7n.uo3d90p7.l82x9zwi.a8c37x1j a.oajrlxb2.g5ia77u1.qu0x051f.esr5mh6w.e9989ue4.r7d6kgcz.rq0escxv.nhd2j8a9.nc684nl6.p7hjln8o.kvgmc6g5.cxmmr5t8.oygrvhab.hcukyx3x.jb3vyjys.rz4wbd8a.qt6c0cv9.a8nywdso.i1ao9s8h.esuyzwwr.f1sip0of.lzcic4wl.oo9gr5id.gpro0wi8.lrazzd5p";
  const image =
    ".obtkqiv7 .ue3kfks5.pw54ja7n.uo3d90p7.l82x9zwi.a8c37x1j .q9uorilb.l9j0dhe7.pzggbiyp.du4w35lb image";
  const link =
    ".obtkqiv7 .ue3kfks5.pw54ja7n.uo3d90p7.l82x9zwi.a8c37x1j a.oajrlxb2.g5ia77u1.qu0x051f.esr5mh6w.e9989ue4.r7d6kgcz.rq0escxv.nhd2j8a9.nc684nl6.p7hjln8o.kvgmc6g5.cxmmr5t8.oygrvhab.hcukyx3x.jb3vyjys.rz4wbd8a.qt6c0cv9.a8nywdso.i1ao9s8h.esuyzwwr.f1sip0of.lzcic4wl.oo9gr5id.gpro0wi8.lrazzd5p";
  const others =
    ".obtkqiv7 .ue3kfks5.pw54ja7n.uo3d90p7.l82x9zwi.a8c37x1j span.d2edcug0.hpfvmrgz.qv66sw1b.c1et5uql.lr9zc1uh.a8c37x1j.keod5gw0.nxhoafnm.aigsh9s9.d9wwppkn.fe6kdd0r.mau55g9w.c8b282yb.mdeji52x.sq6gx45u.a3bd9o3v.knj5qynh.pipptul6.hzawbc8m";
  const listItem =
    ".obtkqiv7 .ow4ym5g4.auili1gw.rq0escxv.j83agx80.buofh1pr.g5gj957u.i1fnvgqd.oygrvhab.cxmmr5t8.hcukyx3x.kvgmc6g5.nnctdnn4.hpfvmrgz.qt6c0cv9.jb3vyjys.l9j0dhe7.du4w35lb.bp9cbjyn.btwxx1t3.dflh9lhu.scb9dxdr";
  const imgAttribute = "xlink:href";

  const memberSince =
    ".obtkqiv7 span.d2edcug0.hpfvmrgz.qv66sw1b.c1et5uql.lr9zc1uh.e9vueds3.j5wam9gi.lrazzd5p.m9osqain";
  const otherInfo =
    ".obtkqiv7 span.d2edcug0.hpfvmrgz.qv66sw1b.c1et5uql.lr9zc1uh.a8c37x1j.keod5gw0.nxhoafnm.aigsh9s9.d9wwppkn.fe6kdd0r.mau55g9w.c8b282yb.mdeji52x.sq6gx45u.a3bd9o3v.b1v8xokw.pipptul6.hzawbc8m";
  const platform = "Facebook";

  const groupNameQuery =
    ".oajrlxb2.g5ia77u1.qu0x051f.esr5mh6w.e9989ue4.r7d6kgcz.rq0escxv.nhd2j8a9.nc684nl6.p7hjln8o.kvgmc6g5.cxmmr5t8.oygrvhab.hcukyx3x.jb3vyjys.rz4wbd8a.qt6c0cv9.a8nywdso.i1ao9s8h.esuyzwwr.f1sip0of.lzcic4wl.gmql0nx0.gpro0wi8.hnhda86s";
  const nodeListData = document.querySelectorAll(listItem);
  const groupName = document.querySelector(groupNameQuery);
  let userDataArray = [];
  let groupCaches = {};

  //extract data and convert it to json format
  Object.keys(nodeListData).map((x) => {
    const profileName = nodeListData[x].querySelectorAll(name)[0];
    const profileImage = nodeListData[x].querySelectorAll(image)[0];
    const profileLink = nodeListData[x].querySelectorAll(link)[0];
    const profileMemberSince = nodeListData[x].querySelectorAll(memberSince)[0];

    console.log("running: " + profileName);

    if (profileName !== undefined) {
      const urlSplit = profileLink.href.split("/");
      let userLink = profileLink.href;
      // console.log("what is the link",userLink);
      let group = {};
      if (
        urlSplit[3] === "groups" &&
        !isNaN(urlSplit[4]) &&
        urlSplit[5] === "user" &&
        !isNaN(urlSplit[6])
      ) {
        //correct format
        const fishId = urlSplit[6];
        userLink = "https://www.facebook.com/profile.php?id=" + fishId;
        // console.log("fetch result =",result.data)
        // group = result.data
      }
      const name = profileName !== undefined ? profileName.innerText : "";
      userDataArray = [
        ...userDataArray,
        {
          id: profileLink !== undefined ? userLink.split("?id=")[1] : "error",
          image:
            profileImage !== undefined
              ? profileImage.getAttribute(imgAttribute)
              : "",
          name: name,
          url: profileLink !== undefined ? userLink : "",
          platform,
          groupName: groupName !== undefined ? groupName.innerText : "",
          firstName: name.split(" ").slice(0, -1).join(" "),
          lastName: name.split(" ").slice(-1).join(" "),
          groupUrl: document.location.href.split("/members")[0],
          memberSince:
            profileMemberSince !== undefined
              ? profileMemberSince.innerText
              : "",
          additionalData: otherInfo !== undefined ? profileName.innerText : "",
          ...group,
        },
      ];
      console.log("userDataArray: " + userDataArray);
    }
  });
  return userDataArray;
}
main();
