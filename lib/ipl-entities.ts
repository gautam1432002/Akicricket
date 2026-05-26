import { getFallbackResponse } from './ipl-knowledge';

// ─────────────────────────────────────────────────────────────────────────────
// IPL Akinator Engine — Entity Database + Scoring + Smart Question Selection
// ─────────────────────────────────────────────────────────────────────────────

// ── Attribute Schema ─────────────────────────────────────────────────────────
export interface EntityAttr {
  // Nationality
  fromIndia: boolean;
  fromAustralia: boolean;
  fromWestIndies: boolean;
  fromEngland: boolean;
  fromSouthAfrica: boolean;
  fromNewZealand: boolean;
  fromSriLanka: boolean;
  // Role
  isBatsman: boolean;
  isBowler: boolean;
  isAllRounder: boolean;
  isWicketKeeper: boolean;
  isOpener: boolean;
  isMiddleOrder: boolean;
  isFinisher: boolean;
  isSpinBowler: boolean;
  isPaceBowler: boolean;
  isLeftHanded: boolean;
  isLeftArm: boolean;
  // Teams (8 major franchises)
  playedMI: boolean;
  playedCSK: boolean;
  playedRCB: boolean;
  playedKKR: boolean;
  playedDelhi: boolean;
  playedRajasthan: boolean;
  playedSunrisers: boolean;
  playedPunjab: boolean;
  // Achievements
  wonIPLTitle: boolean;
  wonOrangeCap: boolean;
  wonPurpleCap: boolean;
  over4000Runs: boolean;
  over150Wickets: boolean;
  over200Sixes: boolean;
  scoredCentury: boolean;
  tookHatTrick: boolean;
  // Career
  playedIn2008: boolean;
  activeIn2024: boolean;
  captainedIPLTeam: boolean;
  captainedNationalTeam: boolean;
  playedTests: boolean;
  knownBigHitting: boolean;
  knownFielding: boolean;
  globallyFamous: boolean;

  // Team Specifics
  isDissolved: boolean;
  isAddedAfter2008: boolean;
  isSouthIndia: boolean;
  isMumbaiMaharashtra: boolean;
  isDelhiNCR: boolean;
  isWestBengal: boolean;
  isRajasthan: boolean;
  isTamilNadu: boolean;
  isHyderabad: boolean;
  isPunjab: boolean;
  isGujarat: boolean;
  isLucknow: boolean;
  wonMoreThanTwoTitles: boolean;
  wonMoreThanFourTitles: boolean;
  reachedFinal: boolean;
  wonCLT20: boolean;
  mostSuccessful: boolean;
  hadDhoni: boolean;
  hadRohit: boolean;
  hadKohli: boolean;
  hadGanguly: boolean;
  hadForeignCaptain: boolean;
  hadWarne: boolean;
  hadWarner: boolean;
  hadSachin: boolean;
  hadABdeVilliers: boolean;
  hadRaina: boolean;
  hadHardik: boolean;
  hadGayle: boolean;
  homeWankhede: boolean;
  homeChinnaswamy: boolean;
  homeEdenGardens: boolean;
  homeChepauk: boolean;
  homeNarendraModi: boolean;
  homeArunJaitley: boolean;
  homeSawaiMansingh: boolean;
  jerseyBlue: boolean;
  jerseyYellowGold: boolean;
  jerseyRed: boolean;
  hasLionLogo: boolean;
  hasKnightTheme: boolean;
  hasRoyalTheme: boolean;
  hasSunTheme: boolean;
  wasSuspended: boolean;
}

export interface IPLEntity {
  name: string;
  type: 'player' | 'team';
  attr: EntityAttr;
}

