var original = require.extensions[".js"];

function customize_require (opts) {
  var cfg = opts.cfg;

  require.extensions[".js"] = function (module, pathname) {
    var require = module.require;
    module.require = function (id) {
      var alias;
      Object.keys(cfg.mods.dir).some(function (dir) {
        var matches = id.match(/^(app)(\/.+)/) || [];
        alias = cfg.mods.dir[matches[1]];
        if (alias) id = id.replace(matches[1], alias);

        return !!alias;
      });

      return require.call(this, id);
    };
    return original.call(this, module, pathname);
  };
}

module.exports = customize_require;
