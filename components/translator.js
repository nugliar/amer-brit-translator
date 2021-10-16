const localeDictionaryData = require('./localeDictionaryData');

class Translator {

  invertDictionary(dictionary) {
    if (dictionary == null) {
      return null;
    }
    if (typeof dictionary == 'object') {
      return Object.keys(dictionary).reduce((obj, key) => {
        obj[dictionary[key]] = key;
        return obj;
      }, {});
    }
    return {};
  }

  translate(wordString, locale) {

    const capitalize = string => string[0].toUpperCase() + string.slice(1);
    const localeDictionaries = localeDictionaryData[locale];

    if (!localeDictionaries) {
      throw new Error('Invalid locale');
    }

    const regexData = {
      localeOnly: '(\\w+)',
      spelling: '(\\w+)',
      titles: '(\\bm[rsx]\\.?|\\bprof\\.?|\\bdr\\.?)',
      time: '(\\d?\\d:\\d\\d)',
      separator: '\\s*'
    }

    let translation = wordString.slice();
    let translatedWords = {};

    for (const key of Object.keys(localeDictionaries)) {

      const inverted = localeDictionaries[key].options.inverted;
      const maxWordSeqLength = localeDictionaries[key].maxWordSeqLength;
      let dictionary = localeDictionaries[key].dictionary;

      if (inverted) {
        dictionary = this.invertDictionary(dictionary);
      }

      for (let seqLength = maxWordSeqLength; seqLength > 0; seqLength--) {

        const pattern = Array.from({length: seqLength},
          () => regexData[key]).join(regexData.separator);
        const curRegex = new RegExp(pattern, 'gi');

        translation = translation.replaceAll(curRegex, (match, idx) => {
          let translated = dictionary[match.toLowerCase()];

          if (translated) {
            if (idx == 0 || key === 'titles') {
              translated = capitalize(translated);
            }
            translatedWords[match] = translated;
            return translated;
          } else {
            return match;
          }
        });
      }
    }

    return {
      text: translation,
      words: translatedWords
    };
  }
}

module.exports = Translator;