// ── Default (all false) — every player/team starts from here ─────────────────
const D: EntityAttr = {
  fromIndia: false, fromAustralia: false, fromWestIndies: false,
  fromEngland: false, fromSouthAfrica: false, fromNewZealand: false, fromSriLanka: false,
  isBatsman: false, isBowler: false, isAllRounder: false, isWicketKeeper: false,
  isOpener: false, isMiddleOrder: false, isFinisher: false,
  isSpinBowler: false, isPaceBowler: false, isLeftHanded: false, isLeftArm: false,
  playedMI: false, playedCSK: false, playedRCB: false, playedKKR: false,
  playedDelhi: false, playedRajasthan: false, playedSunrisers: false, playedPunjab: false,
  wonIPLTitle: false, wonOrangeCap: false, wonPurpleCap: false,
  over4000Runs: false, over150Wickets: false, over200Sixes: false,
  scoredCentury: false, tookHatTrick: false,
  playedIn2008: false, activeIn2024: false,
  captainedIPLTeam: false, captainedNationalTeam: false,
  playedTests: false, knownBigHitting: false, knownFielding: false, globallyFamous: false,

  isDissolved: false, isAddedAfter2008: false, isSouthIndia: false, isMumbaiMaharashtra: false,
  isDelhiNCR: false, isWestBengal: false, isRajasthan: false, isTamilNadu: false,
  isHyderabad: false, isPunjab: false, isGujarat: false, isLucknow: false,
  wonMoreThanTwoTitles: false, wonMoreThanFourTitles: false, reachedFinal: false,
  wonCLT20: false, mostSuccessful: false, hadDhoni: false, hadRohit: false,
  hadKohli: false, hadGanguly: false, hadForeignCaptain: false, hadWarne: false,
  hadWarner: false, hadSachin: false, hadABdeVilliers: false, hadRaina: false,
  hadHardik: false, hadGayle: false, homeWankhede: false, homeChinnaswamy: false,
  homeEdenGardens: false, homeChepauk: false, homeNarendraModi: false, homeArunJaitley: false,
  homeSawaiMansingh: false, jerseyBlue: false, jerseyYellowGold: false, jerseyRed: false,
  hasLionLogo: false, hasKnightTheme: false, hasRoyalTheme: false, hasSunTheme: false,
  wasSuspended: false,
};

const p = (name: string, overrides: Partial<EntityAttr>): IPLEntity => ({
  name, type: 'player', attr: { ...D, ...overrides },
});

const t = (name: string, overrides: Partial<EntityAttr>): IPLEntity => ({
  name, type: 'team', attr: { ...D, ...overrides },
});

