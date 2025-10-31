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
  
  await flysql.dropColumn("Usuario", "persona");
  
  assertion(typeof flysql.$schema.tables.Usuario.columns.persona === "undefined", "flysql.$schema.tables.Usuario.columns.persona debería ser indefinido ahora");

  await flysql.dropTable("Usuario");

  assertion(typeof flysql.$schema.tables.Usuario === "undefined", "flysql.$schema.tables.Usuario debería ser indefinido ahora");

  console.log("[*] Completado test: 003.dropTable and dropColumn");

};