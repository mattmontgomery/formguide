declare namespace PlayerStats {
  type ApiResponse<T> = FormGuideAPI.BaseAPI<T>;
  type Minutes = {
    Rk: number;
    Player: string;
    Nation: string;
    Pos: string;
    Squad: string;
    Age: string;
    Born: number;
    MP: number;
    Min: number;
    "Mn/MP": number;
    "Min%": number;
    "90s": number;
    Starts: number;
    "Mn/Start": number;
    Compl: number;
    Subs: number;
    "Mn/Sub": number;
    unSub: number;
    PPM: number;
    onG: number;
    onGA: number;
    "+/-": number;
    "+/-90": number;
    "On-Off": number;
    onxG: number;
    onxGA: number;
    "xG+/-": number;
    "xG+/-90": number;
    Matches: string;
    id: string;
  };
}
