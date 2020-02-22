import { IMatchEvent } from 'src/app/event/shared/match-event-preview/match-event-preview.component';

const RANDOM_ADCOUNT_NUMBER = 30;

export const MOCK_EVENT_HIGHLIGHTS: IMatchEvent[] = [
  {
    id: '5dec2f92914f9b1822f98446',
    adCount: Math.floor(Math.random() * Math.floor(RANDOM_ADCOUNT_NUMBER)),
    date: { from: '2020-01-16T18:00:00.000Z', to: '2020-01-16T23:59:00.000Z' },
    location: {
      name: '10117 Berlin',
      coords: { latitude: 52.533088, longitude: 13.397306 },
    },
    imageUrl: 'assets/img/culturematch-header-0.jpg',
    title: 'Name der Kulturveranstaltung',
    type: 'highlight',
  },
  {
    id: '5dec2f92914f9b1822f98446',
    adCount: Math.floor(Math.random() * Math.floor(RANDOM_ADCOUNT_NUMBER)),
    date: { from: '2020-01-16T18:00:00.000Z', to: '2020-01-16T23:59:00.000Z' },
    location: {
      name: '10117 Berlin',
      coords: { latitude: 52.533088, longitude: 13.397306 },
    },
    imageUrl: 'assets/img/culturematch-header-1.jpg',
    title: 'Name der Kulturveranstaltung',
    type: 'highlight',
  },
];

export const MOCK_EVENTS_BY_CATEGORY: IMatchEvent[] = [
  {
    id: '5dec2f92914f9b1822f98446',
    adCount: Math.floor(Math.random() * Math.floor(RANDOM_ADCOUNT_NUMBER)),
    date: { from: '2020-01-16T18:00:00.000Z', to: '2020-01-16T23:59:00.000Z' },
    title: 'Kunst und Kultur',
    type: 'category',
    category: 'category1',
  },
  {
    id: '5dec2f92914f9b1822f98446',
    adCount: Math.floor(Math.random() * Math.floor(RANDOM_ADCOUNT_NUMBER)),
    date: { from: '2020-01-16T18:00:00.000Z', to: '2020-01-16T23:59:00.000Z' },
    title: 'Andere Rubrik',
    type: 'category',
    category: 'category2',
  },
  {
    id: '5dec2f92914f9b1822f98446',
    adCount: Math.floor(Math.random() * Math.floor(RANDOM_ADCOUNT_NUMBER)),
    date: { from: '2020-01-16T18:00:00.000Z', to: '2020-01-16T23:59:00.000Z' },
    title: 'Rubrik 3',
    type: 'category',
    category: 'category3',
  },
  {
    id: '5dec2f92914f9b1822f98446',
    adCount: Math.floor(Math.random() * Math.floor(RANDOM_ADCOUNT_NUMBER)),
    date: { from: '2020-01-16T18:00:00.000Z', to: '2020-01-16T23:59:00.000Z' },
    title: 'Hier steht eine weitere Rubrik',
    type: 'category',
    category: 'category4',
  },
  {
    id: '5dec2f92914f9b1822f98446',
    adCount: Math.floor(Math.random() * Math.floor(RANDOM_ADCOUNT_NUMBER)),
    date: { from: '2020-01-16T18:00:00.000Z', to: '2020-01-16T23:59:00.000Z' },
    title: 'Noch eine Rubrik',
    type: 'category',
    category: 'category5',
  },
];

export const MOCK_THIS_WEEK_EVENTS: IMatchEvent[] = [
  {
    id: '5dec2f92914f9b1822f98446',
    adCount: Math.floor(Math.random() * Math.floor(RANDOM_ADCOUNT_NUMBER)),
    date: { from: '2020-01-16T18:00:00.000Z', to: '2020-01-16T23:59:00.000Z' },
    location: {
      name: '10117 Berlin',
      coords: { latitude: 52.533088, longitude: 13.397306 },
    },
    imageUrl: 'https://images.pexels.com/photos/69903/pexels-photo-69903.jpeg?w=500',
    title: 'Ich bin eine sehr lange headline',
    type: 'default',
    isFree: true,
  },
  {
    id: '5dec2f92914f9b1822f98446',
    adCount: Math.floor(Math.random() * Math.floor(RANDOM_ADCOUNT_NUMBER)),
    date: { from: '2020-01-18T18:00:00.000Z' },
    location: {
      name: '10115 Berlin',
      coords: { latitude: 52.533088, longitude: 13.397306 },
    },
    imageUrl: 'https://images.pexels.com/photos/2261165/pexels-photo-2261165.jpeg?w=500',
    title: 'kurze headline',
    type: 'default',
    isFree: false,
  },
  {
    id: '5dec2f92914f9b1822f98446',
    adCount: Math.floor(Math.random() * Math.floor(RANDOM_ADCOUNT_NUMBER)),
    date: { from: '2020-01-19T18:00:00.000Z', to: '2020-01-20T23:59:00.000Z' },
    location: {
      name: '10367 Berlin',
      coords: { latitude: 52.533088, longitude: 13.397306 },
    },
    imageUrl: 'https://images.pexels.com/photos/1056824/pexels-photo-1056824.jpeg?w=500',
    title: 'Noch eine headline',
    type: 'default',
    isFree: true,
  },
  {
    id: '5dec2f92914f9b1822f98446',
    adCount: Math.floor(Math.random() * Math.floor(RANDOM_ADCOUNT_NUMBER)),
    date: { from: '2020-01-26T18:00:00.000Z' },
    location: {
      name: 'Berlin',
      coords: { latitude: 52.533088, longitude: 13.397306 },
    },
    imageUrl: 'https://images.pexels.com/photos/110819/pexels-photo-110819.jpeg?w=500',
    title: 'headline',
    type: 'default',
    isFree: true,
  },
];
