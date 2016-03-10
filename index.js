var fs = require("node-fs-extra");
var path = require("path");
var rl = require('readline-sync');
var glob = require("glob");
var tmp = require("tmp");
var simpleGit = require('simple-git');

module.exports = {
  generate: function(options, cb) {
    this.cloneDirTo(
      'https://github.com/cantierecreativo/bemo.git',
      'bemo',
      options.stylesheetsDir,
      function() {
        if (options.extension) {
          var sassFiles = glob.sync(path.join(options.stylesheetsDir, "**/*.sass"));

          sassFiles.forEach(function(sassFile) {
            var newPath = sassFile.replace(/\.sass$/, "." + options.extension);
            fs.renameSync(sassFile, newPath);
          });
        }

        cb(null);
      }
    );
  },
  ask: function(question) {
    return rl.question(question + " ");
  },
  yesNo: function(question) {
    var answer = this.ask(question + " [y/n]").toLowerCase();
    return answer == 'y' || answer == 'yes';
  },
  confirmCleanDir: function(path) {
    function cleanDir() {
      fs.mkdirpSync(path);
    }

    if (!fs.existsSync(path)) {
      cleanDir();
      return;
    }

    if (this.yesNo("Can I overwrite the dir " + path + "?")) {
      fs.removeSync(path);
      cleanDir();
    } else {
      process.exit(0);
    }
  },
  cloneDirTo: function(repo, repoPath, dest, cb) {
    this.confirmCleanDir(dest);

    var git = simpleGit();
    var tmpDir = tmp.dirSync();
    git.clone(repo, tmpDir.name, function() {
      fs.copySync(path.join(tmpDir.name, repoPath), dest);
      cb(null);
    });
  }
}
