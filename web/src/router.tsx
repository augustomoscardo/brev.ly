import { Outlet, createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { Home } from './routes/index'
import { NotFound } from './routes/not-found'
import { Redirect } from './routes/redirect'

const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
})

const redirectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '$url', // Isso captura `/:url`
  component: Redirect,
})

const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/not-found',
  component: NotFound,
})

const noExistsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '*',
  component: NotFound,
})

const routeTree = rootRoute.addChildren([indexRoute, redirectRoute, notFoundRoute, noExistsRoute])

export const router = createRouter({ routeTree })
