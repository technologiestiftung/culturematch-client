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

type Date = {
  date: {
    from: string,
    to: string,
  },
  venue: string,
  venueId: string,
};

type Social = {
  website: string,
  instagram: string,
  facebook: string,
  twitter: string,
  youtube: string,
};

export interface LocationSource {
  id: string,
  accessibility: Accessibility,
  general: {
    name: string,
    description: string,
  },
  institution: [
    {
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
    }
  ],
  media: {
    embeds: { id: string, data: string }[],
    images: { id: string, url: string }[],
  },
  dates: Date[],
  social: Social,
  tags: any[],
  distance: string,
  location: any,
  eventCount: number,
  address: any,
  isSkeleton?: boolean,
  openingHours: any,
}

export class LocationModel {
  public id: string;
  public accessibility: Accessibility;
  public title: string;
  public description: string;
  public distance: string;
  public location: any;
  public address: any;
  public embeds: { id: string, data: string }[];
  public images: { id: string, url: string }[];
  public dates: Date[];
  public social: Social;
  public isSkeleton: boolean;
  public tags: any[];
  public isSameDay: boolean;
  public eventCount: number;
  public openingHours: any;

  constructor (source: LocationSource) {
    this.id = source.id;
    this.title = source.general.name;
    this.description = source.general.description;
    this.images = source.media.images;
    this.embeds = source.media.embeds || [];
    this.dates = source.dates || [];
    this.social = source.social;
    this.isSkeleton = source.isSkeleton;
    this.tags = source.tags || [];
    this.openingHours = source.openingHours;

    this.eventCount = source.eventCount;

    this.accessibility = source.accessibility;

    this.location = source.location;
    this.address = source.address;

    // TODO: get correct distance
    this.distance = '4,37';
  }
}

export const RESTAURANT_DUMMY_DATA: LocationModel[] = [];
