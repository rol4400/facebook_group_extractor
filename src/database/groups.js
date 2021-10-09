
const groupsDemoData = [
    {
      id: "100008927251059",
      name: "Brisbane Number 1 International Meetup hacked",
      about: "??",
      isPublic: true,
      profilePic:
        "https://scontent.fbne9-2.fna.fbcdn.net/v/t1.6435-1/p100x100/129676556_2068031600171062_8498868854811814168_n.jpg?_nc_cat=101&ccb=1-5&_nc_sid=7206a8&_nc_ohc=x0PDWIrpt8EAX_-qW01&_nc_ht=scontent.fbne9-2.fna&oh=6da140c33e2d8072bdd2b5bc35bbaaff&oe=6183F36F",
      lastUpdate: Date.now(),
      estimateMemberCount: "??",
      location: "??",
      isNearYouPerferred: false,
    },
  ];
  
//getData By Id(s)
// const getDataIdArr = (data) => data.map(x=>x.id)


// db('groups').whereIn('id',getDataIdArr(groupsDemoData))
//     .then((rows) => {
//       console.log(JSON.stringify(rows))
//     }).catch((err) => { console.log( err); throw err })

module.exports = {};
