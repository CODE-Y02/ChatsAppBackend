const cron = require("cron");
const ArchivedChat = require("../models/ArchivedChat");

const Message = require("../models/message");
const sequelize = require("../utils/database");

const archiveMessage = () => {
  const cronjob = new cron.CronJob("00 00 00 * * *", async () => {
    console.log("executing cron job");
    try {
      let allMsg = await Message.findAll();

      allMsg = allMsg.map((eachMsg) => {
        //clean up
        const { id, content, fileUrl, createdAt, updatedAt, userId, groupId } =
          eachMsg;

        return {
          messageId: id,
          messageCreatedAt: createdAt,
          messageUpdatedAt: updatedAt,
          userId,
          groupId,
          fileUrl,
          content,
        };
      });

      // create archived
      await ArchivedChat.bulkCreate(allMsg);

      await Message.destroy({ where: {} }); // delete all
    } catch (error) {
      console.log(`\n\n >>>>> error in corn job <<<<<<<< \n \n ${error}\n\n`);
    }
  });

  cronjob.start();
};

module.exports = {
  archiveMessage,
};

// mid night

// const CronJob = require('../lib/cron.js').CronJob;

// console.log('Before job instantiation');
// const job = new CronJob('00 00 00 * * *', function() {
// 	const d = new Date();
// 	console.log('Midnight:', d);
// });
// console.log('After job instantiation');
// job.start()

//
// const CronJob = require('../lib/cron.js').CronJob;

// console.log('Before job instantiation');
// const job = new CronJob('0 */10 * * * *', function() {
// 	const d = new Date();
// 	console.log('Every Tenth Minute:', d);
// });
// console.log('After job instantiation');
// job.start();
