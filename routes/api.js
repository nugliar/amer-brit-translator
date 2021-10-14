'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {

  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      const locale = req.body.locale;
      const text = req.body.text;
      let innerHTML = '';
      let translation;

      if (!text || !text) {
        return res.json({ error: 'Required field(s) missing' });
      }
      try {
        translation = translator.translate(text, locale);
      } catch(e) {
        let text;
        if (e.message === 'Invalid locale') {
          text = 'Invalid value for locale field';
        } else {
          text = e.message;
        }
        return res.json({ error: text });
      }

      let formattedText = translation.text;
      translation.translatedWords.forEach(word => {
        formattedText = formattedText
          .replaceAll(word, `<span class='highlight'>${word}</span>`);
      });

      let formattedTextWords = formattedText.split(' ');
      let firstWord = formattedTextWords[0];

      if (firstWord && !firstWord.match(/^<span/g)) {
        firstWord = firstWord[0].toUpperCase() + firstWord.slice(1);
        formattedText = [firstWord]
          .concat(formattedTextWords.slice(1))
          .join(' ');
      }


      console.log({
        locale: locale,
        text: text,
        translation: translation.text,
        formatted: formattedText
      });

      res.json({
        text: translation.text,
        translation: formattedText
      });
    });
};
