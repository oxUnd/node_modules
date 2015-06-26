/* global fis */

/**
 * fis.baidu.com
 */

module.exports = function (content, file, options) {
  var reg = /\b__id\s*\(\s*("(?:[^\\"\r\n\f]|\\[\s\S])*"|'(?:[^\\'\n\r\f]|\\[\s\S])*')\s*\)/g;
  return content.replace(reg, function (all, $1) {
    var info = fis.util.stringQuote($1);
    var result = fis.uri(info.rest, file.dirname);
    if (result.file) {
      if (options.withQuote) {
        return info.quote + result.file.getId() + info.quote;
      }
      return result.file.getId();
    }
    return all;
  });
};

module.exports.defaultOptions = {
  withQuote: true
};