// ── IPL Player Database ───────────────────────────────────────────────────────
export const IPL_PLAYERS: IPLEntity[] = [
  p('MS Dhoni', {
    fromIndia: true, isWicketKeeper: true, isMiddleOrder: true, isFinisher: true,
    playedCSK: true, wonIPLTitle: true, over4000Runs: true, knownFielding: true,
    playedIn2008: true, activeIn2024: true, captainedIPLTeam: true,
    captainedNationalTeam: true, playedTests: true, globallyFamous: true,
  }),
  p('Virat Kohli', {
    fromIndia: true, isBatsman: true, isOpener: true,
    playedRCB: true, wonOrangeCap: true, over4000Runs: true, scoredCentury: true,
    playedIn2008: true, activeIn2024: true, captainedIPLTeam: true,
    captainedNationalTeam: true, playedTests: true, globallyFamous: true,
  }),
  p('Rohit Sharma', {
    fromIndia: true, isBatsman: true, isOpener: true,
    playedMI: true, playedSunrisers: true,
    wonIPLTitle: true, over4000Runs: true, scoredCentury: true, over200Sixes: true,
    playedIn2008: true, activeIn2024: true, captainedIPLTeam: true,
    captainedNationalTeam: true, playedTests: true, globallyFamous: true,
  }),
  p('AB de Villiers', {
    fromSouthAfrica: true, isBatsman: true, isMiddleOrder: true, isWicketKeeper: true,
    playedRCB: true, over4000Runs: true, scoredCentury: true, knownBigHitting: true,
    playedIn2008: true, playedTests: true, globallyFamous: true,
  }),
  p('Chris Gayle', {
    fromWestIndies: true, isBatsman: true, isOpener: true, isLeftHanded: true,
    playedRCB: true, playedPunjab: true,
    scoredCentury: true, over4000Runs: true, over200Sixes: true, knownBigHitting: true,
    playedTests: true, globallyFamous: true,
  }),
  p('Sachin Tendulkar', {
    fromIndia: true, isBatsman: true, isOpener: true,
    playedMI: true, wonIPLTitle: true, over4000Runs: true,
    playedIn2008: true, captainedIPLTeam: true, playedTests: true, globallyFamous: true,
  }),
  p('Shane Warne', {
    fromAustralia: true, isBowler: true, isSpinBowler: true,
    playedRajasthan: true, wonIPLTitle: true,
    playedIn2008: true, captainedIPLTeam: true, playedTests: true, globallyFamous: true,
  }),
  p('Lasith Malinga', {
    fromSriLanka: true, isBowler: true, isPaceBowler: true,
    playedMI: true, wonIPLTitle: true, over150Wickets: true, tookHatTrick: true,
    playedIn2008: true, playedTests: true, globallyFamous: true,
  }),
  p('David Warner', {
    fromAustralia: true, isBatsman: true, isOpener: true, isLeftHanded: true,
    playedSunrisers: true, playedDelhi: true,
    wonIPLTitle: true, wonOrangeCap: true, over4000Runs: true,
    captainedIPLTeam: true, playedTests: true, globallyFamous: true, activeIn2024: true,
  }),
  p('Jasprit Bumrah', {
    fromIndia: true, isBowler: true, isPaceBowler: true,
    playedMI: true, wonIPLTitle: true,
    playedTests: true, globallyFamous: true, activeIn2024: true,
  }),
  p('Hardik Pandya', {
    fromIndia: true, isAllRounder: true, isPaceBowler: true, knownBigHitting: true,
    playedMI: true, wonIPLTitle: true, captainedIPLTeam: true,
    playedTests: true, globallyFamous: true, activeIn2024: true,
  }),
  p('KL Rahul', {
    fromIndia: true, isBatsman: true, isOpener: true, isWicketKeeper: true,
    playedRCB: true, playedPunjab: true,
    wonOrangeCap: true, over4000Runs: true, captainedIPLTeam: true,
    playedTests: true, activeIn2024: true,
  }),
  p('Suresh Raina', {
    fromIndia: true, isBatsman: true, isMiddleOrder: true, knownFielding: true,
    playedCSK: true, wonIPLTitle: true, over4000Runs: true,
    playedIn2008: true, playedTests: true,
  }),
  p('Gautam Gambhir', {
    fromIndia: true, isBatsman: true, isOpener: true, isLeftHanded: true,
    playedKKR: true, playedDelhi: true,
    wonIPLTitle: true, over4000Runs: true, captainedIPLTeam: true,
    playedIn2008: true, playedTests: true,
  }),
  p('Andre Russell', {
    fromWestIndies: true, isAllRounder: true, isPaceBowler: true, knownBigHitting: true,
    playedKKR: true, wonIPLTitle: true, over200Sixes: true,
    playedTests: true, activeIn2024: true,
  }),
  p('Kieron Pollard', {
    fromWestIndies: true, isAllRounder: true, isPaceBowler: true, knownBigHitting: true,
    playedMI: true, wonIPLTitle: true, over200Sixes: true,
  }),
  p('Yuvraj Singh', {
    fromIndia: true, isBatsman: true, isAllRounder: true, isLeftHanded: true,
    playedPunjab: true, playedDelhi: true, wonIPLTitle: true, scoredCentury: true,
    knownBigHitting: true, captainedIPLTeam: true,
    playedIn2008: true, playedTests: true, globallyFamous: true,
  }),
  p('Harbhajan Singh', {
    fromIndia: true, isBowler: true, isSpinBowler: true,
    playedMI: true, playedCSK: true, playedPunjab: true,
    wonIPLTitle: true, over150Wickets: true, captainedIPLTeam: true,
    playedIn2008: true, playedTests: true,
  }),
  p('Ravindra Jadeja', {
    fromIndia: true, isAllRounder: true, isSpinBowler: true, isLeftArm: true,
    isLeftHanded: true, knownFielding: true,
    playedCSK: true, playedRajasthan: true, wonIPLTitle: true, captainedIPLTeam: true,
    playedTests: true, globallyFamous: true, activeIn2024: true,
  }),
  p('Ravichandran Ashwin', {
    fromIndia: true, isBowler: true, isSpinBowler: true, isAllRounder: true,
    playedCSK: true, playedPunjab: true, playedDelhi: true, playedRajasthan: true,
    wonIPLTitle: true, over150Wickets: true, captainedIPLTeam: true,
    playedIn2008: true, playedTests: true,
  }),
  p('Jos Buttler', {
    fromEngland: true, isBatsman: true, isOpener: true, isWicketKeeper: true,
    playedRajasthan: true, wonIPLTitle: true, wonOrangeCap: true, scoredCentury: true,
    playedTests: true, globallyFamous: true, activeIn2024: true,
  }),
  p('Pat Cummins', {
    fromAustralia: true, isBowler: true, isPaceBowler: true,
    playedKKR: true, wonIPLTitle: true, wonPurpleCap: true, captainedIPLTeam: true,
    playedTests: true, globallyFamous: true, activeIn2024: true,
  }),
  p('Shikhar Dhawan', {
    fromIndia: true, isBatsman: true, isOpener: true, isLeftHanded: true,
    playedDelhi: true, playedSunrisers: true, playedPunjab: true,
    wonOrangeCap: true, over4000Runs: true, captainedIPLTeam: true,
    playedIn2008: true, playedTests: true,
  }),
  p('Dinesh Karthik', {
    fromIndia: true, isWicketKeeper: true, isFinisher: true, isMiddleOrder: true,
    playedKKR: true, playedRCB: true, playedDelhi: true, playedPunjab: true, playedSunrisers: true,
    captainedIPLTeam: true, playedIn2008: true, playedTests: true,
  }),
  p('Rishabh Pant', {
    fromIndia: true, isBatsman: true, isWicketKeeper: true, isLeftHanded: true,
    playedDelhi: true, captainedIPLTeam: true, knownBigHitting: true,
    playedTests: true, globallyFamous: true, activeIn2024: true,
  }),
  p('Yuzvendra Chahal', {
    fromIndia: true, isBowler: true, isSpinBowler: true,
    playedRCB: true, playedRajasthan: true, wonPurpleCap: true, over150Wickets: true,
    activeIn2024: true,
  }),
  p('Kagiso Rabada', {
    fromSouthAfrica: true, isBowler: true, isPaceBowler: true,
    playedDelhi: true, playedPunjab: true, wonPurpleCap: true,
    playedTests: true, activeIn2024: true,
  }),
  p('Ben Stokes', {
    fromEngland: true, isAllRounder: true, isPaceBowler: true, isLeftHanded: true,
    playedRajasthan: true, playedCSK: true, wonIPLTitle: true,
    playedTests: true, globallyFamous: true,
  }),
  p('Faf du Plessis', {
    fromSouthAfrica: true, isBatsman: true, isOpener: true,
    playedCSK: true, playedRCB: true, wonIPLTitle: true, wonOrangeCap: true,
    over4000Runs: true, captainedIPLTeam: true, playedTests: true, activeIn2024: true,
  }),
  p('Shreyas Iyer', {
    fromIndia: true, isBatsman: true, isMiddleOrder: true,
    playedDelhi: true, playedKKR: true, wonIPLTitle: true, captainedIPLTeam: true,
    playedTests: true, activeIn2024: true,
  }),
  p('Shubman Gill', {
    fromIndia: true, isBatsman: true, isOpener: true,
    playedKKR: true, wonIPLTitle: true, wonOrangeCap: true, scoredCentury: true,
    captainedIPLTeam: true, playedTests: true, activeIn2024: true,
  }),
  p('Suryakumar Yadav', {
    fromIndia: true, isBatsman: true, isMiddleOrder: true, knownBigHitting: true,
    playedMI: true, wonIPLTitle: true, over4000Runs: true,
    playedTests: true, globallyFamous: true, activeIn2024: true,
  }),
  p('Sanju Samson', {
    fromIndia: true, isBatsman: true, isWicketKeeper: true, isMiddleOrder: true,
    playedRajasthan: true, wonIPLTitle: true, scoredCentury: true, captainedIPLTeam: true,
    activeIn2024: true,
  }),
  p('Ishan Kishan', {
    fromIndia: true, isBatsman: true, isWicketKeeper: true, isOpener: true, isLeftHanded: true,
    playedMI: true, wonIPLTitle: true, scoredCentury: true,
  }),
  p('Ruturaj Gaikwad', {
    fromIndia: true, isBatsman: true, isOpener: true,
    playedCSK: true, wonIPLTitle: true, wonOrangeCap: true, scoredCentury: true,
    captainedIPLTeam: true, activeIn2024: true,
  }),
  p('Mitchell Starc', {
    fromAustralia: true, isBowler: true, isPaceBowler: true, isLeftArm: true,
    playedKKR: true, wonIPLTitle: true, playedTests: true, globallyFamous: true, activeIn2024: true,
  }),
  p('Adam Gilchrist', {
    fromAustralia: true, isBatsman: true, isWicketKeeper: true, isOpener: true, isLeftHanded: true,
    playedPunjab: true, playedSunrisers: true, wonIPLTitle: true, captainedIPLTeam: true,
    playedIn2008: true, playedTests: true, globallyFamous: true,
  }),
  p('Brendon McCullum', {
    fromNewZealand: true, isBatsman: true, isOpener: true, isWicketKeeper: true,
    playedKKR: true, wonIPLTitle: true, captainedIPLTeam: true, knownBigHitting: true,
    playedIn2008: true, playedTests: true,
  }),
  p('Virender Sehwag', {
    fromIndia: true, isBatsman: true, isOpener: true, isSpinBowler: true,
    playedDelhi: true, playedPunjab: true, captainedIPLTeam: true,
    over4000Runs: true, scoredCentury: true, knownBigHitting: true,
    playedIn2008: true, playedTests: true, globallyFamous: true,
  }),
  p('Anil Kumble', {
    fromIndia: true, isBowler: true, isSpinBowler: true,
    playedRCB: true, playedDelhi: true, over150Wickets: true, captainedIPLTeam: true,
    playedIn2008: true, captainedNationalTeam: true, playedTests: true, globallyFamous: true,
  }),
];

