export interface Player {
  tag: string;
  name: string;
  trophies: number;
  highestTrophies: number;
  '3vs3Victories': number;
  soloVictories: number;
  duoVictories: number;
  icon: {
    id: number;
  };
  club?: {
    tag: string;
    name: string;
    badgeId: number;
    badgeUrl?: string;
  };
  profileImageUrl: string;
  brawlers: Brawler[];
  battlelog: Battle[];
}

export interface Brawler {
  id: number;
  name: string;
  trophies: number;
  highestTrophies: number;
  power: number;
  rank: number;
  imageUrl: string;
}

export interface Battle {
  battleTime: string;
  event: {
    id: number;
    mode: string;
    map: string;
  };
  battle: {
    mode: string;
    result: string;
    duration: number;
    teams: Array<Array<{
      tag: string;
      name: string;
      brawler: {
        id: number;
        name: string;
        power: number;
        trophies: number;
      };
    }>>;
  };
}

export interface ApiResponse extends Player {}
