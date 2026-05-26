// ─────────────────────────────────────────────────────────────────────────────
// IPL Akinator Question Bank — 150+ rich, deduction-tree style questions
// These are the primary questions used for the game logic.
// Gemini API is only used as an *optional* enhancement layer.
// ─────────────────────────────────────────────────────────────────────────────

// ── PLAYER QUESTIONS (Think-of-a-Cricketer mode) ─────────────────────────────
export const PLAYER_QUESTIONS: string[] = [
  // Nationality & Region
  "Is this player from India?",
  "Is this player from outside Asia (Australia, England, West Indies, South Africa, etc.)?",
  "Is this player from a South Asian country other than India (Sri Lanka, Pakistan, Afghanistan, Bangladesh)?",
  "Did this player grow up playing domestic cricket for Mumbai?",
  "Did this player represent an Australian state team before IPL?",
  "Is this player from the West Indies?",
  "Has this player represented England in international cricket?",
  "Is this player from South Africa?",
  "Is this player from New Zealand?",
  "Is this player from Sri Lanka?",

  // Era & Generation
  "Did this player play in the very first IPL season (2008)?",
  "Is this player still actively playing IPL as of 2024?",
  "Did this player retire from IPL before 2018?",
  "Did this player peak during the 2010–2015 IPL era?",
  "Is this player under 30 years old (as of 2024)?",
  "Is this player widely considered a legend of the old IPL era (pre-2015)?",
  "Did this player debut in IPL after 2018?",

  // Playing Role
  "Is this player primarily a batsman?",
  "Is this player primarily a bowler?",
  "Is this player an all-rounder?",
  "Is this player a wicket-keeper?",
  "Is this player known as an aggressive, explosive opening batsman?",
  "Does this player bat in the middle order?",
  "Is this player known as a match-finishing slogger?",
  "Is this player a spin bowler?",
  "Is this player a fast/pace bowler?",
  "Is this player known for bowling cutters and slower balls?",
  "Is this player a left-arm bowler?",
  "Is this player a left-handed batsman?",
  "Is this player known for playing the ramp or scoop shot?",

  // Franchise & Teams
  "Has this player ever played for Mumbai Indians?",
  "Has this player ever played for Chennai Super Kings?",
  "Has this player ever played for Royal Challengers Bangalore?",
  "Has this player ever played for Kolkata Knight Riders?",
  "Has this player ever played for Delhi Capitals/Daredevils?",
  "Has this player ever played for Rajasthan Royals?",
  "Has this player ever played for Sunrisers Hyderabad/Deccan Chargers?",
  "Has this player ever played for Punjab Kings/KXIP?",
  "Did this player spend most of their IPL career at a single franchise?",
  "Was this player retained ahead of a major IPL mega auction?",
  "Was this player ever bought for a record-breaking auction price?",
  "Was this player ever unsold at an IPL auction?",

  // Achievements & Records
  "Has this player won an IPL trophy?",
  "Has this player won more than two IPL titles?",
  "Did this player win the Orange Cap (most runs in a season)?",
  "Did this player win the Purple Cap (most wickets in a season)?",
  "Has this player scored over 4000 runs in IPL history?",
  "Has this player taken over 150 wickets in IPL?",
  "Has this player hit over 200 sixes in their IPL career?",
  "Has this player scored an IPL century?",
  "Does this player hold a record for the fastest IPL fifty?",
  "Has this player taken a hat-trick in IPL?",

  // Captaincy & Leadership
  "Has this player ever captained an IPL team?",
  "Did this player captain a franchise to at least one IPL title?",
  "Is this player known primarily as a captain rather than a specialist?",
  "Did this player captain the Indian national team?",

  // International Career
  "Has this player played Test cricket for their country?",
  "Has this player played in a World Cup final?",
  "Is this player considered one of the best T20 players in the world?",
  "Has this player played over 100 international T20 matches?",
  "Is this player already retired from international cricket but still plays IPL?",

  // Physical & Style
  "Is this player known for incredible fielding / athleticism?",
  "Is this player very tall (over 6 feet)?",
  "Is this player famous for a unique or unusual bowling action?",
  "Is this player known for their big hitting, especially in the death overs?",
  "Is this player known for their calm temperament under pressure?",
  "Is this player flamboyant and known for entertaining the crowd?",

  // Pop Culture / Fame
  "Is this player one of the most recognised cricketers globally?",
  "Did this player feature in IPL brand endorsements or ads heavily?",
  "Is this player from the 2011 World Cup-winning Indian squad?",
  "Is this player in the ICC Hall of Fame?",
  "Has this player ever faced ball-tampering or match-fixing allegations?",
];

