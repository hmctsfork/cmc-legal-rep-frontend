import * as express from 'express'
import * as config from 'config'
import * as path from 'path'

import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'
import { RouterFinder } from 'common/router/routerFinder'
import { buildURL } from 'utils/callbackBuilder'
import { Paths } from 'claim/paths'
import { ViewDraftMiddleware } from 'views/draft/viewDraftMiddleware'

function claimIssueRequestHandler (): express.RequestHandler {
  function accessDeniedCallback (req: express.Request, res: express.Response): void {
    res.redirect(`${config.get('idam.authentication-web.url')}/login?continue-url=${buildURL(req, Paths.claimantLoginReceiver.uri.substring(1))}`)
  }

  const requiredRoles = [
    'cmc-private-beta',
    'claimant'
  ]
  const unprotectedPaths = []
  return AuthorizationMiddleware.requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths)
}

export class Feature {
  enableFor (app: express.Express) {
    app.all('/claim/*', claimIssueRequestHandler())
    app.all(/^\/claim\/(?!start).*$/, ClaimDraftMiddleware.retrieve)
    app.all(/^\/claim\/defendant-(add|remove)$/, ViewDraftMiddleware.retrieve)

    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
