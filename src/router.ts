import { createRouter, defineRoute, param } from "type-route";

export const { RouteProvider, useRoute, routes } = createRouter({
  home: defineRoute(
    { page: param.query.optional.number },
    () => "/",
  ),
});