// ── TEAM QUESTIONS (Think-of-a-Franchise mode) ────────────────────────────────
export const TEAM_QUESTIONS: string[] = [
  // Still Alive?
  "Is this team still active in the current IPL?",
  "Did this team get dissolved, replaced or rebranded (e.g., Kochi, Pune, Hyderabad Deccan)?",
  "Is this a franchise that was added after the original 8 teams?",

  // Geography
  "Is this team based in South India?",
  "Is this team based in Mumbai or Maharashtra?",
  "Is this team based in Delhi or the NCR region?",
  "Is this team from West Bengal (Kolkata)?",
  "Is this team from Rajasthan?",
  "Is this team from Tamil Nadu (Chennai)?",
  "Is this team from Hyderabad?",
  "Is this team from Punjab or Chandigarh?",
  "Is this team based in Gujarat (Ahmedabad)?",
  "Is this team from Lucknow or Uttar Pradesh?",

  // Success & Titles
  "Has this team won the IPL title at least once?",
  "Has this team won the IPL title more than twice?",
  "Has this team won the IPL title more than four times?",
  "Has this team ever reached an IPL final?",
  "Did this team win the Champions League T20?",
  "Is this team generally considered the most successful IPL franchise?",

  // Famous Captains
  "Was MS Dhoni ever the captain of this team?",
  "Was Rohit Sharma ever the captain of this team?",
  "Was Virat Kohli ever the captain of this team?",
  "Was Sourav Ganguly ever associated with this team as captain or mentor?",
  "Did this team ever have a foreign captain as their regular skipper?",
  "Was this team ever captained by Shane Warne?",
  "Was David Warner ever the captain of this team?",

  // Iconic Players
  "Is this the team where Sachin Tendulkar played throughout his IPL career?",
  "Is this the franchise where AB de Villiers spent most of his IPL career?",
  "Did Suresh Raina play the majority of his IPL career for this team?",
  "Is Hardik Pandya strongly associated with this franchise?",
  "Was Chris Gayle famous for playing for this team?",

  // Home Ground
  "Does this team play their home games at the Wankhede Stadium?",
  "Does this team play home games at M. Chinnaswamy Stadium?",
  "Does this team play home games at Eden Gardens?",
  "Does this team play at M. A. Chidambaram Stadium (Chepauk)?",
  "Does this team play at the Narendra Modi Stadium (Ahmedabad)?",
  "Does this team play at the Arun Jaitley Stadium (Delhi)?",
  "Does this team play at Sawai Mansingh Stadium (Jaipur)?",

  // Jersey & Brand
  "Is this team's primary jersey colour blue?",
  "Is this team's primary jersey colour yellow or gold?",
  "Is this team associated with the colour red and gold?",
  "Does this team have a lion or big cat in their logo?",
  "Is this team associated with a Knight/warrior theme?",
  "Is this team's name related to a royal/Rajput heritage?",
  "Is this team's name related to a sunrising or dawn theme?",

  // History
  "Was this team part of the original 8 franchises in IPL 2008?",
  "Was this team ever suspended for a season due to controversy?",
  "Did this team ever change ownership significantly?",
  "Is this team known for spending heavily at IPL auctions?",
  "Did this team produce many Indian national team players?",
];