// ── IPL Team Database ─────────────────────────────────────────────────────────
export const IPL_TEAMS: IPLEntity[] = [
  t('Chennai Super Kings', {
    activeIn2024: true, playedIn2008: true, isSouthIndia: true, isTamilNadu: true,
    wonIPLTitle: true, wonMoreThanTwoTitles: true, wonMoreThanFourTitles: true, reachedFinal: true,
    wonCLT20: true, mostSuccessful: true, hadDhoni: true, hadRaina: true,
    homeChepauk: true, jerseyYellowGold: true, hasLionLogo: true, wasSuspended: true
  }),
  t('Mumbai Indians', {
    activeIn2024: true, playedIn2008: true, isMumbaiMaharashtra: true,
    wonIPLTitle: true, wonMoreThanTwoTitles: true, wonMoreThanFourTitles: true, reachedFinal: true,
    wonCLT20: true, mostSuccessful: true, hadRohit: true, hadSachin: true, hadHardik: true,
    homeWankhede: true, jerseyBlue: true, hasLionLogo: false
  }),
  t('Royal Challengers Bangalore', {
    activeIn2024: true, playedIn2008: true, isSouthIndia: true,
    reachedFinal: true, hadKohli: true, hadABdeVilliers: true, hadGayle: true,
    homeChinnaswamy: true, jerseyRed: true, hasLionLogo: true
  }),
  t('Kolkata Knight Riders', {
    activeIn2024: true, playedIn2008: true, isWestBengal: true,
    wonIPLTitle: true, wonMoreThanTwoTitles: false, reachedFinal: true,
    hadGanguly: true, hadForeignCaptain: true,
    homeEdenGardens: true, hasKnightTheme: true
  }),
  t('Rajasthan Royals', {
    activeIn2024: true, playedIn2008: true, isRajasthan: true,
    wonIPLTitle: true, reachedFinal: true, hadForeignCaptain: true, hadWarne: true,
    homeSawaiMansingh: true, jerseyBlue: true, hasRoyalTheme: true, wasSuspended: true
  }),
  t('Delhi Capitals', {
    activeIn2024: true, playedIn2008: true, isDelhiNCR: true,
    reachedFinal: true, hadGanguly: true,
    homeArunJaitley: true, jerseyBlue: true
  }),
  t('Sunrisers Hyderabad', {
    activeIn2024: true, isAddedAfter2008: true, isHyderabad: true,
    wonIPLTitle: true, reachedFinal: true, hadForeignCaptain: true, hadWarner: true,
    jerseyRed: false, hasSunTheme: true
  }),
  t('Punjab Kings', {
    activeIn2024: true, playedIn2008: true, isPunjab: true,
    reachedFinal: true, hadGayle: true,
    jerseyRed: true, hasLionLogo: true
  }),
  t('Gujarat Titans', {
    activeIn2024: true, isAddedAfter2008: true, isGujarat: true,
    wonIPLTitle: true, reachedFinal: true, hadHardik: true,
    homeNarendraModi: true, jerseyBlue: true
  }),
  t('Lucknow Super Giants', {
    activeIn2024: true, isAddedAfter2008: true, isLucknow: true,
    jerseyBlue: true
  }),
  t('Deccan Chargers', {
    isDissolved: true, playedIn2008: true, isHyderabad: true,
    wonIPLTitle: true, reachedFinal: true, hadForeignCaptain: true,
    jerseyBlue: true
  }),
  t('Pune Warriors India', {
    isDissolved: true, isAddedAfter2008: true,
    hadDhoni: false, jerseyBlue: true
  }),
  t('Rising Pune Supergiant', {
    isDissolved: true, isAddedAfter2008: true, isMumbaiMaharashtra: true,
    reachedFinal: true, hadDhoni: true, hadForeignCaptain: true,
    jerseyBlue: true
  })
];

