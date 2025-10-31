module.exports = async function(Flysql) {

  const fs = require("fs");
  
  fs.unlinkSync(__dirname + "/test.sqlite");

  const { assertion } = Flysql;

  const flysql = Flysql.create({ filename: "test.sqlite" });

  await flysql.connect();

  await flysql.addTable("Persona", {
    columns: {
      name: {
        type: "string",
        maxLength: 100,
      },
      surname: {
        type: "string",
        maxLength: 100,
      },
      age: {
        type: "integer",
      }
    }
  });

  await flysql.addTable("Usuario", {
    columns: {
      name: {
        type: "string",
        maxLength: 100,
        unique: true,
        nullable: false,
      }
    }
  });

  await flysql.addColumn("Usuario", "email", {
    type: "string",
    maxLength: 100,
    unique: true,
    nullable: false,
  });

  await flysql.addColumn("Usuario", "password", {
    type: "string",
    maxLength: 100,
    nullable: false,
  });

  await flysql.addColumn("Usuario", "persona", {
    type: "object-reference",
    referredTable: "Persona",
    nullable: true,
  });
  
  await flysql.renameTable("Usuario", "User");
  
  await flysql.renameColumn("User", "email", "mail");

  assertion(typeof flysql.$schema.tables.User.columns.mail === "object", `flysql.$schema.tables.User.columns.mail debería ser un objecto ahora`);

  console.log("[*] Completado test: 002.renameTable and renameColumn");

};