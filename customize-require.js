var handler = require.extensions[".js"];

var patterns = {
  dir: {},
};

function customize_require (opts) {
  if (!(Array.isArray(opts.cfg.mods) && opts.cfg.mods.length)) return;

  var cfg = opts.cfg;
  var mods = {};

  opts.cfg.mods.forEach(function (mod) {
    var type = mods[mod.type] = mods[mod.type] || {};
    type[mod.from] = mod.to;
  });

  function make_custom_require (original) {
    return function require (id) {
      var alias;

      if (mods.id && mods.id[id]) id = mods.id[id];
      else {
        Object.keys(mods.dir).some(function (dir) {
          var pattern = patterns.dir[dir] = patterns.dir[dir] || RegExp(
            "^(" + dir + ")(\/.+)"
          );
          var matches = id.match(pattern) || [];
          alias = mods.dir[matches[1]];
          if (alias) id = id.replace(matches[1], alias);

          return !!alias;
        });
      }
      return original.call(this, id);
    };
  }

  require.extensions[".js"] = function (module, pathname) {
    module.require = make_custom_require(module.require);
    return handler.call(this, module, pathname);
  };
}

module.exports = customize_require;
