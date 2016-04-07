A WIP experimental approach to solving the Node `require()` `../../../../../../..` problem. See for example [Better local require() paths for Node.js](https://gist.github.com/branneman/8048520). Allows `require()`ing paths that are relative to the application root, or whatever you configure.

# Use case

```js
// Before
require("../../../../../../../whatever");

// After
require("app/whatever");
```

# Features
* Only needs to be invoked at app launch. Doesn't require any changes to modules, they just call `require()` normally (except with the paths you configure).
* Uses only public Node API.
* More flexible than `NODE_PATH`.

# Usage

Create an initialization script that you require prior to your normal app entry script:

```js
// init.js
require("customize-require")({
  mods: {
    dir: {
      // Makes `require("app/whatever")` behave like
      // `require("/path/to/some/dir/whatever")`, from anywhere in your
      // dependency tree.
      "app": "/path/to/some/dir",
    }
  }
});
```

`node -r ./init.js entry.js`
