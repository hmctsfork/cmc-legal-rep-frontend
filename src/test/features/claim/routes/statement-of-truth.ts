import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import * as mock from 'nock'

import '../../../routes/expectations'
import { checkAuthorizationGuards } from './checks/authorization-check'

import { Paths as ClaimPaths } from 'claim/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as draftStoreServiceMock from '../../../http-mocks/draft-store'

const cookieName: string = config.get<string>( 'session.cookieName' )

describe( 'Claim : Statement of truth page', () => {
  beforeEach( () => {
    mock.cleanAll()
    draftStoreServiceMock.resolveRetrieve( 'legalClaim' )
  } )

  describe( 'on GET', () => {
    checkAuthorizationGuards( app, 'get', ClaimPaths.statementOfTruthPage.uri)

    it( 'should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor( 1, 'cmc-private-beta', 'claimant' )

      await request( app )
        .get( ClaimPaths.statementOfTruthPage.uri )
        .set( 'Cookie', `${cookieName}=ABC` )
        .expect( res => expect( res ).to.be.successful.withText( 'Statement of truth' ) )
    } )
  } )

  describe( 'on POST', () => {
    checkAuthorizationGuards( app, 'post', ClaimPaths.statementOfTruthPage.uri)

    it( 'should render page when form is invalid and everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor( 1, 'cmc-private-beta', 'claimant' )

      await request( app )
        .post( ClaimPaths.statementOfTruthPage.uri )
        .set( 'Cookie', `${cookieName}=ABC` )
        .expect( res => expect( res ).to.be.successful.withText( 'Statement of truth', 'div class="error-summary"' ) )
    } )

    it( 'should return 500 and render error page when form is valid and cannot save draft', async () => {
      idamServiceMock.resolveRetrieveUserFor( 1, 'cmc-private-beta', 'claimant' )
      draftStoreServiceMock.rejectSave( 'legalClaim', 'HTTP error' )

      await request( app )
        .post( ClaimPaths.statementOfTruthPage.uri )
        .set( 'Cookie', `${cookieName}=ABC` )
        .send( { signerName: 'My Name', signerRole: 'role' } )
        .expect( res => expect( res ).to.be.serverError.withText( 'Error' ) )
    } )

    it( 'should redirect to pay by account page when form is valid and everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor( 1, 'cmc-private-beta', 'claimant' )
      draftStoreServiceMock.resolveSave( 'legalClaim' )

      await request( app )
        .post( ClaimPaths.statementOfTruthPage.uri )
        .set( 'Cookie', `${cookieName}=ABC` )
        .send( { signerName: 'My Name' , signerRole: 'role'} )
        .expect( res => expect( res ).to.be.redirect.toLocation( ClaimPaths.payByAccountPage.uri ) )
    } )
  } )
} )