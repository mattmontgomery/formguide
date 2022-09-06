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
    type SimulationsEndpoint = BaseAPIV2<Data.Simulations, Meta.Simulations>;
  }
  namespace Data {
    type GoalsEndpoint = {
      teams: Record<string, Data.GoalMatch[]>;
    };
    type Fixture = {
      fixtureData: Results.FixtureApi[];
      predictionData: Results.PredictionApi[];
    };
    type GoalMatch = Results.MatchWithGoalData;
    type Simulations = Record<string, Record<number, number>>;
  }
  namespace Meta {
    type Generic = { fromCache?: boolean; took?: number; compressed?: boolean };
    type Simulations = Generic & { simulations: number };
  }
}
