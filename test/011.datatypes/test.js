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
          booleanType: {type: "boolean"},
          stringType: {type: "string", maxLength: 10},
          textType: {type: "string"},
          integerType: {type: "integer"},
          realType: {type: "real"},
          blobType: {type: "blob"},
          dateType: {type: "date"},
          datetimeType: {type: "datetime"},
          objectType: {type: "object"},
          arrayType: {type: "array"},
        }
      }
    }
  });
  
  const item1 = flysql.insertOne("Random_item", {
    booleanType: false,
    stringType: "texto",
    textType: "texto",
    integerType: 1,
    realType: 1.55,
    blobType: "texto binario",
    dateType: new Date("2025-01-01"),
    datetimeType: new Date("2025-01-01 00:00:00"),
    objectType: {ok:200,message:"whatever intercaling ' quotes ' and ''two simple quotes''"},
    arrayType: [5,4,3,{message:"whatever"}],
  });
  
  const item1data = flysql.selectOne("Random_item", item1);

  assertion(item1data.booleanType === false);
  assertion(item1data.stringType === "texto");
  assertion(item1data.integerType === 1);
  assertion(item1data.realType === 1.55);
  assertion(item1data.blobType === "texto binario");
  assertion(item1data.dateType instanceof Date);
  assertion(item1data.datetimeType instanceof Date);
  assertion(Flysql.fromDateToDateSql(item1data.dateType) === "2025-01-01");
  assertion(Flysql.fromDateToDatetimeSql(item1data.datetimeType) === "2025-01-01 00:00:00");
  assertion(typeof item1data.objectType === "object");
  assertion(item1data.objectType.ok === 200);
  assertion(Array.isArray(item1data.arrayType));
  assertion(item1data.arrayType[0] === 5);
  assertion(item1data.arrayType[1] === 4);
  assertion(item1data.arrayType[2] === 3);

  console.log("[*] Completado test: 011.datatypes");

};