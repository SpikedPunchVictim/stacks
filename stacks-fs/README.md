# stacks-fs

This is a file system plugin for stacks. All Models and Objects are stored in the file system as `JSON` files.


# File Structure

/baseDir
   /<model-name-1>
      * <object>
   /<model-name-2>


# StoreContext

```js
{
   name: 'stacks:fs',
   version: <the-current-version>,
   store: {
      baseDir: string,        // The base directory
      options: FsOptions,     // The options object used to create the plugin
      fs: fs                  // The underlying fs object being used
   }
}
```