// ── Smart Question Bank — each entry: [question, attribute key, "yes" meaning] ─
export type QEntry = [string, keyof EntityAttr, boolean];

export const SMART_PLAYER_QUESTIONS: QEntry[] = [
  // Nationality (most discriminating — asked first)
  ['Is this player from India?', 'fromIndia', true],
  ['Is this player from Australia?', 'fromAustralia', true],
  ['Is this player from the West Indies?', 'fromWestIndies', true],
  ['Is this player from England?', 'fromEngland', true],
  ['Is this player from South Africa?', 'fromSouthAfrica', true],
  ['Is this player from New Zealand?', 'fromNewZealand', true],
  ['Is this player from Sri Lanka?', 'fromSriLanka', true],
  // Primary Role
  ['Is this player primarily a batsman?', 'isBatsman', true],
  ['Is this player primarily a bowler?', 'isBowler', true],
  ['Is this player an all-rounder?', 'isAllRounder', true],
  ['Is this player a wicket-keeper?', 'isWicketKeeper', true],
  // Batting position
  ['Does this player typically open the batting?', 'isOpener', true],
  ['Does this player bat in the middle order?', 'isMiddleOrder', true],
  ['Is this player known as a match-finishing slogger or death-over specialist?', 'isFinisher', true],
  // Bowling type
  ['Is this player a spin bowler?', 'isSpinBowler', true],
  ['Is this player a pace / fast bowler?', 'isPaceBowler', true],
  ['Is this player left-handed as a batsman?', 'isLeftHanded', true],
  ['Does this player bowl left-arm?', 'isLeftArm', true],
  // Franchises
  ['Has this player ever played for Mumbai Indians?', 'playedMI', true],
  ['Has this player ever played for Chennai Super Kings?', 'playedCSK', true],
  ['Has this player ever played for Royal Challengers Bangalore?', 'playedRCB', true],
  ['Has this player ever played for Kolkata Knight Riders?', 'playedKKR', true],
  ['Has this player ever played for Delhi Capitals or Daredevils?', 'playedDelhi', true],
  ['Has this player ever played for Rajasthan Royals?', 'playedRajasthan', true],
  ['Has this player ever played for Sunrisers Hyderabad or Deccan Chargers?', 'playedSunrisers', true],
  ['Has this player ever played for Punjab Kings or KXIP?', 'playedPunjab', true],
  // Achievements
  ['Has this player won at least one IPL title?', 'wonIPLTitle', true],
  ['Did this player win the Orange Cap (most runs in a season)?', 'wonOrangeCap', true],
  ['Did this player win the Purple Cap (most wickets in a season)?', 'wonPurpleCap', true],
  ['Has this player scored over 4,000 career runs in IPL?', 'over4000Runs', true],
  ['Has this player taken over 150 career wickets in IPL?', 'over150Wickets', true],
  ['Has this player smashed over 200 sixes in IPL?', 'over200Sixes', true],
  ['Has this player scored an IPL century (100+ in a single innings)?', 'scoredCentury', true],
  ['Has this player ever taken a hat-trick in IPL?', 'tookHatTrick', true],
  // Career
  ['Did this player play in the inaugural IPL season in 2008?', 'playedIn2008', true],
  ['Is this player still actively playing in IPL as of 2024?', 'activeIn2024', true],
  ['Has this player ever captained an IPL team?', 'captainedIPLTeam', true],
  ['Did this player captain their national cricket team?', 'captainedNationalTeam', true],
  ['Has this player played Test cricket?', 'playedTests', true],
  // Style / Fame
  ['Is this player known for exceptional fielding or athleticism?', 'knownFielding', true],
  ['Is this player renowned globally beyond just cricket fans?', 'globallyFamous', true],
];

