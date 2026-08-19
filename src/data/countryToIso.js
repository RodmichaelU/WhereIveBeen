// Maps this app's country name strings (as used in src/data/trips/*.json)
// to ISO 3166-1 alpha-2 codes, matching the path ids in countryPaths.json.
// A handful of small territories (Vatican, Sint Maarten, the Virgin
// Islands, Cayman Islands, Turks and Caicos) have no shape in that map —
// no simplified world map at this scale can usefully draw them — so they
// resolve to a code with no matching path and are simply skipped on the
// choropleth, though they still count toward the total.
export const COUNTRY_TO_ISO = {
  'Argentina': 'ar',
  'Bahamas': 'bs',
  'Belgium': 'be',
  'Belize': 'bz',
  'Brazil': 'br',
  'British Virgin Islands': 'vg',
  'Canada': 'ca',
  'Cayman Islands': 'ky',
  'France': 'fr',
  'Germany': 'de',
  'Greece': 'gr',
  'Honduras': 'hn',
  'Iceland': 'is',
  'Italy': 'it',
  'Jamaica': 'jm',
  'Japan': 'jp',
  'Malta': 'mt',
  'Mexico': 'mx',
  'Netherlands': 'nl',
  'Peru': 'pe',
  'Philippines': 'ph',
  'Sint Maarten': 'sx',
  'South Korea': 'kr',
  'Spain': 'es',
  'Switzerland': 'ch',
  'Turkey': 'tr',
  'Turks and Caicos Islands': 'tc',
  'United States': 'us',
  'United States Virgin Islands': 'vi',
  'Uruguay': 'uy',
  'Vatican': 'va',
}
