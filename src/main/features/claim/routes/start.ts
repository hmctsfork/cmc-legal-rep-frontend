import * as express from 'express'
import { Paths } from 'claim/paths'

export default express.Router()
  .get(Paths.startPage.uri, (req: express.Request, res: express.Response) => {
    res.render(Paths.startPage.associatedView)
  })
  .post(Paths.startPage.uri, (req: express.Request, res: express.Response) => {
    res.redirect(Paths.yourReferencePage.uri)
  })