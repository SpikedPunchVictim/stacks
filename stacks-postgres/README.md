# stacks-postgres

PostgresSQL plugin for `stacks`. The underlying implementation uses the [Kysely](https://github.com/koskimas/kysely) Postgres query builder. This was chosen to provide as much forward functionality as possible.

# Model Definitions

```js

let model = stack.create.model('model', {
   name: '' 
})

model.symbols.push({
   name: 'postgres:
})

```

## Model Symbols

| Name | Required | Type | Description |
|-|-|-|-|
| `postgres:tablename` | optional | string | The name of the Postgres Table. Defaultrs to the Model's name. |
| `postgres:custom` | optional | `function(builder:` [CreateTableBuilder<any, any>](https://koskimas.github.io/kysely/classes/CreateTableBuilder.html)`): Promise<CreateTableBuilder<any, any>>` | Allows you to fully customize the table creation process. This is a lambda function that provides you with the [CreateTableBuilder](https://koskimas.github.io/kysely/classes/CreateTableBuilder.html) Object in the underlying library. |


## Member Symbols

| Name | Required | Type | Description |
|-|-|-|-|
| `postgres:datatype` | optional | string | The Postgres Data Type, as specified [here](https://www.postgresql.org/docs/current/datatype.html). If not provided the plugin will assign a default based on its type. See the *Default Type Mapping* table below. |
| `postgres:columnname` | optional | string | The name of the column for this Member |
| `postgres:customcolumn` | optional | `function(builder:` [CreateTableBuilder<any, any>](https://koskimas.github.io/kysely/classes/CreateTableBuilder.html)`): Promise<CreateTableBuilder<any, any>>` | A custom column definition builder. This exposes the underlying builder to configure the column any way you need. |


**Examples**

```js

```


**Default Type Mapping**

| JS Type | Postgres Type | Notes |
|-|-|-|
| string | `text` |
| number | `integer` |
| boolean | `boolean` |
| array | <item type>[] | Also supports List of Lists, ie `int[][]` |
| Object Ref | table or composite type | Will use the Type's Table nme or Composite name |


# Store Context

TODO: Fill out

```js
name: 'stacks:postgres',
version: this.version || 'version-not-set',
store: {
   config: this.config,
   db: this.context.db,
   tables: Array.from(this.context.tableMap.values())
}
```

# Underlying Details

* Search indexes are created on each table for the `id` column using btree.