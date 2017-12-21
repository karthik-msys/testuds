// Generated by CoffeeScript 1.12.7
(function() {
  "use strict";
  var $, api, ref;

  this.api = (ref = this.api) != null ? ref : {};

  $ = jQuery;

  api = this.api;

  Handlebars.registerHelper("eachKey", function(context, options) {
    var first, prop, ret;
    ret = "";
    first = true;
    for (prop in context) {
      ret = ret + options.fn({
        key: prop,
        value: context[prop],
        first: first
      });
      first = false;
    }
    return ret;
  });

  Handlebars.registerHelper("eachKeySorted", function(context, options) {
    var first, i, k, keys, len1, prop, ret, sortedKeys;
    ret = "";
    first = true;
    keys = (function() {
      var results;
      results = [];
      for (k in context) {
        results.push(k);
      }
      return results;
    })();
    sortedKeys = keys.sort(function(a, b) {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    });
    for (i = 0, len1 = sortedKeys.length; i < len1; i++) {
      prop = sortedKeys[i];
      ret = ret + options.fn({
        key: prop,
        value: context[prop],
        first: first
      });
      first = false;
    }
    return ret;
  });

  Handlebars.registerHelper("ifequals", function(context1, context2, options) {
    if (String(context1) === String(context2)) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

  Handlebars.registerHelper("ifbelongs", function(context1, context2, options) {
    gui.doLog("belongs", context1, context2);
    if ($.inArray(context1, context2) !== -1) {
      gui.doLog("belongs is true");
      gui.doLog(options.fn(this));
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

  Handlebars.registerHelper("set_counter", function(id, value, options) {
    options.data["_counter_" + id] = value;
  });

  Handlebars.registerHelper("get_counter", function(id, options) {
    options.data["_counter_" + id];
  });

  Handlebars.registerHelper("inc_counter", function(id, options) {
    options.data["_counter_" + id] += 1;
  });

  Handlebars.registerHelper("set_var", function(var_name, value) {
    Handlebars.registerHelper(var_name, function() {
      return value;
    });
  });

  Handlebars.registerHelper("unset_var", function(var_name) {
    Handlebars.registerHelper(var_name, null);
  });

  Handlebars.registerHelper("javascript", function(options) {
    return new Handlebars.SafeString("<script>" + options.fn(this) + "</script>");
  });

  Handlebars.registerHelper("truncatechars", function(len, value) {
    var val;
    val = value.toString();
    if (val.length > len) {
      return val.substring(0, len - 3) + "...";
    } else {
      return val;
    }
  });

  Handlebars.registerHelper("clean_whitespace", function(value) {
    var val;
    val = value.toString();
    return val.replace(RegExp(" ", "g"), "");
  });

  api.templates = {};

  api.templates.cache = new api.cache("tmpls");

  api.templates.get = function(name, success_fnc) {
    var $this;
    $this = this;
    success_fnc = success_fnc || function() {};
    api.doLog("Getting template " + name);
    if (name.indexOf("?") === -1) {
      if ($this.cache.get(name + "------")) {
        success_fnc($this.cache.get(name));
        return;
      } else if (document.getElementById("tmpl_" + name)) {
        $this.cache.put(name, "tmpl_" + name);
        success_fnc("tmpl_" + name);
        return;
      }
    }
    api.doLog("Invoking ajax for ", api.url_for(name, "template"));
    $.ajax({
      url: api.url_for(name, "template"),
      type: "GET",
      dataType: "text",
      success: function(data) {
        var cachedId;
        cachedId = "tmpl_" + name;
        $this.cache.put("_" + cachedId, $this.evaluate(data));
        $this.cache.put(name, cachedId);
        api.doLog("Success getting template \"" + name + "\".");
        success_fnc(cachedId);
      },
      fail: function(jqXHR, textStatus, errorThrown) {
        api.doLog(jqXHR);
        api.doLog(textStatus);
        apid.doLog(errorThrown);
      }
    });
  };

  api.templates.evaluate = function(str, context) {
    var cached, template;
    cached = null;
    if (/^[\w_-]*$/.test(str)) {
      cached = this.cache.get("_" + str);
      if (cached == null) {
        cached = api.templates.evaluate(document.getElementById(str).innerHTML);
        this.cache.put("_" + str, cached);
      }
    }
    template = cached || Handlebars.compile(str);
    if (context) {
      return template(context);
    } else {
      return template;
    }
  };

  return;

}).call(this);
