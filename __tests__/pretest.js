console.log("🚀 Pretest");
console.log("|_ start");
const db = require("../src/config/database");

const collectionDrop = (collection) => {
  return new Promise(async (resolve, reject) => {
    db.Mongodb.connection.dropCollection(collection, function (err, result) {
      var success = `|🗑️  DropCollection "${collection}" ✔️`;
      var failure = `|🗑️  DropCollection "${collection}" ❌\n ${err}`;

      if (err) {
        //if it doesn't exist, it's not an error.
        if (err.message.includes("not found")) {
          resolve(success);
        } else {
          reject(failure);
        }
      }
      if (result) {
        resolve(success);
      }
      resolve(success);
    });
  });
};

(() => {
  try {
    (async () => {
      const collections = ["Tokens", "Products"];
      for (let i = 0; i < collections.length; i++) {
        const result = await collectionDrop(collections[i]);
        console.log(result);
      }
      /* In my case, I'm using it as a "pretest" script, in package.json.
            Then I close the process to proceed with the test */
            console.log("|\n|_ finished")
      process.exit(0);
    })();
  } catch (error) {
    console.trace(error.message);
  }
})();

//process.on('SIGINT', () => process.exit(0))


/*  // Drop database
    mongmongodboose.connection.dropDatabase(function (err, result) {
      err ? console.trace("Error: \n", err) : null;
      result ? console.trace("Success: \n", result) : null;
    }); */
