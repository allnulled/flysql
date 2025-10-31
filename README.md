# flysql

Proxy para `better-sqlite3` con gestión nuclear de `schema`.

# Índice

- [flysql](#flysql)
- [Índice](#índice)
- [Instalación](#instalación)
- [API](#api)
  - [`Flysql.create(...args):Flysql`](#flysqlcreateargsflysql)
  - [`Flysql.connect(...args):Flysql`](#flysqlconnectargsflysql)
  - [`Flysql.AssertionError:Function`](#flysqlassertionerrorfunction)
  - [`Flysql.assertion:Function`](#flysqlassertionfunction)
  - [`Flysql.defaultOptions:Object`](#flysqldefaultoptionsobject)
  - [`Flysql.defaultDatabaseOptions:Object`](#flysqldefaultdatabaseoptionsobject)
  - [`Flysql.knownTypes:Array`](#flysqlknowntypesarray)
  - [`Flysql.knownOperators`](#flysqlknownoperators)
  - [`Flysql.checkSchemaColumnValidity(tableId:String, columnId:String, partialSchema:Object)`](#flysqlcheckschemacolumnvaliditytableidstring-columnidstring-partialschemaobject)
  - [`Flysql.checkSchemaTableValidity(tableId:String, partialSchema:Object)`](#flysqlcheckschematablevaliditytableidstring-partialschemaobject)
  - [`Flysql.checkSchemaValidity(schema:Object)`](#flysqlcheckschemavalidityschemaobject)
  - [`Flysql.escapeId(id:String):String`](#flysqlescapeididstringstring)
  - [`Flysql.escapeValue(value:String|Number):String`](#flysqlescapevaluevaluestringnumberstring)
  - [`Flysql.padLeft(txt:String, len:Number, filler:String = "0"):String`](#flysqlpadlefttxtstring-lennumber-fillerstring--0string)
  - [`Flysql.normalizeDate(dateObject:Date):String`](#flysqlnormalizedatedateobjectdatestring)
  - [`Flysql.normalizeMoment(dateObject)`](#flysqlnormalizemomentdateobject)
  - [`Flysql.constructor(options:Object = {}):Flysql`](#flysqlconstructoroptionsobject--flysql)
  - [`flysql.trace(msg:String, argz:Array = [])`](#flysqltracemsgstring-argzarray--)
  - [`flysql.checkInstanceValidity(table:String, item:Object)`](#flysqlcheckinstancevaliditytablestring-itemobject)
  - [`flysql.copyObject(data)`](#flysqlcopyobjectdata)
  - [`flysql.addSchema(schema:Object)`](#flysqladdschemaschemaobject)
  - [`flysql.getSchema()`](#flysqlgetschema)
  - [`flysql.connect()`](#flysqlconnect)
  - [`flysql.disconnect()`](#flysqldisconnect)
  - [`flysql.selectMany(table:String, filters:Array)`](#flysqlselectmanytablestring-filtersarray)
  - [`flysql.selectOne(table:String, id:String|Number)`](#flysqlselectonetablestring-idstringnumber)
  - [`flysql.insertMany(table:String, registers:Array)`](#flysqlinsertmanytablestring-registersarray)
  - [`flysql.insertOne(table:String, register:Object)`](#flysqlinsertonetablestring-registerobject)
  - [`flysql.updateMany(table:String, filters:Array, values:Object)`](#flysqlupdatemanytablestring-filtersarray-valuesobject)
  - [`flysql.updateOne(table:String, id:String|Number, values:Object)`](#flysqlupdateonetablestring-idstringnumber-valuesobject)
  - [`flysql.deleteMany(table:String, filters:Array)`](#flysqldeletemanytablestring-filtersarray)
  - [`flysql.deleteOne(table:String, id:String|Number)`](#flysqldeleteonetablestring-idstringnumber)
  - [`flysql.addTable(table:String, partialSchema:Object)`](#flysqladdtabletablestring-partialschemaobject)
  - [`flysql.addColumn(table:String, column:String, partialSchema:Object)`](#flysqladdcolumntablestring-columnstring-partialschemaobject)
  - [`flysql.renameTable(table:String, newName:String)`](#flysqlrenametabletablestring-newnamestring)
  - [`flysql.renameColumn(table:String, column:String, newName:String)`](#flysqlrenamecolumntablestring-columnstring-newnamestring)
  - [`flysql.dropTable(table:String)`](#flysqldroptabletablestring)
  - [`flysql.dropColumn(table:String, column:String)`](#flysqldropcolumntablestring-columnstring)
  - [`flysql.insertSql(sql:String)`](#flysqlinsertsqlsqlstring)
  - [`flysql.runSql(sql:String)`](#flysqlrunsqlsqlstring)
  - [`flysql.fetchSql(sql:String)`](#flysqlfetchsqlsqlstring)
  - [`flysql.reloadSchema()`](#flysqlreloadschema)
- [API no pública](#api-no-pública)
  - [`flysql._sqliteTypeFromColumnSchema(columnSchema)`](#flysql_sqlitetypefromcolumnschemacolumnschema)
  - [`flysql._sqliteCreateTableFromTableSchema(table:String, partialSchema)`](#flysql_sqlitecreatetablefromtableschematablestring-partialschema)
  - [`flysql._addTable(table:String, partialSchema)`](#flysql_addtabletablestring-partialschema)
  - [`flysql._addColumn(table:String, column, partialSchema)`](#flysql_addcolumntablestring-column-partialschema)
  - [`flysql._renameTable(table:String, newName)`](#flysql_renametabletablestring-newname)
  - [`flysql._renameColumn(table:String, column, newName)`](#flysql_renamecolumntablestring-column-newname)
  - [`flysql._dropTable(table)`](#flysql_droptabletable)
  - [`flysql._dropColumn(table:String, column)`](#flysql_dropcolumntablestring-column)
  - [`flysql._ensureBasicMetadata()`](#flysql_ensurebasicmetadata)
  - [`flysql._persistSchema()`](#flysql_persistschema)
  - [`flysql._loadSchema()`](#flysql_loadschema)
  - [`flysql._sqliteSelectFrom(table)`](#flysql_sqliteselectfromtable)
  - [`flysql._sqliteInsertInto(table:String, columnIds)`](#flysql_sqliteinsertintotablestring-columnids)
  - [`flysql._sqliteInsertValues(registers:Array, columnIds)`](#flysql_sqliteinsertvaluesregistersarray-columnids)
  - [`flysql._sqliteUpdateSet(table:String, values)`](#flysql_sqliteupdatesettablestring-values)
  - [`flysql._sqliteWhere(whereRules, includeWhereKeyword = true)`](#flysql_sqlitewherewhererules-includewherekeyword--true)
  - [`flysql._sqliteDeleteFrom(table)`](#flysql_sqlitedeletefromtable)
- [Ejemplo](#ejemplo)

# Instalación

```sh
npm i -s @allnulled/flysql
```

# API

La API es totalmente síncrona debido a cómo funciona `better-sqlite3`.

## `Flysql.create(...args):Flysql`

Llama al `flysql.constructor` y devuelve la instancia.

## `Flysql.connect(...args):Flysql`

Llama al `flysql.constructor`, llama al `flysql.connect()` y devuelve la instancia.

## `Flysql.AssertionError:Function`

Clase de `Error` para las aserciones en tiempo de ejecución.

## `Flysql.assertion:Function`

Función para hacer aserciones.

## `Flysql.defaultOptions:Object`

Opciones por defecto pasadas al `constructor`. Las opciones son:

```js
{
  trace: false,
  traceSql: false,
  filename: path.resolve(process.cwd(), "db.sqlite")
}
```

## `Flysql.defaultDatabaseOptions:Object`

Opciones por defecto pasadas al `better-sqlite3`. Las opciones son:

```js
{
  readonly: false,
  fileMustExist: false,
  timeout: 5000,
  verbose: (...args) => { },
}
```

## `Flysql.knownTypes:Array`

Tipos válidos de columna.

```js
["boolean", "integer", "float", "string", "object", "array", "object-reference", "array-reference"]
```

## `Flysql.knownOperators`

Operadores válidos para los filtros en las consultas.

```js
["<", "<=", ">", ">=", "=", "!=", "is in", "is not in", "is null", "is not null", "is like", "is not like"]
```

## `Flysql.checkSchemaColumnValidity(tableId:String, columnId:String, partialSchema:Object)`

Método que comprueba la validez de una columna del `schema`.

Aquí, `partialSchema:Object` tiene que ser una columna en el `schema`.

Las propiedades válidas de columna son:

- `nullable:Boolean` - debe ser `true` o `false`. Por defecto es `false` siempre.
- `unique:Boolean` - debe ser `true` o `false`. Por defecto es `false` siempre.
- `defaultBySql:String` - debe ser el código SQL que quieres poner detrás de la instrucción `DEFAULT`.
   - se hace una inyección limpia en este campo.
   - esto significa que si quieres poner un string, debes incluir las comillas.
- `type:String` - debe ser uno de los tipos válidos, los `Flysql.knownTypes`, que son:
   - `boolean`
   - `integer`
   - `float`
   - `string`
   - `object`
   - `array`
   - `object-reference`

## `Flysql.checkSchemaTableValidity(tableId:String, partialSchema:Object)`

Método que comprueba la validez de una tabla del `schema`.

El objeto `partialSchema:Object` tiene que tener una propiedad `columns:Object` mínimo, aunque esté vacía.

## `Flysql.checkSchemaValidity(schema:Object)`

Método que comprueba la validez de un `schema`.

El objeto `schema` tiene que tener una propiedad `tables:Object` mínimo, aunque esté vacía.

## `Flysql.escapeId(id:String):String`

Método para escapar un identificador en `sql`.

## `Flysql.escapeValue(value:String|Number):String`

Método para escapar un valor en `sql`.

## `Flysql.padLeft(txt:String, len:Number, filler:String = "0"):String`

Método utilitario para llenar por la izquierda un texto hasta que llegue a cierta longitud.

## `Flysql.normalizeDate(dateObject:Date):String`

Método utilitario para transformar objetos `Date` a un formato de fecha (hasta día) homogéneo.

## `Flysql.normalizeMoment(dateObject)`

Método utilitario para transformar objetos `Date` a un formato de fecha (hasta milisegundos) homogéneo.

## `Flysql.constructor(options:Object = {}):Flysql`

Constructor de objetos `Flysql`.

El objeto `options:Object` se llena por defecto con estas propiedades:

```js
  static defaultOptions = {
    trace: false,
    traceSql: false,
    filename: path.resolve(process.cwd(), "db.sqlite")
    databaseOptions: {
      readonly: false,
      fileMustExist: false,
      timeout: 5000,
      verbose: (...args) => { },
    },
  };
```

Puedes sobreescribir cualquiera, incluso las de dentro de `databaseOptions`.

Además, el método incorporará las siguientes propiedades propias:

- `this.$database:Object = null`
- `this.$schema:Object`
- `this.$options:Object`

## `flysql.trace(msg:String, argz:Array = [])`

Método utilitario usado para los traceos.

## `flysql.checkInstanceValidity(table:String, item:Object)`

Método para comprobar si un objeto cumple con la interfaz esperada de una `table` del `schema`.

## `flysql.copyObject(data)`

Método utilitario que copia un objeto, usando `JSON.stringify + JSON.parse`.

## `flysql.addSchema(schema:Object)`

Método para añadir parte de un `schema` al `flysql.$schema`.

El objeto `schema:Object` debe contener mínimo una propiedad `tables:Object`.

## `flysql.getSchema()`

Método que devuelve el `flysql.$schema`.

## `flysql.connect()`

Método que abre la base de datos y sincroniza el `flysql.$schema`.

Debes tener en cuenta que `flysql.$schema` está dentro de la base de datos:

- En la tabla `Database_metadata`
- Con el `name = 'db.schema'`
- En formato JSON

De esta forma, se consigue tener acoplado a la base de datos, el `flysql.$schema` que va a validar las instancias y demás.

## `flysql.disconnect()`

Método que cierra la base de datos.

## `flysql.selectMany(table:String, filters:Array)`

## `flysql.selectOne(table:String, id:String|Number)`

## `flysql.insertMany(table:String, registers:Array)`

## `flysql.insertOne(table:String, register:Object)`

## `flysql.updateMany(table:String, filters:Array, values:Object)`

## `flysql.updateOne(table:String, id:String|Number, values:Object)`

## `flysql.deleteMany(table:String, filters:Array)`

## `flysql.deleteOne(table:String, id:String|Number)`

## `flysql.addTable(table:String, partialSchema:Object)`

## `flysql.addColumn(table:String, column:String, partialSchema:Object)`

## `flysql.renameTable(table:String, newName:String)`

## `flysql.renameColumn(table:String, column:String, newName:String)`

## `flysql.dropTable(table:String)`

## `flysql.dropColumn(table:String, column:String)`

## `flysql.insertSql(sql:String)`

## `flysql.runSql(sql:String)`

## `flysql.fetchSql(sql:String)`

## `flysql.reloadSchema()`


# API no pública

Además de estos, hay una serie de métodos pensados para uso privado, pero que en esta documentación aparecen igualmente.

Estos métodos tienen la peculiaridad de comenzar siempre con `_`.

## `flysql._sqliteTypeFromColumnSchema(columnSchema)`

## `flysql._sqliteCreateTableFromTableSchema(table:String, partialSchema)`

## `flysql._addTable(table:String, partialSchema)`

## `flysql._addColumn(table:String, column, partialSchema)`

## `flysql._renameTable(table:String, newName)`

## `flysql._renameColumn(table:String, column, newName)`

## `flysql._dropTable(table)`

## `flysql._dropColumn(table:String, column)`

## `flysql._ensureBasicMetadata()`

## `flysql._persistSchema()`

## `flysql._loadSchema()`

## `flysql._sqliteSelectFrom(table)`

## `flysql._sqliteInsertInto(table:String, columnIds)`

## `flysql._sqliteInsertValues(registers:Array, columnIds)`

## `flysql._sqliteUpdateSet(table:String, values)`

## `flysql._sqliteWhere(whereRules, includeWhereKeyword = true)`

## `flysql._sqliteDeleteFrom(table)`





# Ejemplo

```js
module.exports = async function (Flysql) {

  const fs = require("fs");

  fs.unlinkSync(__dirname + "/test.sqlite");

  const { assertion } = Flysql;

  const flysql = Flysql.create({
    filename: "test.sqlite",
    trace: true,
    traceSql: true
  });
  flysql.connect();
  flysql.addSchema({
    tables: {
      Usuario: {
        columns: {
          name: {type: "string", maxLength: 255, unique: true},
          email: {type: "string", maxLength: 255, unique: true},
          password: {type: "string", maxLength: 255}
        }
      },
      Grupo: {
        columns: {
          name: {type: "string", maxLength: 255, unique: true},
          description: {type: "string", maxLength: 255},
        }
      },
      Permiso: {
        columns: {
          name: {type: "string", maxLength: 255, unique: true},
          description: {type: "string", maxLength: 255},
        }
      },
      Sesion: {
        columns: {
          token: {type: "string", maxLength: 100, unique: true},
          id_usuario: {type: "object-reference", referredTable: "Usuario"},
        }
      }
    }
  });
  flysql.insertOne("Usuario", { name: "u1", password: "u1", email: "u1@mail.com" });
  flysql.insertMany("Usuario", [
    { name: "u2", password: "u1", email: "u2@mail.com" },
    { name: "u3", password: "u1", email: "u3@mail.com" },
    { name: "u4", password: "u4", email: "u4@mail.com" },
  ]);

  const u1 = flysql.selectOne("Usuario", 1);
  const uN = flysql.selectMany("Usuario", [
    ["name", "is in", ["u2", "u3", "u4"]]
  ]);

  assertion(typeof u1 === "object", "assertion");
  assertion(typeof u1.name === "string", "assertion");
  assertion(u1.name === "u1", "assertion");

  assertion(typeof uN === "object", "assertion");
  assertion(Array.isArray(uN), "assertion");
  assertion(uN.length === 3, "assertion");
  assertion(uN[0].name === "u2", "assertion");
  assertion(uN[1].name === "u3", "assertion");
  assertion(uN[2].name === "u4", "assertion");

  console.log("[*] Completado test: 009.readme");

};
```