export const SMART_TEAM_QUESTIONS: QEntry[] = [
  ["Is this team still active in the current IPL?", "activeIn2024", true],
  ["Did this team get dissolved, replaced or rebranded?", "isDissolved", true],
  ["Is this a franchise that was added after the original 8 teams?", "isAddedAfter2008", true],
  ["Is this team based in South India?", "isSouthIndia", true],
  ["Is this team based in Mumbai or Maharashtra?", "isMumbaiMaharashtra", true],
  ["Is this team based in Delhi or the NCR region?", "isDelhiNCR", true],
  ["Is this team from West Bengal (Kolkata)?", "isWestBengal", true],
  ["Is this team from Rajasthan?", "isRajasthan", true],
  ["Is this team from Tamil Nadu (Chennai)?", "isTamilNadu", true],
  ["Is this team from Hyderabad?", "isHyderabad", true],
  ["Is this team from Punjab or Chandigarh?", "isPunjab", true],
  ["Is this team based in Gujarat (Ahmedabad)?", "isGujarat", true],
  ["Is this team from Lucknow or Uttar Pradesh?", "isLucknow", true],
  ["Has this team won the IPL title at least once?", "wonIPLTitle", true],
  ["Has this team won the IPL title more than twice?", "wonMoreThanTwoTitles", true],
  ["Has this team won the IPL title more than four times?", "wonMoreThanFourTitles", true],
  ["Has this team ever reached an IPL final?", "reachedFinal", true],
  ["Did this team win the Champions League T20?", "wonCLT20", true],
  ["Is this team generally considered the most successful IPL franchise?", "mostSuccessful", true],
  ["Was MS Dhoni ever the captain or player of this team?", "hadDhoni", true],
  ["Was Rohit Sharma ever the captain or player of this team?", "hadRohit", true],
  ["Was Virat Kohli ever the captain or player of this team?", "hadKohli", true],
  ["Was Sourav Ganguly ever associated with this team as captain or mentor?", "hadGanguly", true],
  ["Did this team ever have a foreign captain as their regular skipper?", "hadForeignCaptain", true],
  ["Was this team ever captained by Shane Warne?", "hadWarne", true],
  ["Was David Warner ever the captain of this team?", "hadWarner", true],
  ["Is this the team where Sachin Tendulkar played throughout his IPL career?", "hadSachin", true],
  ["Is this the franchise where AB de Villiers spent most of his IPL career?", "hadABdeVilliers", true],
  ["Did Suresh Raina play the majority of his IPL career for this team?", "hadRaina", true],
  ["Is Hardik Pandya strongly associated with this franchise?", "hadHardik", true],
  ["Was Chris Gayle famous for playing for this team?", "hadGayle", true],
  ["Does this team play their home games at the Wankhede Stadium?", "homeWankhede", true],
  ["Does this team play home games at M. Chinnaswamy Stadium?", "homeChinnaswamy", true],
  ["Does this team play home games at Eden Gardens?", "homeEdenGardens", true],
  ["Does this team play at M. A. Chidambaram Stadium (Chepauk)?", "homeChepauk", true],
  ["Does this team play at the Narendra Modi Stadium (Ahmedabad)?", "homeNarendraModi", true],
  ["Does this team play at the Arun Jaitley Stadium (Delhi)?", "homeArunJaitley", true],
  ["Does this team play at Sawai Mansingh Stadium (Jaipur)?", "homeSawaiMansingh", true],
  ["Is this team's primary jersey colour blue?", "jerseyBlue", true],
  ["Is this team's primary jersey colour yellow or gold?", "jerseyYellowGold", true],
  ["Is this team associated with the colour red and gold?", "jerseyRed", true],
  ["Does this team have a lion or big cat in their logo?", "hasLionLogo", true],
  ["Is this team associated with a Knight/warrior theme?", "hasKnightTheme", true],
  ["Is this team's name related to a royal/Rajput heritage?", "hasRoyalTheme", true],
  ["Is this team's name related to a sunrising or dawn theme?", "hasSunTheme", true],
  ["Was this team part of the original 8 franchises in IPL 2008?", "playedIn2008", true],
  ["Was this team ever suspended for a season due to controversy?", "wasSuspended", true]
];

