/** This is the main configuration module */
import { Providers } from '@onaio/gatekeeper';
import { Expression } from 'mapbox-gl';
import {
  DOMAIN_NAME,
  ENABLE_ONADATA_OAUTH,
  ENABLE_OPENSRP_OAUTH,
  ONADATA_ACCESS_TOKEN_URL,
  ONADATA_AUTHORIZATION_URL,
  ONADATA_CLIENT_ID,
  ONADATA_OAUTH_STATE,
  ONADATA_USER_URL,
  OPENSRP_ACCESS_TOKEN_URL,
  OPENSRP_AUTHORIZATION_URL,
  OPENSRP_CLIENT_ID,
  OPENSRP_OAUTH_STATE,
  OPENSRP_USER_URL,
} from './env';

/** Interfaces and Types */

/** Interface for a Focus Investigation Classification */
export interface Classification {
  code: string;
  name: string;
  description: string;
}

/** Interface that describes location items */
export interface LocationItem {
  identifier: string /** Should match the name of the column in data */;
  level: number /** The HDX-compliant level of the location in the hierarchy */;
  name: string /** The name of the location */;
}

/** Authentication Configs */
const providers: Providers = {};

if (ENABLE_OPENSRP_OAUTH) {
  providers.OpenSRP = {
    accessTokenUri: OPENSRP_ACCESS_TOKEN_URL,
    authorizationUri: OPENSRP_AUTHORIZATION_URL,
    clientId: OPENSRP_CLIENT_ID,
    redirectUri: `${DOMAIN_NAME}/oauth/callback/OpenSRP/`,
    scopes: ['read', 'write'],
    state: OPENSRP_OAUTH_STATE,
    userUri: OPENSRP_USER_URL,
  };
}

if (ENABLE_ONADATA_OAUTH) {
  providers.Ona = {
    accessTokenUri: ONADATA_ACCESS_TOKEN_URL,
    authorizationUri: ONADATA_AUTHORIZATION_URL,
    clientId: ONADATA_CLIENT_ID,
    redirectUri: `${DOMAIN_NAME}/oauth/callback/Ona/`,
    scopes: ['read', 'write'],
    state: ONADATA_OAUTH_STATE,
    userUri: ONADATA_USER_URL,
  };
}

export { providers };

/** Location configs */

/** Location item hierarchy
 * This is a list of locations.  The "level" field will be used to sort the
 * locations hierarchically, from lowest to highest.
 */
export const locationHierarchy: LocationItem[] = [
  {
    identifier: 'province',
    level: 1,
    name: 'Province',
  },
  {
    identifier: 'district',
    level: 2,
    name: 'District',
  },
  {
    identifier: 'canton',
    level: 3,
    name: 'Canton',
  },
  {
    identifier: 'village',
    level: 4,
    name: 'Village',
  },
];

/** Focus investigation configs */

/** Focus Investigation case classifications */
export const FIClassifications: Classification[] = [
  {
    code: 'A1',
    description: 'Indigenous case recorded within the last year.',
    name: 'Active',
  },
  {
    code: 'A2',
    description: 'No indigenous case during the last year, but withing the last 3 years.',
    name: 'Residual Non-Active',
  },
  {
    code: 'B1',
    description: 'Receptive area but no indigenous cases within the last 3 years.',
    name: 'Cleared Receptive',
  },
  {
    code: 'B2',
    description: 'Non-receptive area.',
    name: 'Cleared Non-Receptive',
  },
];

/** Indicators configs */

// thresholds
export const GREEN_THRESHOLD = 0.9;
export type GREEN_THRESHOLD = typeof GREEN_THRESHOLD;
export const YELLOW_THRESHOLD = 0.2;
export type YELLOW_THRESHOLD = typeof YELLOW_THRESHOLD;
export const ORANGE_THRESHOLD = 0.8;
export type ORANGE_THRESHOLD = typeof ORANGE_THRESHOLD;

// 1-3-7 thresholds
export const ONE = 0;
export const ZERO = 0;

/** Line layer configuration */
export const lineLayerConfig = {
  id: 'single-jurisdiction',
  paint: {
    'line-color': '#FFDC00',
    'line-opacity': 1,
    'line-width': 3,
  },
  source: {
    data: {
      data: {
        coordinates: [],
        type: 'Point',
      },
      type: 'stringified-geojson',
    },
    type: 'geojson',
  },
  type: 'line',
  visible: false,
};

/** Fill opacity configuration */
export const structureFillOpacity: Expression = [
  'match',
  ['get', 'task_business_status'],
  ['Not Visited'],
  0.7,
  ['Not Sprayed', 'Incomplete', 'In Progress'],
  0.7,
  ['Sprayed'],
  0.7,
  ['Not Sprayable'],
  1,
  0.75,
];

/** Fill layer configuration */
export const fillLayerConfig = {
  id: 'single-jurisdiction',
  paint: {
    'fill-color': '#FFDC00',
    'fill-opacity': structureFillOpacity,
    'fill-outline-color': '#FFDC00',
  },
  source: {
    data: {
      data: {
        coordinates: [],
        type: 'Point',
      },
      type: 'stringified-geojson',
    },
    type: 'geojson',
  },
  type: 'fill',
  visible: false,
};

/** Circle layer configuration */
export const circleLayerConfig = {
  categories: {
    color: '#ff0000',
  },
  id: 'single-jurisdiction',
  paint: {
    'circle-color': '#FFDC00',
    'circle-opacity': 0.7,
    'circle-radius': ['interpolate', ['linear'], ['zoom'], 13.98, 0, 17.79, 10, 18.8, 15],
    'circle-stroke-width': 2,
  },
  source: {
    data: {
      data: {
        coordinates: [],
        type: 'Point',
      },
      type: 'stringified-geojson',
    },
    type: 'geojson',
  },
  type: 'circle',
  visible: false,
};

export interface ADMN0 {
  ADMN0_PCODE: string;
  ADMN0_EN: string;
}
export interface ADMN1 extends ADMN0 {
  ADMN1_PCODE: string;
  ADMN1_EN: string;
}
export interface ADMN2 extends ADMN1 {
  ADMN2_PCODE: string;
  ADMN2_EN: string;
}
export interface ADMN3 extends ADMN2 {
  ADMN3_PCODE: string;
  ADMN3_EN: string;
}

export interface JurisdictionsByCountry extends ADMN0 {
  jurisdictionIds: string[];
  id?: string;
}

export const ZambiaAdmin0: JurisdictionsByCountry = {
  ADMN0_EN: 'Zambia',
  ADMN0_PCODE: 'ZM',
  jurisdictionIds: ['2939', '2940', '2942', '2942', '2953', '2954'],
};

export const ThailandAdmin0: JurisdictionsByCountry = {
  ADMN0_EN: 'Thailand',
  ADMN0_PCODE: 'TH',
  jurisdictionIds: [
    '61707fc2-c6ac-4112-a8d6-2a4861958396',
    '64301afa-e973-447b-a88c-4da20025c76f',
    '7f204867-fab0-4246-a97c-92e0b936cab6',
    '9c3c2db4-bddd-44c5-870a-a0eef539e4da',
  ],
};
export type ADMN0_PCODE = 'TH' | 'ZM';
export const CountriesAdmin0 = {
  TH: ThailandAdmin0,
  ZM: ZambiaAdmin0,
};
