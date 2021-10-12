'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {

  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      const locale = req.body.locale;
      const text = req.body.text;

      if (!locale || !text) {
        return res.json({ error: 'fuck you' });
      }

      const translation = translator.translate(text, locale);

      res.json({ translation: translation });
    });
};
