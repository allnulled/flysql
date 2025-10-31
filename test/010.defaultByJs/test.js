module.exports = async function (Flysql) {

  const fs = require("fs");

  fs.unlinkSync(__dirname + "/test.sqlite");

  const { assertion } = Flysql;

  const flysql = Flysql.create({
    filename: "test.sqlite",
    trace: false,
    traceSql: false
  });
  flysql.connect();
  flysql.addSchema({
    tables: {
      Random_item: {
        columns: {
          name: {type: "string", maxLength: 255, unique: true},
          value: {type: "string", maxLength: 255, defaultByJs: "return 'none';"},
        }
      }
    }
  });
  
  flysql.insertOne("Random_item", {name: "x1"});
  flysql.insertMany("Random_item", [{name: "x2"},{name: "x3"},{name: "x4",value:"something"}]);
  const allItems = flysql.selectMany("Random_item", []);

  assertion(allItems[0].name === "x1");
  assertion(allItems[1].name === "x2");
  assertion(allItems[2].name === "x3");
  assertion(allItems[3].name === "x4");
  assertion(allItems[0].value === "none");
  assertion(allItems[1].value === "none");
  assertion(allItems[2].value === "none");
  assertion(allItems[3].value === "something");

  console.log("[*] Completado test: 011.datatypes");

};

