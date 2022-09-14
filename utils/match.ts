export type Minutes = {
  id: number;
  name: string;
  photo: string;
  minutes: number | null;
  substitute: boolean;
  on: number | null;
  off: number | null;
};
export function getPlayerMinutes(
  fixture: Results.FixtureApi
): [string, Minutes[]][] {
  return fixture.players.map((teamPlayers): [string, Minutes[]] => {
    return [
      teamPlayers.team.name,
      teamPlayers.players.map((p): Minutes => {
        const subOnEvent = fixture.events.find(
          (e) => e.type === "subst" && e.assist?.id === p.player.id
        );
        const subOffEvent = fixture.events.find(
          (e) => e.type === "subst" && e.player?.id === p.player.id
        );
        return {
          id: p.player.id,
          name: p.player.name,
          photo: p.player.photo,
          minutes: p.statistics[0]?.games.minutes,
          substitute: p.statistics[0]?.games.substitute,
          on: subOnEvent?.time.elapsed ?? null,
          off: subOffEvent?.time.elapsed ?? null,
        };
      }),
    ];
  });
}

export function getPlusMinus(fixture: Results.FixtureApi) {
  const allMinutes = getPlayerMinutes(fixture);
  const goals = fixture.events.filter((e) => e.type === "Goal");
  return allMinutes
    .map(([team, minutes]) => {
      return {
        [team]: minutes
          .map((m) => {
            const goalsOn = goals.filter(
              (e) =>
                e.team.name === team &&
                inRange(e.time.elapsed, m.on ?? 0, m.off ?? 180)
            );
            const goalsOff = goals.filter(
              (e) =>
                e.team.name === team &&
                !inRange(e.time.elapsed, m.on ?? 0, m.off ?? 180)
            );
            const goalsOnOpp = goals.filter(
              (e) =>
                e.team.name !== team &&
                inRange(e.time.elapsed, m.on ?? 0, m.off ?? 180)
            );
            const goalsOffOpp = goals.filter(
              (e) =>
                e.team.name !== team &&
                !inRange(e.time.elapsed, m.on ?? 0, m.off ?? 180)
            );
            return {
              [m.name]: {
                ...m,
                goalsOn: goalsOn.length,
                goalsOff: goalsOff.length,
                goalsOnOpp: goalsOnOpp.length,
                goalsOffOpp: goalsOffOpp.length,
              },
            };
          })
          .reduce((acc, curr) => ({ ...acc, ...curr }), {}),
      };
    })
    .reduce((acc, curr) => ({ ...acc, ...curr }), {});
  //   return [minutes, goals];
}

function inRange(x: number, min: number, max: number): boolean {
  return (x - min) * (x - max) <= 0;
}
