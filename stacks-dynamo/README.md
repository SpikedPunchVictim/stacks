# stacks-dynamo

A DynamoDB plugin for `stacks`. Under the hood, this plugin uses the [dynatron](https://dynatron.cyberlabs.am/) package.


# Client Options

A combination of

* [AWS DynamoDB SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/interfaces/dynamodbclientconfig.html)
* Dynatron Options


# Development

A local `docker-compose` file is used to bring up a local stack.


# StoreContext

```js
{
   name: 'stacks:dynamodb',
   version: <package version>,
   store: {
      client: <dynatron-client>,
      options: <plugin options>
   }
}
```