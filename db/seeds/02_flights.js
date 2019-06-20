exports.seed = (knex, Promise) => {
  return knex('flights').del()
    .then(() => {
      return knex('flights').insert([{
          cabinClass: 'economy',
          adults: 1,
          children: 0,
          infants: 0,
          country: 'US',
          currency: 'USD',
          locale: 'en-US',
          originPlace: 'SFO-sky',
          destinationPlace: 'NYCA-sky',
          outboundDate: '2019-10-05',
          inboundDate: ''
        },
        {
          cabinClass: 'economy',
          adults: 1,
          children: 0,
          infants: 0,
          country: 'US',
          currency: 'USD',
          locale: 'en-US',
          originPlace: 'PHXA-sky',
          destinationPlace: 'NYCA-sky',
          outboundDate: '2019-09-10',
          inboundDate: '2019-09-21'
        },
        {
          cabinClass: 'economy',
          adults: 1,
          children: 0,
          infants: 0,
          country: 'US',
          currency: 'USD',
          locale: 'en-US',
          originPlace: 'PARI-sky',
          destinationPlace: 'LOND-sky',
          outboundDate: '2019-10-01',
          inboundDate: ''
        }
      ]);
    });
};