const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

const localeDictionaryData = {
  'american-to-british': {
    localeOnly: {
      dictionary: americanOnly,
      options : { inverted: false }
    },
    spelling: {
      dictionary: americanToBritishSpelling,
      options : { inverted: false }
    },
    titles: {
      dictionary: americanToBritishTitles,
      options : { inverted: false }
    }
  },
  'british-to-american': {
    localeOnly: {
      dictionary: britishOnly,
      options : { inverted: false }
    },
    spelling: {
      dictionary: americanToBritishSpelling,
      options : { inverted: true }
    },
    titles: {
      dictionary: americanToBritishTitles,
      options : { inverted: true }
    }
  }
}

Object.keys(localeDictionaryData)
  .map(localeKey => Object.keys(localeDictionaryData[localeKey])
    .forEach(dataKey => {
      const data = localeDictionaryData[localeKey][dataKey];
      const phrases = data.options.inverted ?
        Object.values(data.dictionary) :
        Object.keys(data.dictionary)

      data.maxWordSeqLength = Math.max(...phrases.map(phrase =>
        phrase.split(' ').length));
    })
  )

module.exports = localeDictionaryData;
