'use strict';

var Promise = require('bluebird'),
  child_process = require('child_process'),
  fs = require('fs'),
  path = require('path'),
  s = require('underscore.string'),
  generators = require('yeoman-generator'),
  log = require('./log');

var exec = function (cmd) {
  return new Promise(function (resolve, reject) {
    child_process.exec(cmd, function (err, res) {
      if(err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

// Global Variables
var folder, folderPath, version;

var versions = {
  'master': 'master'
};

module.exports = generators.Base.extend({
  
  init: function () {
    this.pkg = this.fs.readJSON(path.join(__dirname, '../package.json'));

    this.on('end', function () {
      if (!this.options['skip-install']) {
        log.green('Running npm install for you....');
        log.green('This may take a couple minutes.');
        exec('cd ' + folder + ' && npm install')
          .then(function () {
            log('');
            log.green('------------------------------------------');
            log.green('Your BEAN.js application is ready!');
            log('');
            log.green('To Get Started, run the following command:');
            log('');
            log.yellow('cd ' + folder + ' && grunt');
            log('');
            log.green('Happy Hacking!');
            log.green('------------------------------------------');
          });
      }
    });
  },

  checkForGit: function () {
    var done = this.async();

    exec('git --version')
      .then(function () {
        done();
      })
      .catch(function (err) {
        log.red(new Error(err));
        return;
      });
  },

  welcomeMessage: function () {
    log.green('You\'re using the official BEAN.JS generator.');
  },

  promptForVersion: function () {
    var done = this.async();

    var choices = [];
    for(var v in versions) {
      choices.push(v);
    }

    var prompt = {
      type: 'list',
      name: 'version',
      message: 'What bean.js version would you like to generate?',
      choices: choices,
      default: 1
    };

    this.prompt(prompt, function (props) {
      version = props.version;
      done();
    }.bind(this));

  },

  promptForFolder: function () {
    var done = this.async();

    log.red(version);

    var prompt = {
      name: 'folder',
      message: 'In which folder would you like the project to be generated? This can be changed later.',
      default: 'bean'
    };

    this.prompt(prompt, function (props) {
      folder = props.folder;
      folderPath = './' + folder + '/';
      done();
    }.bind(this));
  },

  cloneRepo: function () {
    var done = this.async();

    log.green('Cloning the BEAN repo.......');

    exec('git clone --branch ' + versions[version] + ' https://github.com/chrisedg87/BeanJS.git ' + folder)
      .then(function () {
        done();
      })
      .catch(function (err) {
        log.red(err);
        return;
      });
  },

  getPrompts: function () {
    var done = this.async();

    var prompts = [{
      name: 'appName',
      message: 'What would you like to call your application?',
      default: 'BEAN'
    }, {
      name: 'appDescription',
      message: 'How would you describe your application?',
      default: 'Node MySQL Framework'
    }, {
      name: 'appAuthor',
      message: 'What is your company/author name?'
    }, {
      type: 'confirm',
      name: 'addArticleExample',
      message: 'Would you like to generate the article example CRUD module?',
      default: true
    }, {
      type: 'confirm',
      name: 'addDevDatabase',
      message: 'Would you like to generate the development database connection config?',
      default: true
    }];

    this.prompt(prompts, function(props) {
      this.appName = props.appName;
      this.appDescription = props.appDescription;
      this.appKeywords = props.appKeywords;
      this.appAuthor = props.appAuthor;
      this.addArticleExample = props.addArticleExample;
      this.addDevDatabase = props.addDevDatabase

      this.slugifiedAppName = s(this.appName).slugify().value();
      this.humanizedAppName = s(this.appName).humanize().value();
      this.capitalizedAppAuthor = s(this.appAuthor).capitalize().value();

      done();
    }.bind(this));
  },

  promptForDatabase: function() {
    var done = this.async();

    if(this.addDevDatabase){
      var prompts = [{
        name: 'dbHost',
        message: 'What is your Database server host address?',
        default: 'db_host'
      }, {
        name: 'dbUser',
        message: 'What is your Database username?',
        default: 'beanjs'
      }, {
        name: 'dbPass',
        message: 'What is your Database password?',
        default: 'somethingsecure'
      }, {
        name: 'dbName',
        message: 'What is your database name?',
        default: 'beanjs'
      }];

      this.prompt(prompts, function(props) {
        this.dbHost = props.dbHost;
        this.dbUser = props.dbUser;
        this.dbPass = props.dbPass;
        this.dbName = props.dbName;
        done();
      }.bind(this));
    }
  },

  applyDbConfig: function() {
    var done = this.async();
    if(this.addDevDatabase){
      var hostRegex = "db_host";
      var userRegex = "db_user";
      var passRegex = "db_pass";
      var nameRegex = "db_name";

      var configFile = (fs.readFileSync(folderPath + 'app/config/env/development.js')).toString();

      configFile = configFile.replace(hostRegex, this.dbHost);
      configFile = configFile.replace(userRegex, this.dbUser);
      configFile = configFile.replace(passRegex, this.dbPass);
      configFile = configFile.replace(nameRegex, this.dbName);

      fs.writeFile(folderPath + 'app/config/env/development.js', configFile, function (err) {
        if(err) {
          return log.red(err);
        }
        done();
      });
    }
  },

  replacePackageConfigs: function () {
    var done = this.async();

    var packageJson = JSON.parse(fs.readFileSync(folderPath + 'package.json'));
    packageJson.name = this.slugifiedAppName;
    packageJson.description = this.appDescription;
    packageJson.author = this.appAuthor;

    fs.writeFile(folderPath + 'package.json', JSON.stringify(packageJson, null, 2), function (err) {
      if(err) {
        return log.red(err);
      }
      done();
    });
  },

  replaceBowerConfigs: function () {
    var done = this.async();

    var bowerJson = JSON.parse(fs.readFileSync(folderPath + 'bower.json'));
    bowerJson.name = this.slugifiedAppName;
    bowerJson.description = this.appDescription;

    fs.writeFile(folderPath + 'bower.json', JSON.stringify(bowerJson, null, 2), function (err) {
      if (err) {
        return log.red(err);
      }
      done();
    });
  },

  replaceConfigConfigs: function () {
    var done = this.async();

    var titleRegex = /title: \'BeanJS\'/g;
    var descriptionRegex = /description: \'Node MySQL Framework\'/g;

    var configFile = (fs.readFileSync(folderPath + 'app/config/env/all.js')).toString();

    configFile = configFile.replace(titleRegex, 'title: \'' + this.slugifiedAppName + '\'');
    configFile = configFile.replace(descriptionRegex, 'description: \'' + this.appDescription + '\'');

    fs.writeFile(folderPath + 'app/config/env/all.js', configFile, function (err) {
      if(err) {
        return log.red(err);
      }
      done();
    });
  },

  removeArticlesExample: function () {
    var done = this.async();

    if(!this.addArticleExample) {
      exec('rm -rf ' + folderPath + 'modules/articles')
        .then(function () {
          done();
        })
        .catch(function (err) {
          log.red(err);
          return;
        });
    } else {
      done();
    }
  }

});