// ── Scoring Engine ────────────────────────────────────────────────────────────

interface ScoredEntity {
  entity: IPLEntity;
  score: number;
  matches: number;
  mismatches: number;
  checked: number;
}

/**
 * Score every entity against the current question history.
 * +3 for each attribute match, -10 for each contradiction.
 * "maybe" answers are ignored (neutral).
 */
export function scoreEntities(
  entities: IPLEntity[],
  history: { question: string; answer: string }[],
  questionBank: QEntry[]
): ScoredEntity[] {
  // Build lookup: question text → [attrKey, yesValue]
  const qMap = new Map<string, [keyof EntityAttr, boolean]>();
  for (const [q, attr, yesVal] of questionBank) {
    qMap.set(q, [attr, yesVal]);
  }

  return entities.map((entity) => {
    let score = 0;
    let matches = 0;
    let mismatches = 0;
    let checked = 0;

    for (const { question, answer } of history) {
      if (answer === 'maybe') continue;
      const mapping = qMap.get(question);
      if (!mapping) continue;

      const [attrKey, yesValue] = mapping;
      const entityValue = entity.attr[attrKey];

      // Determine what value we expect for this entity given the user's answer
      const expectedValue = answer === 'yes' ? yesValue : !yesValue;
      checked++;

      if (entityValue === expectedValue) {
        score += 3;
        matches++;
      } else {
        score -= 10; // heavy contradiction penalty
        mismatches++;
      }
    }

    return { entity, score, matches, mismatches, checked };
  });
}

