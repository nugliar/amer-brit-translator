'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {

  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      const locale = req.body.locale;
      const text = req.body.text;
      let translationData;

      if (!text || !text) {
        return res.json({ error: 'Required field(s) missing' });
      }
      try {
        translationData = translator.translate(text, locale);
      } catch(e) {
        return res.json({ error:
          (e.message === 'Invalid locale') ?
          ('Invalid value for locale field') :
          (e.message)
        });
      }

      const translatedText = translationData.text;
      const translatedWords = translationData.words;

      if (Object.keys(translatedWords).length === 0) {
        return res.json({
          text: text,
          translation: 'Everything looks good to me!'
        })
      }

      let formattedText = text.slice();

      for (const word of Object.keys(translatedWords)) {
        console.log(word);
        formattedText = formattedText
          .replaceAll(word,
            `<span class='highlight'>${translatedWords[word]}</span>`);
      }

      res.json({
        text: translatedText,
        translation: formattedText
      });
    });
};