// ── MATCH QUESTIONS (Think-of-a-historic-match mode) ─────────────────────────
export const MATCH_QUESTIONS: string[] = [
  // Year
  "Did this match happen in the first five years of IPL (2008–2012)?",
  "Did this match happen between 2013 and 2017?",
  "Did this match happen in 2018 or later?",
  "Was this the very first IPL final (2008)?",
  "Was this match from the 2013 IPL season?",
  "Was this match played in 2016?",

  // Type of Match
  "Is this match an IPL final?",
  "Is this match a playoff / eliminator / qualifier match?",
  "Is this a regular league stage match that became legendary?",
  "Was this match a Super Over decider?",
  "Did this match produce a famous last-ball finish?",
  "Was this match abandoned due to rain (DL method)?",

  // Result & Drama
  "Did the chasing team win this match?",
  "Was this match won by a margin of fewer than 5 runs?",
  "Did a team score 200+ runs in this match?",
  "Did a batsman score a century in this match?",
  "Did a bowler take 5 or more wickets in this match?",
  "Was there a dramatic last-over finish in this match?",
  "Was this match decided by a Super Over?",
  "Did the result of this match get overturned or involve controversy?",

  // Players Involved
  "Did MS Dhoni's batting play a key role in this match?",
  "Did a Chris Gayle or AB de Villiers performance define this match?",
  "Was this match famous for a spin bowler's performance?",
  "Was a young or unexpected player the hero of this match?",
  "Did a team lose despite setting a huge total?",
  "Did the losing team collapse from a winning position?",

  // Venue
  "Was this match played in Mumbai?",
  "Was this match played in Chennai?",
  "Was this match played in Bangalore?",
  "Was this match played in Kolkata?",
  "Was this match played at a neutral venue abroad (South Africa, UAE)?",
  "Was this match played outside India?",

  // Teams
  "Was Mumbai Indians one of the teams in this match?",
  "Was Chennai Super Kings one of the teams in this match?",
  "Did the match involve an underdog team winning?",
  "Did two of the 'big four' franchises play this match?",
  "Did a now-defunct team play in this match?",

  // Context
  "Was this match a title-decider?",
  "Did this match lead to the underdog team winning the IPL that year?",
  "Is this considered one of the greatest IPL matches ever played?",
  "Is this match famous for a record-breaking batting performance?",
  "Is this match remembered more for bowling brilliance?",
  "Did the match change the fortune of a franchise significantly?",
  "Was this match played in front of a sold-out crowd?",
];

// ─────────────────────────────────────────────────────────────────────────────
// Smart Question Picker — picks next unanswered question from the correct bank
// ─────────────────────────────────────────────────────────────────────────────

export function getNextQuestion(
  mode: 'player' | 'team' | 'match',
  askedQuestions: string[]
): string {
  const bank =
    mode === 'player' ? PLAYER_QUESTIONS
    : mode === 'team' ? TEAM_QUESTIONS
    : MATCH_QUESTIONS;

  // Find first question that has not already been asked
  const next = bank.find(q => !askedQuestions.includes(q));

  if (next) return next;

  // All questions exhausted — cycle with a generic closing question
  const closingQuestions = [
    "Is this entity widely considered a legend of the IPL?",
    "Is this entity associated with a particular iconic IPL moment?",
    "Would most IPL fans immediately recognise this entity?",
    "Is this entity from the early years of the IPL (2008–2012)?",
  ];
  const idx = askedQuestions.length % closingQuestions.length;
  return closingQuestions[idx];
}

// ─────────────────────────────────────────────────────────────────────────────
// Fallback response builder — used when Gemini API is unavailable
// ─────────────────────────────────────────────────────────────────────────────
export function getFallbackResponse(
  historyLength: number,
  mode: 'player' | 'team' | 'match' = 'player',
  askedQuestions: string[] = []
) {
  const question = getNextQuestion(mode, askedQuestions);
  const mood =
    historyLength < 4 ? 'curious'
    : historyLength < 8 ? 'focused'
    : historyLength < 12 ? 'smug'
    : 'panic';

  return {
    question,
    internalReasoning: "Using local knowledge bank (Gemini unavailable).",
    confidence: Math.min(historyLength * 7, 88),
    mood,
    guess: null,
  };
}