/**
 * Pick the most informative NEXT question:
 * Among the top-N entities by score, find the unanswered question that
 * splits them closest to 50/50 (maximizes information gain).
 */
export function pickBestQuestion(
  topEntities: ScoredEntity[],
  questionBank: QEntry[],
  askedQuestions: string[]
): string {
  const candidates = topEntities.slice(0, 12);

  let bestQuestion = '';
  let bestScore = -1;

  for (const [q, attr] of questionBank) {
    if (askedQuestions.includes(q)) continue;

    let trueCount = 0;
    for (const { entity } of candidates) {
      if (entity.attr[attr] === true) trueCount++;
    }

    // Information gain: closest to 50% split is best
    const ratio = trueCount / candidates.length;
    const infoScore = 1 - Math.abs(ratio - 0.5) * 2; // 1.0 = perfect, 0.0 = useless

    if (infoScore > bestScore) {
      bestScore = infoScore;
      bestQuestion = q;
    }
  }

  return bestQuestion || questionBank.find(([q]) => !askedQuestions.includes(q))?.[0] || questionBank[0][0];
}

/**
 * Main engine function:
 * Returns { question, guess, confidence, mood } based on history.
 */
export function runAkinatorEngine(
  mode: 'player' | 'team' | 'match',
  history: { question: string; answer: string }[]
): { question: string; guess: string | null; confidence: number; mood: string } {
  const entities =
    mode === 'player' ? IPL_PLAYERS
    : mode === 'team' ? IPL_TEAMS
    : [];
  const questionBank =
    mode === 'player' ? SMART_PLAYER_QUESTIONS
    : mode === 'team' ? SMART_TEAM_QUESTIONS
    : [];
  const askedQuestions = history.map((h) => h.question);
  const historyLen = history.length;

  if (entities.length === 0) {
    // Fallback for team/match mode
    const fallback = getFallbackResponse(historyLen, mode, askedQuestions);
    return {
      question: fallback.question,
      guess: null,
      confidence: fallback.confidence,
      mood: fallback.mood,
    };
  }

  // Score all entities
  const scored = scoreEntities(entities, history, questionBank);
  scored.sort((a, b) => b.score - a.score);

  const top = scored[0];
  const second = scored[1];
  const topScore = top?.score ?? 0;
  const secondScore = second?.score ?? 0;

  // Mood based on progress
  const mood =
    historyLen < 4 ? 'curious' :
    historyLen < 8 ? 'focused' :
    historyLen < 12 ? 'smug' : 'panic';

  // Compute confidence:
  // Base: match rate of the top entity scaled to 90%, plus lead over second place up to 15%
  let confidence = 0;
  if (top && top.checked > 0) {
    const matchRate = top.matches / top.checked;
    const leadBonus = topScore - secondScore;
    confidence = Math.min(96, matchRate * 90 + Math.min(leadBonus * 1.5, 15));
  }

  // Guess when:
  // 1. Confidence is high enough (>= 90%) AND we've asked at least 8 questions to allow proper gameplay
  // 2. OR top entity has zero mismatches after at least 11 questions
  // 3. OR we've reached near the end (14+ questions) and the top is clear
  const shouldGuess =
    (confidence >= 90 && historyLen >= 8) ||
    (top?.mismatches === 0 && historyLen >= 11) ||
    (historyLen >= 14 && topScore > secondScore);

  if (shouldGuess && top) {
    const finalConfidence = Math.max(confidence, 90);
    const nextQ = pickBestQuestion(scored, questionBank, askedQuestions);
    return {
      question: nextQ,
      guess: top.entity.name,
      confidence: Math.min(finalConfidence, 96),
      mood: 'smug',
    };
  }

  // Pick the most informative next question
  const nextQuestion = pickBestQuestion(scored, questionBank, askedQuestions);

  return {
    question: nextQuestion,
    guess: topScore > 18 && top?.mismatches === 0 && historyLen >= 10 ? top.entity.name : null,
    confidence: Math.min(confidence, 82),
    mood,
  };
}
