const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

class Translator {

  invertDictionary(dictionaries) {
    if (dictionaries == null) {
      return null;
    }
    if (Array.isArray(dictionaries)) {
      let invertedDictionaries = [];
      for (const dictionary of dictionaries) {
        invertedDictionaries.push(invertDictionary(dictionary))
      }
      return invertedDictionaries;
    }
    if (typeof dictionaries == 'object') {
      const dictionary = dictionaries;
      const invertedDictionary = Object.keys(dictionary).reduce((obj, key) => {
        obj[dictionary[key]] = key;
        return obj;
      }, {});
      return invertedDictionary;
    }
    return {};
  }

  translate(wordString, locale) {

    const translateWords = (words, dictionaries) => {
      let wordsArr = words.slice();
      let match;

      for (let numWords = wordsArr.length; numWords > 0; numWords--) {
        for (let start = 0;;) {
          for (const dictionary of dictionaries) {
            const phrase = wordsArr.slice(start, start + numWords).join(' ');
            if ((match = dictionary[phrase]) !== undefined) {
              wordsArr = wordsArr
                .slice(0, start)
                .concat([match])
                .concat(wordsArr.slice(start + numWords))
              break ;
            }
          }

          if (match) {
            start += numWords;
          } else {
            start++;
          }

          if (start > wordsArr.length - numWords) {
            break;
          }
        }
      }

      return wordsArr;
    }

    let dictionaries = null;

    if (locale == 'american-to-british') {
      dictionaries = [
        americanToBritishSpelling,
        americanToBritishTitles,
        americanOnly
      ]
    } else if (locale == 'british-to-american') {
      dictionaries = [
        this.invertDictionary(americanToBritishSpelling),
        this.invertDictionary(americanToBritishTitles),
        britishOnly
      ]
    }

    if (!dictionaries) {
      throw new Error('Invalid locale');
    }

    const words = wordString.split(' ');
    const translatedWords = translateWords(words, dictionaries);

    return translatedWords.join(' ');
  }
}

module.exports = Translator;
