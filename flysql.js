const path = require("path");
const sqlite = require("better-sqlite3");

const AssertionError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "AssertionError";
  }
};

const assertion = function (condition, message) {
  if (!condition) {
    throw new AssertionError(message);
  }
};

const Flysql = class {

  static create(...args) {
    return new this(...args);
  }

  static connect(...args) {
    const flysql = new this(...args);
    flysql.connect();
    return flysql;
  }

  static AssertionError = AssertionError;

  static assertion = assertion;

  static defaultOptions = {
    trace: false,
    traceSql: false,
    filename: path.resolve(process.cwd(), "db.sqlite")
  };

  static defaultDatabaseOptions = {
    readonly: false,
    fileMustExist: false,
    timeout: 5000,
    verbose: (...args) => { },
  };

  static knownTypes = [
    "boolean",
    "integer",
    "real",
    "string",
    "blob",
    "date",
    "datetime",
    "object",
    "array",
    "object-reference",
    "array-reference"
  ];

  static knownOperators = [
    "<",
    "<=",
    ">",
    ">=",
    "=",
    "!=",
    "is in",
    "is not in",
    "is null",
    "is not null",
    "is like",
    "is not like"
  ];



  static fromDateToDateSql(dateObject) {
    assertion(dateObject instanceof Date, `Parameter «dateObject» must be a Date instance on «normalizeDate»`);
    const year = this.padLeft(dateObject.getFullYear(), 4, "0");
    const month = this.padLeft(dateObject.getMonth()+1, 2, "0");
    const day = this.padLeft(dateObject.getDate(), 2, "0");
    return `${year}-${month}-${day}`;
  }

  static fromDateToDatetimeSql(dateObject) {
    assertion(dateObject instanceof Date, `Parameter «dateObject» must be a Date instance on «normalizeDatetime»`);
    const year = this.padLeft(dateObject.getFullYear(), 4, "0");
    const month = this.padLeft(dateObject.getMonth()+1, 2, "0");
    const day = this.padLeft(dateObject.getDate(), 2, "0");
    const hour = this.padLeft(dateObject.getHours(), 2, "0");
    const minute = this.padLeft(dateObject.getMinutes(), 2, "0");
    const second = this.padLeft(dateObject.getSeconds(), 2, "0");
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }

  static checkSchemaColumnValidity(tableId, columnId, partialSchema) {
    return this.checkSchemaValidity({
      tables: {
        [tableId]: {
          columns: {
            [columnId]: partialSchema
          }
        }
      }
    });
  }

  static checkSchemaTableValidity(tableId, partialSchema) {
    return this.checkSchemaValidity({
      tables: {
        [tableId]: partialSchema
      }
    });
  }

  static checkSchemaValidity(schema) {
    assertion(typeof schema === "object", `Parameter «schema» must be an object on «checkSchemaValidity»`);
    assertion(typeof schema.tables === "object", `Parameter «schema.tables» must be an object on «checkSchemaValidity»`);
    for (let tableId in schema.tables) {
      assertion(typeof schema.tables[tableId] === "object", `Parameter «schema.tables[${tableId}]» must be an object on «checkSchemaValidity»`);
      for (let columnId in schema.tables[tableId].columns) {
        assertion(typeof schema.tables[tableId].columns[columnId] === "object", `Parameter «schema.tables[${tableId}].columns[${columnId}]» must be an object on «checkSchemaValidity»`);
        assertion(typeof schema.tables[tableId].columns[columnId].type === "string", `Parameter «schema.tables[${tableId}].columns[${columnId}].type» must be a string on «checkSchemaValidity»`);
        assertion(["undefined", "number"].indexOf(typeof schema.tables[tableId].columns[columnId].maxLength) !== -1, `Parameter «schema.tables[${tableId}].columns[${columnId}].maxLength» must be undefined or number on «checkSchemaValidity»`);
        assertion(["undefined", "boolean"].indexOf(typeof schema.tables[tableId].columns[columnId].unique) !== -1, `Parameter «schema.tables[${tableId}].columns[${columnId}].unique» must be undefined or boolean on «checkSchemaValidity»`);
        assertion(["undefined", "boolean"].indexOf(typeof schema.tables[tableId].columns[columnId].nullable) !== -1, `Parameter «schema.tables[${tableId}].columns[${columnId}].nullable» must be undefined or boolean on «checkSchemaValidity»`);
        assertion(["undefined", "string"].indexOf(typeof schema.tables[tableId].columns[columnId].default) !== -1, `Parameter «schema.tables[${tableId}].columns[${columnId}].default» must be undefined or string on «checkSchemaValidity»`);
        assertion(this.knownTypes.indexOf(schema.tables[tableId].columns[columnId].type) !== -1, `Parameter «schema.tables[${tableId}].columns[${columnId}].type» must be a valid known type on «checkSchemaValidity»`);
        switch (schema.tables[tableId].columns[columnId].type) {
          case "object-reference":
            assertion(typeof schema.tables[tableId].columns[columnId].referredTable === "string", `Parameter «schema.tables[${tableId}].columns[${columnId}].referredTable» must be a string on «checkSchemaValidity»`);
            break;
          case "array-reference":
            assertion(typeof schema.tables[tableId].columns[columnId].referredTable === "string", `Parameter «schema.tables[${tableId}].columns[${columnId}].referredTable» must be a string on «checkSchemaValidity»`);
            break;
          case "string":
          case "boolean":
          case "integer":
          case "real":
          case "date":
          case "datetime":
          case "array":
          case "object":
          case "blob":
            break;
          default:
            throw new Error(`Parameter «schema.tables[${tableId}].columns[${columnId}].type» must be a valid type on «checkSchemaValidity»`);
        }
      }
    }
  }

  static escapeId(id) {
    return '`' + id.replace(/`/g, "") + '`';
  }

  static escapeValue(value, table = false, columnId = false) {
    if (typeof value === "number") {
      return value;
    }
    if (value === null) {
      return "NULL";
    }
    if(typeof value === "object") {
      if(value instanceof Date) {
        if(table && columnId) {
          const valueType = this.$schema.tables[table].columns[columnId].type;
          if(valueType === "date") {
            return this.fromDateToDateSql(value);
          } else if(valueType === "datetime") {
            return this.fromDateToDatetimeSql(value);
          }
        }
      }
    }
    if (typeof value === "object") {
      return "'" + JSON.stringify(value).replace(/'/g, "''") + "'";
    }
    if(typeof value === "boolean") {
      return value ? 1 : 0;
    }
    return "'" + value.replace(/'/g, "''") + "'";
  }

  constructor(options = {}) {
    this.$database = null;
    this.$schema = { tables: {} };
    this.$options = Object.assign({}, this.constructor.defaultOptions, options);
    this.$options.databaseOptions = Object.assign({}, this.constructor.defaultDatabaseOptions, options.databaseOptions || {});
  }

  trace(msg, argz = []) {
    if (this.$options.trace) {
      console.log("[trace][flysql] " + msg, argz.length === 0 ? '' : "> " + argz.map(arg => typeof arg).join(", "));
    }
  }

  checkInstanceValidity(table, item) {
    assertion(typeof table === "string", `Parameter «table» must be a string on «checkInstanceValidity»`);
    assertion(table in this.$schema.tables, `Parameter «table» must be a schema table on «checkInstanceValidity»`);
    assertion(typeof item === "object", `Parameter «item» must be an object on «checkInstanceValidity»`);
    const columnIds = Object.keys(this.$schema.tables[table].columns);
    Iterating_columns:
    for (let indexColumn = 0; indexColumn < columnIds.length; indexColumn++) {
      const columnId = columnIds[indexColumn];
      const columnSchema = this.$schema.tables[table].columns[columnId];
      const hasColumn = columnId in item;
      if (hasColumn) {
        continue Iterating_columns;
      }
      const missesDefault = !("default" in columnSchema);
      if (missesDefault) {
        continue Iterating_columns;
      }
      const columnDefault = columnSchema.default;
      const columnFactory = new Function("row", "columnSchema", columnDefault);
      const defaultValue = columnFactory.call(this, item, columnSchema);
      item[columnId] = defaultValue;
    }
  }

  static padLeft(txt, len, filler = "0") {
    let out = "" + txt;
    while (out.length < len) {
      out = filler + out;
    }
    return out;
  }

  copyObject(data) {
    return JSON.parse(JSON.stringify(data));
  }

  addSchema(schema) {
    this.trace("addSchema", [...arguments]);
    assertion("tables" in schema, `Parameter «schema» must contain property «tables» on «addSchema»`);
    assertion(typeof schema.tables === "object", `Parameter «schema.tables» must be an object on «addSchema»`);
    this.constructor.checkSchemaValidity(schema);
    const newSchemaKeys = Object.keys(schema).filter(key => key !== "tables");
    const newSchemaTables = Object.keys(schema.tables || {});
    for (let indexKeys = 0; indexKeys < newSchemaKeys.length; indexKeys++) {
      const newSchemaKey = newSchemaKeys[indexKeys];
      this.$schema[newSchemaKey] = schema[newSchemaKey];
    }
    for (let indexTables = 0; indexTables < newSchemaTables.length; indexTables++) {
      const newSchemaTable = newSchemaTables[indexTables];
      this._addTable(newSchemaTable, schema.tables[newSchemaTable]);
    }
    return this;
  }

  getSchema() {
    this.trace("getSchema", [...arguments]);
    return this.$schema;
  }

  connect() {
    this.trace("connect", [...arguments]);
    this.$database = new sqlite(this.$options.filename, this.$options.databaseOptions);
    this._ensureBasicMetadata();
    this._loadSchema();
  }

  disconnect() {
    this.trace("disconnect", [...arguments]);
  }

  selectMany(table, filters) {
    this.trace("selectMany", [...arguments]);
    assertion(typeof table === "string", `Parameter «table» must be a string on «selectMany»`);
    assertion(typeof filters === "object", `Parameter «filters» must be a object on «selectMany»`);
    // @TODO:
    const sqlPart1 = this._sqliteSelectFrom(table);
    const sqlPart2 = this._sqliteWhere(filters, true);
    const sql = sqlPart1 + sqlPart2;
    const result = this.fetchSql(sql);
    this._rehydrateResults(table, result);
    return result;
  }

  selectOne(table, id) {
    this.trace("selectOne", [...arguments]);
    assertion(typeof table === "string", `Parameter «table» must be a string on «selectOne»`);
    assertion((typeof id === "number") || (typeof id === "string"), `Parameter «id» must be a number or a string on «selectOne»`);
    // @TODO:
    const sqlPart1 = this._sqliteSelectFrom(table);
    const sqlPart2 = this._sqliteWhere([["id", "=", id]], true);
    const sql = sqlPart1 + sqlPart2;
    const result = this.fetchSql(sql);
    this._rehydrateResults(table, result);
    if (result.length === 1) {
      return result[0];
    }
    return result;
  }

  insertMany(table, registersOriginal) {
    this.trace("insertMany", [...arguments]);
    assertion(typeof table === "string", `Parameter «table» must be a string on «insertMany»`);
    assertion(typeof registersOriginal === "object", `Parameter «registersOriginal» must be an object on «insertMany»`);
    assertion(Array.isArray(registersOriginal), `Parameter «registersOriginal» must be an array on «insertMany»`);
    const registers = this.copyObject(registersOriginal);
    this._injectDefaultByJs(table, registers);
    const columnIds = Object.keys(registers[0]);
    const sqlPart1 = this._sqliteInsertInto(table, columnIds);
    const sqlPart2 = this._sqliteInsertValues(registers, columnIds, table);
    const sql = sqlPart1 + sqlPart2;
    const result = this.insertSql(sql);
    return result.lastInsertRowid;
  }

  insertOne(table, registerOriginal) {
    this.trace("insertOne", [...arguments]);
    assertion(typeof table === "string", `Parameter «table» must be a string on «insertOne»`);
    assertion(typeof registerOriginal === "object", `Parameter «registerOriginal» must be an object on «insertOne»`);
    const register = this.copyObject(registerOriginal);
    this._injectDefaultByJs(table, [register]);
    const columnIds = Object.keys(register);
    const sqlPart1 = this._sqliteInsertInto(table, columnIds);
    const sqlPart2 = this._sqliteInsertValues([register], columnIds, table);
    const sql = sqlPart1 + sqlPart2;
    const result = this.insertSql(sql);
    return result.lastInsertRowid;
  }

  updateMany(table, filters, values) {
    this.trace("updateMany", [...arguments]);
    assertion(typeof table === "string", `Parameter «table» must be a string on «updateMany»`);
    assertion(typeof filters === "object", `Parameter «filters» must be an object on «updateMany»`);
    assertion(typeof values === "object", `Parameter «values» must be an object on «updateMany»`);
    const sqlPart1 = this._sqliteUpdateSet(table, values);
    const sqlPart2 = this._sqliteWhere(filters, true);
    const sql = sqlPart1 + sqlPart2;
    const result = this.runSql(sql);
    return true;
  }

  updateOne(table, id, values) {
    this.trace("updateOne", [...arguments]);
    assertion(typeof table === "string", `Parameter «table» must be a string on «updateOne»`);
    assertion((typeof id === "number") || (typeof id === "string"), `Parameter «id» must be an number or a string on «updateOne»`);
    assertion(typeof values === "object", `Parameter «values» must be an object on «updateOne»`);
    const sqlPart1 = this._sqliteUpdateSet(table, values);
    const sqlPart2 = this._sqliteWhere([["id", "=", id]], true);
    const sql = sqlPart1 + sqlPart2;
    const result = this.runSql(sql);
    return true;
  }

  deleteMany(table, filters) {
    this.trace("deleteMany", [...arguments]);
    assertion(typeof table === "string", `Parameter «table» must be a string on «deleteMany»`);
    assertion(typeof filters === "object", `Parameter «filters» must be an object on «deleteMany»`);
    const sqlPart1 = this._sqliteDeleteFrom(table);
    const sqlPart2 = this._sqliteWhere(filters, true);
    const sql = sqlPart1 + sqlPart2;
    const result = this.runSql(sql);
    return true;
  }

  deleteOne(table, id) {
    this.trace("deleteOne", [...arguments]);
    assertion(typeof table === "string", `Parameter «table» must be a string on «deleteOne»`);
    assertion((typeof id === "number") || (typeof id === "string"), `Parameter «id» must be a number or a string on «deleteOne»`);
    const sqlPart1 = this._sqliteDeleteFrom(table);
    const sqlPart2 = this._sqliteWhere([["id", "=", id]], true);
    const sql = sqlPart1 + sqlPart2;
    const result = this.runSql(sql);
    return true;
  }

  addTable(table, partialSchema) {
    this.trace("addTable", [...arguments]);
    assertion(typeof table === "string", `Parameter «table» must be a string on «addTable»`);
    assertion(!(table in this.$schema.tables), `Parameter «table» cannot be a schema table on «addTable»`);
    assertion(typeof partialSchema === "object", `Parameter «partialSchema» must be an object on «addTable»`);
    this.constructor.checkSchemaTableValidity(table, partialSchema);
    this._addTable(table, partialSchema);
  }

  addColumn(table, column, partialSchema) {
    this.trace("addColumn", [...arguments]);
    assertion(typeof table === "string", `Parameter «table» must be a string on «addColumn»`);
    assertion(typeof column === "string", `Parameter «column» must be a string on «addColumn»`);
    assertion(typeof partialSchema === "object", `Parameter «partialSchema» must be an object on «addTable»`);
    this.constructor.checkSchemaColumnValidity(table, column, partialSchema);
    this._addColumn(table, column, partialSchema);
  }

  renameTable(table, newName) {
    this.trace("renameTable", [...arguments]);
    assertion(typeof table === "string", `Parameter «table» must be a string on «renameTable»`);
    assertion(typeof newName === "string", `Parameter «newName» must be a string on «renameTable»`);
    assertion(table in this.$schema.tables, `Parameter «table» must be a schema table on «renameTable»`);
    assertion(!(newName in this.$schema.tables), `Parameter «newName» cannot be a schema table on «renameTable»`);
    this._renameTable(table, newName);
  }

  renameColumn(table, column, newName) {
    this.trace("renameColumn", [...arguments]);
    assertion(typeof table === "string", `Parameter «table» must be a string on «renameColumn»`);
    assertion(typeof column === "string", `Parameter «column» must be a string on «renameColumn»`);
    assertion(typeof newName === "string", `Parameter «newName» must be a string on «renameColumn»`);
    assertion(table in this.$schema.tables, `Parameter «table» must be a schema table on «renameColumn»`);
    assertion(column in this.$schema.tables[table].columns, `Parameter «column» must be a schema column on «renameColumn»`);
    assertion(!(newName in this.$schema.tables[table].columns), `Parameter «newName» cannot be a schema column on «renameColumn»`);
    this._renameColumn(table, column, newName);
  }

  dropTable(table) {
    this.trace("dropTable", [...arguments]);
    assertion(typeof table === "string", `Parameter «table» must be a string on «dropTable»`);
    assertion(table in this.$schema.tables, `Parameter «table» must be a schema table on «dropTable»`);
    this._dropTable(table);
  }

  dropColumn(table, column) {
    this.trace("dropColumn", [...arguments]);
    assertion(typeof table === "string", `Parameter «table» must be a string on «dropColumn»`);
    assertion(typeof column === "string", `Parameter «column» must be a string on «dropColumn»`);
    assertion(table in this.$schema.tables, `Parameter «table» must be a schema table on «dropColumn»`);
    assertion(column in this.$schema.tables[table].columns, `Parameter «column» must be a schema column on «dropColumn»`);
    this._dropColumn(table, column);
  }

  insertSql(sql) {
    if (this.$options.traceSql) {
      console.log("[sql]", sql);
    }
    return this.$database.prepare(sql).run();
  }

  runSql(sql) {
    if (this.$options.traceSql) {
      console.log("[sql]", sql);
    }
    return this.$database.exec(sql);
  }

  fetchSql(sql) {
    if (this.$options.traceSql) {
      console.log("[sql]", sql);
    }
    return this.$database.prepare(sql).all();
  }

  reloadSchema() {
    this._loadSchema();
  }

  _sqliteTypeFromColumnSchema(columnSchema) {
    switch (columnSchema.type) {
      case "boolean": return "INTEGER";
      case "integer": return "INTEGER";
      case "blob": return "BLOB";
      case "real": return "REAL";
      case "date": return "DATE";
      case "datetime": return "DATETIME";
      case "string": {
        if (columnSchema.maxLength) {
          return `VARCHAR(${columnSchema.maxLength})`;
        }
        return "TEXT";
      }
      case "object":
      case "array": return "TEXT";
      case "object-reference": return "INTEGER";
      default:
        throw new Error(`Unknown column type: ${columnSchema.type}`);
    }
  }

  _sqliteCreateTableFromTableSchema(table, partialSchema) {
    const cols = ["id INTEGER PRIMARY KEY AUTOINCREMENT"];
    const columnIds = Object.keys(partialSchema.columns);
    for (let indexColumn = 0; indexColumn < columnIds.length; indexColumn++) {
      const columnId = columnIds[indexColumn];
      const columnSchema = partialSchema.columns[columnId];
      let columnStatement = `${columnId} ${this._sqliteTypeFromColumnSchema(columnSchema)}`;
      if (columnSchema.unique) {
        columnStatement += ` UNIQUE`;
      }
      if (columnSchema.nullable !== true) {
        columnStatement += ` NOT NULL`;
      }
      if (columnSchema.defaultBySql) {
        columnStatement += ` DEFAULT ${columnSchema.defaultBySql}`;
      }
      if (columnSchema.type === "object-reference") {
        columnStatement += ` REFERENCES ${columnSchema.referredTable} (id)`;
      }
      cols.push(columnStatement);
    }
    const sqlCreate = `CREATE TABLE ${table} (\n  ${cols.join(",\n  ")}\n);`;
    return sqlCreate;
  }

  _addTable(table, partialSchema) {
    this.trace("_addTable", [table]);
    const sqlCreate = this._sqliteCreateTableFromTableSchema(table, partialSchema);
    this.runSql(sqlCreate);
    this.$schema.tables[table] = this.copyObject(partialSchema);
    this._persistSchema();
  }

  _addColumn(table, column, partialSchema) {
    this.trace("_addColumn", [table, column]);
    assertion(table in this.$schema.tables, `Parameter «table» must be a schema table on «addColumn»`);
    const tableSchemaCopy = this.copyObject(this.$schema.tables[table]);
    const oldColumns = Object.keys(this.$schema.tables[table].columns);
    assertion(!(column in tableSchemaCopy), `Parameter «column» cannot be a schema column on «addColumn»`);
    tableSchemaCopy.columns[column] = partialSchema;
    const sqlCreate = this._sqliteCreateTableFromTableSchema(table, tableSchemaCopy);
    // this.runSql("PRAGMA foreign_keys = OFF;");
    this.runSql(`ALTER TABLE ${table} RENAME TO ${table}_tmp;`);
    this.runSql(sqlCreate);
    this.runSql(`INSERT INTO ${table} (${oldColumns.join(", ")}) SELECT ${oldColumns.join(", ")} FROM ${table}_tmp;`);
    this.runSql(`DROP TABLE ${table}_tmp;`);
    // this.runSql("PRAGMA foreign_keys = ON;");
    this.$schema.tables[table] = tableSchemaCopy;
    this._persistSchema();
  }

  _renameTable(table, newName) {
    this.runSql(`ALTER TABLE ${table} RENAME TO ${newName};`);
    this.$schema.tables[newName] = this.copyObject(this.$schema.tables[table]);
    delete this.$schema.tables[table];
    this._persistSchema();
  }

  _renameColumn(table, column, newName) {
    this.runSql(`ALTER TABLE ${table} RENAME COLUMN ${column} TO ${newName};`);
    this.$schema.tables[table].columns[newName] = this.copyObject(this.$schema.tables[table].columns[column]);
    delete this.$schema.tables[table].columns[column];
    this._persistSchema();
  }

  _dropTable(table) {
    this.runSql(`DROP TABLE ${table};`);
    delete this.$schema.tables[table];
    this._persistSchema();
  }

  _dropColumn(table, column) {
    this.runSql(`ALTER TABLE ${table} DROP COLUMN ${column};`);
    delete this.$schema.tables[table].columns[column];
    this._persistSchema();
  }

  _ensureBasicMetadata() {
    this.runSql(`
      CREATE TABLE IF NOT EXISTS Database_metadata (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(255) UNIQUE NOT NULL,
        value TEXT
      );
    `);
    const schemaQuery = this.fetchSql(`SELECT * FROM Database_metadata WHERE name = 'db.schema';`);
    if (schemaQuery.length === 0) {
      this.runSql(`INSERT INTO Database_metadata (name, value) VALUES ('db.schema', ${this.constructor.escapeValue(JSON.stringify({ tables: {} }))});`);
    }
  }

  _persistSchema() {
    const schemaQuery = this.fetchSql(`SELECT * FROM Database_metadata WHERE name = 'db.schema';`);
    assertion(schemaQuery.length === 1, `Could not reach schema from database on «persistSchema»`);
    this.runSql(`UPDATE Database_metadata SET value = ${this.constructor.escapeValue(JSON.stringify(this.$schema))} WHERE id = ${schemaQuery[0].id}`);
  }

  _loadSchema() {
    const schemaQuery = this.fetchSql(`SELECT * FROM Database_metadata WHERE name = 'db.schema';`);
    assertion(schemaQuery.length === 1, `Could not reach schema from database on «loadSchema»`);
    const schema = JSON.parse(schemaQuery[0].value);
    this.$schema = schema;
  }

  _sqliteSelectFrom(table) {
    let sql = "";
    sql += "SELECT * FROM ";
    sql += this.constructor.escapeId(table);
    return sql;
  }

  _sqliteInsertInto(table, columnIds) {
    let sql = "";
    sql += "INSERT INTO ";
    sql += this.constructor.escapeId(table);
    sql += " (";
    for (let indexColumn = 0; indexColumn < columnIds.length; indexColumn++) {
      const columnId = columnIds[indexColumn];
      if (indexColumn !== 0) {
        sql += ",";
      }
      sql += "\n  " + this.constructor.escapeId(columnId);
    }
    sql += "\n)";
    return sql;
  }

  _sqliteInsertValues(registers, columnIds, table) {
    let sql = "";
    sql += " VALUES ";
    for (let indexRegisters = 0; indexRegisters < registers.length; indexRegisters++) {
      const register = registers[indexRegisters];
      if (indexRegisters !== 0) {
        sql += ", ";
      }
      sql += "(";
      for (let indexColumns = 0; indexColumns < columnIds.length; indexColumns++) {
        const columnId = columnIds[indexColumns];
        const columnValue = typeof register[columnId] === "undefined" ? null : register[columnId];
        if (indexColumns !== 0) {
          sql += ",";
        }
        sql += "\n  " + this.constructor.escapeValue(columnValue, table, columnId);
      }
      sql += "\n)";
    }
    sql += ";";
    return sql;
  }

  _sqliteUpdateSet(table, values) {
    let sql = "";
    sql += "UPDATE ";
    sql += this.constructor.escapeId(table);
    sql += " SET ";
    const columnIds = Object.keys(values);
    for (let indexColumn = 0; indexColumn < columnIds.length; indexColumn++) {
      const columnId = columnIds[indexColumn];
      const columnValue = values[columnId];
      if (indexColumn !== 0) {
        sql += ",";
      }
      sql += "\n  ";
      sql += this.constructor.escapeId(columnId);
      sql += " = ";
      sql += this.constructor.escapeValue(columnValue, table, columnId);
    }
    return sql;
  }

  _sqliteWhere(whereRules, includeWhereKeyword = true) {
    let sql = "";
    assertion(Array.isArray(whereRules), `Parameter «whereRules» must be an array on «_sqliteWhere»`);
    if (whereRules.length && includeWhereKeyword) {
      sql += "\nWHERE ";
    }
    for (let indexRules = 0; indexRules < whereRules.length; indexRules++) {
      const whereRule = whereRules[indexRules];
      assertion(Array.isArray(whereRule), `Parameter «whereRules[${indexRules}]» must be an array on «_sqliteWhere»`);
      assertion(whereRule.length > 2, `Parameter «whereRules[${indexRules}].length» must be greater than 2 on «_sqliteWhere»`);
      const [column, operator, comparator] = whereRule;
      if (indexRules !== 0) {
        sql += "\n  AND ";
      }
      sql += this.constructor.escapeId(column);
      assertion(this.constructor.knownOperators.indexOf(operator) !== -1, `Parameter «whereRules[${indexRules}][1]» must be a known operator on «_sqliteWhere»`);
      if (["<", "<=", ">", ">=", "=", "!="].indexOf(operator) !== -1) {
        sql += " " + operator + " ";
        sql += this.constructor.escapeValue(comparator);
      } else if (operator === "is null") {
        sql += " = NULL";
      } else if (operator === "is not null") {
        sql += " != NULL";
      } else if (operator === "is in") {
        sql += " IN ";
        assertion(Array.isArray(comparator), `Parameter «whereRules[${indexRules}][2]» must be an array to work with «is in» operator on «_sqliteWhere»`);
        sql += "(" + comparator.map(val => this.constructor.escapeValue(val)).join(",") + ")";
      } else if (operator === "is not in") {
        assertion(Array.isArray(comparator), `Parameter «whereRules[${indexRules}][2]» must be an array to work with «is not in» operator on «_sqliteWhere»`);
        sql += " NOT IN ";
        sql += "(" + comparator.map(val => this.constructor.escapeValue(val)).join(",") + ")";
      } else if (operator === "is like") {
        sql += " LIKE ";
        assertion(typeof comparator === "string", `Parameter «whereRules[${indexRules}][2]» must be a string to work with «is like» operator on «_sqliteWhere»`);
        sql += this.constructor.escapeValue(comparator);
      } else if (operator === "is not like") {
        assertion(typeof comparator === "string", `Parameter «whereRules[${indexRules}][2]» must be a string to work with «is not like» operator on «_sqliteWhere»`);
        sql += " NOT LIKE ";
        sql += this.constructor.escapeValue(comparator);
      }
    }
    return sql;
  }

  _sqliteDeleteFrom(table) {
    let sql = "";
    sql += "DELETE FROM ";
    sql += this.constructor.escapeId(table);
    return sql;
  }

  _injectDefaultByJs(table, values) {
    const allColumns = this.$schema.tables[table].columns;
    const columnIds = Object.keys(allColumns);
    const defaultedColumns = [];
    for (let indexColumn = 0; indexColumn < columnIds.length; indexColumn++) {
      const columnId = columnIds[indexColumn];
      const columnMetadata = allColumns[columnId];
      if (columnMetadata.defaultByJs) {
        defaultedColumns.push(columnId);
      }
    }
    for (let indexRow = 0; indexRow < values.length; indexRow++) {
      const row = values[indexRow];
      Iterating_defaults:
      for (let indexDefaulted = 0; indexDefaulted < defaultedColumns.length; indexDefaulted++) {
        const columnId = defaultedColumns[indexDefaulted];
        if (typeof row[columnId] !== "undefined") {
          continue Iterating_defaults;
        }
        const columnMetadata = allColumns[columnId];
        const columnDefault = columnMetadata.defaultByJs;
        const defaultCallback = this._newFunction(["row", "index"], columnDefault);
        try {
          const output = defaultCallback.call(this, row, indexRow);
          row[columnId] = output;
        } catch (error) {
          console.log("Column configuration «defaultByJs» is throwing an error:", error);
        }
      }
    }
  }

  _rehydrateResults(table, results) {
    const allColumns = this.$schema.tables[table].columns;
    const columnIds = Object.keys(allColumns);
    Hydrate_jsons: {
      const jsonColumns = [];
      for (let indexColumn = 0; indexColumn < columnIds.length; indexColumn++) {
        const columnId = columnIds[indexColumn];
        const columnMetadata = allColumns[columnId];
        if (columnMetadata.type === "object") {
          jsonColumns.push(columnId);
        } else if (columnMetadata.type === "array") {
          jsonColumns.push(columnId);
        }
      }
      for (let indexRow = 0; indexRow < results.length; indexRow++) {
        const row = results[indexRow];
        for (let indexColumns = 0; indexColumns < jsonColumns.length; indexColumns++) {
          const columnId = jsonColumns[indexColumns];
          try {
            row[columnId] = JSON.parse(row[columnId]);
          } catch (error) {
            console.log(`Column «${columnId}» could not be parsed as JSON on index «${indexRow}»`);
          }
        }
      }
    }
    Hydrate_dates: {
      const dateColumns = [];
      for (let indexColumn = 0; indexColumn < columnIds.length; indexColumn++) {
        const columnId = columnIds[indexColumn];
        const columnMetadata = allColumns[columnId];
        if (columnMetadata.type === "date") {
          dateColumns.push(columnId);
        } else if (columnMetadata.type === "datetime") {
          dateColumns.push(columnId);
        }
      }
      for (let indexRow = 0; indexRow < results.length; indexRow++) {
        const row = results[indexRow];
        for (let indexColumns = 0; indexColumns < dateColumns.length; indexColumns++) {
          const columnId = dateColumns[indexColumns];
          try {
            row[columnId] = new Date(row[columnId]);
          } catch (error) {
            console.log(`Column «${columnId}» could not be parsed as Date object on index «${indexRow}»`);
          }
        }
      }
    }
    Hydrate_booleans: {
      const booleanColumns = [];
      for (let indexColumn = 0; indexColumn < columnIds.length; indexColumn++) {
        const columnId = columnIds[indexColumn];
        const columnMetadata = allColumns[columnId];
        if (columnMetadata.type === "boolean") {
          booleanColumns.push(columnId);
        }
      }
      for (let indexRow = 0; indexRow < results.length; indexRow++) {
        const row = results[indexRow];
        for (let indexColumns = 0; indexColumns < booleanColumns.length; indexColumns++) {
          const columnId = booleanColumns[indexColumns];
          try {
            row[columnId] = row[columnId] ? true : false;
          } catch (error) {
            console.log(`Column «${columnId}» could not be parsed as boolean object on index «${indexRow}»`);
          }
        }
      }
    }
    return results;
  }

  _newFunction(args, code) {
    const callback = new Function(...args, code);
    return callback;
  }

}

module.exports = Flysql;