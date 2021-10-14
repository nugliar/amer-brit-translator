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

  matchLocaleOnly(wordString, dictionary) {
    let phrase = wordString.slice();
    let specialInTheEnd;
    let match;

    if (phrase.match(/[.,;!?"'*=+)\]-]$/g)) {
      specialInTheEnd = phrase[phrase.length - 1].slice();
      phrase = phrase.slice(0, phrase.length - 1);
    }
    if ((match = dictionary[phrase]) !== undefined) {
      if (specialInTheEnd) {
        match = match + specialInTheEnd;
      }
    }
    return match;
  }

  matchSpelling(wordString, dictionary) {
    let phrase = wordString.slice();
    let specialInTheEnd;
    let match;

    if (phrase.match(/[.,;!?"'*=+)\]-]$/g)) {
      specialInTheEnd = phrase[phrase.length - 1].slice();
      phrase = phrase.slice(0, phrase.length - 1);
    }
    if ((match = dictionary[phrase]) !== undefined) {
      if (specialInTheEnd) {
        match = match + specialInTheEnd;
      }
    }
    return match;
  }

  matchTitle(wordString, dictionary) {
    let match = dictionary[wordString];

    if (match) {
      return match;
    } else if (wordString.match(/[.]$/g)) {
      let word = wordString.slice(0, wordString.length - 1);
      if ((match = dictionary[word]) != undefined) {
        return match + '.';
      }
    };
    return match;
  }

  translate(wordString, locale) {

    let words = wordString.split(' ');
    let dictionaryData = localeDictionaryData[locale];

    if (!dictionaryData) {
      throw new Error('Invalid locale');
    }

    const matchFunc = {
      localeOnly: this.matchLocaleOnly,
      spelling: this.matchSpelling,
      titles: this.matchTitle
    };

    let translatedWords = [];

    for (let numWords = words.length; numWords > 0; numWords--) {
      let match = undefined;
      let start = 0;

      while (true) {
        for (const type in dictionaryData) {

          const phrase = words
            .slice(start, start + numWords)
            .join(' ')
            .toLowerCase();

          let findMatch = matchFunc[type];
          let dictionary = dictionaryData[type].dictionary;
          let options = dictionaryData[type].options;

          if (options.inverted) {
            dictionary = this.invertDictionary(dictionary);
          }
          if ((match = findMatch(phrase, dictionary)) !== undefined) {
            translatedWords.push(match);
            words = words
              .slice(0, start)
              .concat([match])
              .concat(words.slice(start + numWords))
            break ;
          }
        }
        start = (match) ? (start + numWords) : (++start);
        if (start > words.length - numWords) {
          break;
        }
      }
    };

    return {
      text: words.join(' '),
      translatedWords: translatedWords
    };
  }
}

module.exports = Translator;
