declare namespace FormGuideAPI {
  type BaseAPI<
    T,
    U extends Record<string, unknown> = Record<string, unknown>
  > = {
    data: T;
    errors: { message: string; [key: string]: string }[];
    meta: U;
  };
  type BaseAPIV2<T, U = Record<string, unknown>> =
    | {
        data: T;
        errors?: never[];
        meta: U;
      }
    | {
        data?: null;
        errors: { message: string; [key: string]: string }[];
        meta?: null;
      };
  namespace Responses {
    type Goal = {
      fixtureId: number;
      goals: Results.FixtureEvent[];
    };
    type Goals = BaseApiV2<Goal[]>;
    type Fixture = {
      fixtureData: Results.FixtureApi[];
      predictionData: Results.PredictionApi[];
    };
    type FixtureEndpoint = BaseApiV2<Fixture>;
    type SimulationsEndpoint = BaseAPIV2<Data.Simulations, Meta.Simulations>;
  }
  namespace Data {
    type Simulations = Record<string, Record<number, number>>;
  }
  namespace Meta {
    type Generic = { fromCache?: boolean; took?: number };
    type Simulations = Generic & { simulations: number };
  }
}
