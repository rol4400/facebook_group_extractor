const moment = require("moment");

//.format("YYYY-MM-DD HH:mm:ss")
function memberSinceToDate(text, lastMemberDate = moment()) {
  const week2Days = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };
  if (!!text && text.match(/^Added by/i)) {
    //Added by Lucia Loi on September 13, 2021
    let textSplit = text.split("on");
    textSplit = textSplit[textSplit.length - 1];
    lastMemberDate = moment(textSplit);

    return lastMemberDate;
  }
  if (!!text && text.match(/^Joined last/i)) {
    //Joined last Tuesday
    //Joined last Monday

    lastMemberDate = moment()
      .startOf("week")
      .subtract(7 - week2Days[text.split("Joined last ")[1]], "day");
    return lastMemberDate;
  }
  if (!!text && text.match(/^Joined on/i)) {
    //Joined on Friday
    //Joined on Wednesday
    lastMemberDate = moment()
      .startOf("week")
      .add(week2Days[text.split("Joined on ")[1]], "day");

    if (moment().diff(lastMemberDate) < 0) {
      return lastMemberDate.subtract(7, "day");
    }
    return lastMemberDate;
  }
  if (!!text && text.match(/^Joined about/i)) {
    // Joined about an hour ago
    // Joined about 2 weeks ago
    // Joined about a month ago
    // Joined about 4 months ago
    // Joined about 12 months ago
    // Joined about a year ago
    // Joined about 10 years ago

    // Joined about \d+ months ago

    const unit = {
      hour: "hours",
      hours: "hours",
      day: "days",
      days: "days",
      week: "weeks",
      weeks: "weeks",
      month: "months",
      months: "months",
      year: "years",
      years: "years",
    };
    const result = text.split("Joined about ")[1].split(" ")[0].startsWith("a")
      ? 1
      : +text.split("Joined about ")[1].split(" ")[0];
    const resultUnit = text.split("Joined about ")[1].split(" ")[1];
    lastMemberDate = moment().subtract(result, unit[resultUnit]);
    return lastMemberDate;
  }
  return lastMemberDate;
  // Added by Shuyu Wang on 20 June 2021
}
function extractFacebookGroupMember() {
  const newToGroupSection =
    ".obtkqiv7 >div > .rq0escxv.l9j0dhe7.du4w35lb.j83agx80.cbu4d94t.buofh1pr.tgvbjcpo.muag1w35.enqfppq2 > div:last-child > div > div>div:last-child >div";

  const newToGroupLoading =
    ".obtkqiv7 >div > .rq0escxv.l9j0dhe7.du4w35lb.j83agx80.cbu4d94t.buofh1pr.tgvbjcpo.muag1w35.enqfppq2 > div:last-child > div:nth-last > div.tr9rh885";
  const nameQuery =
    newToGroupSection +
    " a.oajrlxb2.g5ia77u1.qu0x051f.esr5mh6w.e9989ue4.r7d6kgcz.rq0escxv.nhd2j8a9.nc684nl6.p7hjln8o.kvgmc6g5.cxmmr5t8.oygrvhab.hcukyx3x.jb3vyjys.rz4wbd8a.qt6c0cv9.a8nywdso.i1ao9s8h.esuyzwwr.f1sip0of.lzcic4wl.oo9gr5id.gpro0wi8.lrazzd5p";

  const profilePicQuery =
    newToGroupSection + " .q9uorilb.l9j0dhe7.pzggbiyp.du4w35lb image";

  const linkQuery =
    newToGroupSection +
    " a.oajrlxb2.g5ia77u1.qu0x051f.esr5mh6w.e9989ue4.r7d6kgcz.rq0escxv.nhd2j8a9.nc684nl6.p7hjln8o.kvgmc6g5.cxmmr5t8.oygrvhab.hcukyx3x.jb3vyjys.rz4wbd8a.qt6c0cv9.a8nywdso.i1ao9s8h.esuyzwwr.f1sip0of.lzcic4wl.oo9gr5id.gpro0wi8.lrazzd5p";

  const listItem = newToGroupSection + " >div";

  const memberSinceQuery =
    newToGroupSection +
    " span.d2edcug0.hpfvmrgz.qv66sw1b.c1et5uql.oi732d6d.ik7dh3pa.ht8s03o8.e9vueds3.j5wam9gi.lrazzd5p.m9osqain";

  const additionalDataQuery = newToGroupSection + " .pipptul6";

  const groupNameQuery =
    ".oajrlxb2.g5ia77u1.qu0x051f.esr5mh6w.e9989ue4.r7d6kgcz.rq0escxv.nhd2j8a9.nc684nl6.p7hjln8o.kvgmc6g5.cxmmr5t8.oygrvhab.hcukyx3x.jb3vyjys.rz4wbd8a.qt6c0cv9.a8nywdso.i1ao9s8h.esuyzwwr.f1sip0of.lzcic4wl.gmql0nx0.gpro0wi8.hnhda86s";

  const groupIsPublicQuery =
    ".rq0escxv.l9j0dhe7.du4w35lb.j83agx80.pfnyh3mw.jifvfom9.bp9cbjyn.lhclo0ds.btwxx1t3.jb3vyjys.nkwizq5d.roh60bw9.scwd0bx6.hop8lmos > div:first-child > div > div:last-child";
  const estimateMemberCountQuery =
    ".rq0escxv.l9j0dhe7.du4w35lb.j83agx80.pfnyh3mw.jifvfom9.bp9cbjyn.lhclo0ds.btwxx1t3.jb3vyjys.nkwizq5d.roh60bw9.scwd0bx6.hop8lmos >div:last-child";

  const nodeListData = document.querySelectorAll(listItem);
  // const groupName = document.querySelector(groupNameQuery)?.innerText || null;
  // const groupIsPublic =
  //   document.querySelector(groupIsPublicQuery)?.innerText || null;
  // const estimateMemberCount =
  //   document.querySelector(estimateMemberCountQuery)?.innerText || null;
  // const groupCoverPhoto =document.querySelector('img[data-imgperflogname]').getAttribute("src");

  // const groupInfo = {
  //   id:groupId,
  //   name: groupName,
  //   isPublic: groupIsPublic,
  //   estimateMemberCount,
  //   profilePic:groupCoverPhoto
  // };
  let userDataArray = [];

  //extract data and convert it to json format
  Object.keys(nodeListData).forEach((x) => {
    const name = nodeListData[x].querySelector(nameQuery)?.innerText || false;

    if (!!name) {
      const profilePic =
        nodeListData[x]
          .querySelector(profilePicQuery)
          ?.getAttribute("xlink:href") || null;

      const additionalData =
        nodeListData[x].querySelector(additionalDataQuery)?.innerText || null;

      const memberSince =
        nodeListData[x].querySelector(memberSinceQuery)?.innerText || null;

      const urlSplit = nodeListData[x].querySelector(linkQuery).href.split("/");
      const groupId = urlSplit[4];
      const userId = urlSplit[6];

      userDataArray = [
        ...userDataArray,
        {
          id: userId,
          userId,
          groupIdUserId: groupId + "_" + userId,
          firstName: name.split(" ").slice(0, -1).join(" "),
          lastName: name.split(" ").slice(-1).join(" "),
          profilePic,
          groupId,
          memberSince,
          additionalData,
        },
      ];
    }
  });

  return userDataArray;
}

module.exports = {
  extractFacebookGroupMember,
  memberSinceToDate,
};
