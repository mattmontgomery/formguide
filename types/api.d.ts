declare namespace FormGuideAPI {
  type BaseAPI<
    T,
    U extends Record<string, unknown> = Record<string, unknown>
  > = {
    data: T;
    errors: { message: string; [key: string]: string }[];
    meta: U;
  };
  type BaseAPIV2<T> =
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
}
