import { LeagueOptions } from "@/utils/Leagues";
import NavigationConfig from "@/constants/nav";
import type { NavItem } from "@/constants/nav";
import { KBarProvider, KBarProviderProps } from "kbar";
import { NextRouter, useRouter } from "next/router";
import React, { useContext } from "react";
import { PropsWithChildren } from "react";
import LeagueContext from "./LeagueContext";

const getActions = ({
  router,
  league,
  onSetLeague,
}: {
  router: NextRouter;
  league: Results.Leagues;
  onSetLeague: (league: Results.Leagues) => void;
}): KBarProviderProps["actions"] => [
  ...NavigationConfig.filter(
    (action) => typeof action === "object" && Boolean((action as NavItem)?.href)
  ).map((action) => {
    const navItem = action as NavItem;
    return {
      id: navItem.href || navItem.title,
      name: navItem.title,
      icon: navItem.icon,
      perform: () => {
        if (navItem.href.includes("http") && typeof window !== "undefined") {
          window.location.href = navItem.href;
        } else {
          router.push({
            pathname: navItem.external
              ? navItem.href
              : `/${league}${navItem.href}`,
          });
        }
      },
    };
  }),
  ...Object.entries(LeagueOptions).map(([l, leagueName]) => {
    return {
      id: `select-${l}`,
      name: `Select League: ${leagueName}`,
      perform: () => {
        onSetLeague(l as Results.Leagues);
        router.push({
          pathname: router.pathname,
          query: {
            ...router.query,
            league: l,
          },
        });
      },
    };
  }),
];

export type ProviderProps = KBarProviderProps & {
  onSetLeague: (league: Results.Leagues) => void;
} & PropsWithChildren;

const Provider = React.forwardRef<typeof KBarProvider, ProviderProps>(
  function Provider(props, ref) {
    const router = useRouter();
    const league = useContext(LeagueContext);

    return (
      <KBarProvider
        actions={getActions({
          router,
          league: league,
          onSetLeague: props.onSetLeague,
        })}
        {...props}
      />
    );
  }
);

export default Provider;
