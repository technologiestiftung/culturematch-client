import * as moment from 'moment';

type Accessibility = {
  wheelchair: {
    accessible: string,
    toilets: boolean,
    description: string,
  },
  blind: {
    otherLanguages: string[],
    germanLanguage: boolean,
    braille: boolean,
    audioguide: boolean,
  },
  deaf: {
    otherLanguages: string[],
    germanLanguage: boolean,
    hearingAid: boolean,
    videoguide: boolean,
  },
};

export type EventDate = {
  type: string[],
  date: {
    from: string,
    to: string,
  },
  venue: any,
  accessibility: Accessibility,
};

type Social = {
  website: string,
  instagram: string,
  facebook: string,
  twitter: string,
  youtube: string,
};

type Festival = {
  general: {
    title: string,
  },
};

type Ticket = {
  name: string,
  value: string,
  link: string,
};

export interface EventSource {
  id: string,
  general: {
    title: string,
    subtitle: string,
    description: string,
    isPermanent?: boolean,
    isTimeLimited?: boolean,
  },
  institution: {
    address: {
      city: string,
      email: string,
      number: string,
      street: string,
      telephone: string,
      zipcode: string,
    },
    general: {
      name: string,
      description: string,
    },
  }[],
  media: {
    embeds: { id: string, data: string }[],
    images: {
      id: string,
      url: string,
      source: string,
      description: string }[],
  },
  dates: EventDate[],
  social: Social,
  accessibility: Accessibility,
  tags: any[],
  tickets: {
    name: string,
    value: string,
    link: string,
  }[],
  price: any,
  isSkeleton?: boolean,
  festival: Festival,
}

export class EventModel {
  public id: string;
  public title: string;
  public subtitle: string;
  public description: string;
  public venue: any;
  public embeds: { id: string, data: string }[];
  public images: { id: string, url: string, source: string, description: string }[];
  public dates: EventDate[];
  public social: Social;
  public accessibility: Accessibility;
  public isSkeleton: boolean;
  public tags: any[];
  public tickets: Ticket[];
  public price: any;
  public isPermanent: boolean;
  public isTimeLimited: boolean;
  public isSameDay: boolean;
  public isSameHour: boolean;
  public festival: Festival;
  public adCount = 0;

  constructor (source: EventSource) {
    this.id = source.id;
    this.title = source.general.title;
    this.subtitle = source.general.subtitle;
    this.description = source.general.description;
    this.images = source.media.images || [];
    this.embeds = source.media.embeds || [];
    this.dates = source.dates || [];
    this.social = source.social;
    this.isSkeleton = source.isSkeleton;
    this.tags = source.tags || [];
    this.tickets = source.price.tickets || [];
    this.price = source.price;
    this.festival = source.festival;
    this.isPermanent = source.general.isPermanent;
    this.isTimeLimited = source.general.isTimeLimited;

    if (!this.dates.length) { return; }

    this.venue = this.dates[0].venue || null;
    this.isSameDay = moment(this.dates[0].date.from).isSame(moment(this.dates[0].date.to), 'day');
    this.isSameHour = moment(this.dates[0].date.from).isSame(moment(this.dates[0].date.to), 'hour');
    this.accessibility = this.dates[0].accessibility;
  }
}

export const EVENT_DUMMY_DATA: EventModel[] = [];
