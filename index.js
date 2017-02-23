const rp = require('request-promise');

const invalidator = {
  init: (path = '/') => {

    rp({
      url:`https://www.net-a-porter.com/countryservice/1/netaporter.json`,
      json: true
    })
    .then((response) => {
      const amp = 'https://cdn.ampproject.org/update-ping/i/s/'
      const brand = 'net-a-porter.com';
      const locales = invalidator.generateLocales(response);

      locales.forEach((locale) => {
        const flushApi = `${amp}${brand}${locale}${path}`
        rp(flushApi)
        .then((response) => {
            console.log(`${flushApi}: flushed`);
        }, (err) => {
          console.log('err')
        })
      })

    }, (err) => {
      console.log('err')
    })

  },

  generateLocales: (countryService) => {
    let locales =[];
    const languages = Object.keys(countryService.languages);
    const countries = Object.keys(countryService.countries);
    languages.forEach((language) => {
      countries.forEach((country) => {
        locales.push(`/${country.toLowerCase()}/${language.toLowerCase()}`)
      })
    })
    return locales
  }

}

invalidator.init(process.env.path);

exports.module = invalidator;
