declare namespace FormGuideAPI {
  type BaseAPI<T, U extends Meta.Generic = Record<string, unknown>> = {
    data: T;
    errors: { message: string; [key: string]: string }[];
    meta: U & Meta.Generic;
  };
  type BaseAPIV2<T, U = Record<string, unknown>> = {
    data: T;
    errors?: never[];
    meta: U & Meta.Generic;
  };
  namespace Responses {
    type ErrorResponse = {
      errors: { message: string; [key: string]: string }[];
    };
    type GoalsEndpoint = BaseAPIV2<Data.GoalsEndpoint>;
    type FixtureEndpoint = BaseAPIV2<Data.Fixture>;
    type FixturesEndpoint = BaseAPIV2<Record<string, Data.Fixtures>>;
    type PlusMinusEndpoint = BaseApiV2<Data.PlusMinusEndpoint>;
    type SimulationsEndpoint = BaseAPIV2<Data.Simulations, Meta.Simulations>;
  }
  namespace Data {
    type GoalsEndpoint = {
      teams: Record<string, Data.GoalMatch[]>;
    };
    type DetailedEndpoint = {
      teams: Record<string, Data.DetailedMatch[]>;
    };
    type Fixture = {
      fixtureData: Results.FixtureApi[];
      predictionData: Results.PredictionApi[];
    };
    type Fixtures = Results.FixtureApi;
    type GoalMatch = Results.MatchWithGoalData;
    type DetailedMatch = Results.Match & { fixtureData: Results.FixtureApi[] };
    type Simulations = Record<string, Record<number, number>>;
    type PlusMinusEndpoint = Record<string, Record<string, PlusMinus>>;
    type PlusMinus = {
      onGF: number;
      offGF: number;
      onGA: number;
      offGA: number;

      minutes: number;
      matches: number;
    };
  }
  namespace Meta {
    type Generic = { fromCache?: boolean; took?: number; compressed?: boolean };
    type Simulations = Generic & { simulations: number };
  }
}
