const {bulkInsertMerge} = require('./utils');
var _ = require('lodash');
const usersAttribute = [
  "id",
  "firstName",
  "lastName",
  "profilePic",
  "livesIn",
  "works",
  "studied",
  "lives",
  "from",
  "relationship",
  "friendsCount",
  "lastUpdate",
  "website",
  "instagram",
  "isPage",
  "profilePicCount",
  "canMessage",
  "lastUpdate",
];

const usersHaveGroups = [
  "groupId",
  "userId",
  "groupIdUserId",
  "memberSince",
  "lastUpdate",
  "additionalData"
] 
const bulkInsertUsers = (db, items) => {
  return bulkInsertMerge(db, "users", items.map(x=>_.pick(x, usersAttribute)));
};

const bulkInsertUsersHaveGroups =(db,items)=>{
  
  return bulkInsertMerge(db, "groupsHaveUsers", items.map(x=>_.pick(x, usersHaveGroups)),'groupIdUserId');
  // console.log(items)
}

module.exports={
    bulkInsertUsers,
    bulkInsertUsersHaveGroups
}