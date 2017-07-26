/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import * as _ from 'lodash'
import { Validator } from 'class-validator'

import { expectValidationError } from './validationUtils'
import { Address, ValidationErrors } from 'forms/models/address'

describe('Address', () => {
  describe('constructor', () => {
    it('should set primitive type fields to undefined', () => {
      let address = new Address()
      expect(address.line1).to.be.undefined
      expect(address.line2).to.be.undefined
      expect(address.city).to.be.undefined
      expect(address.postcode).to.be.undefined
    })
  })

  describe('deserialize', () => {
    it('should return a Address instance initialised with defaults for undefined', () => {
      expect(new Address().deserialize(undefined)).to.eql(new Address())
    })

    it('should return a Address instance initialised with defaults for null', () => {
      expect(new Address().deserialize(null)).to.eql(new Address())
    })

    it('should return a Address instance with set fields from given object', () => {
      let result = new Address().deserialize({
        line1: 'AddressLine1',
        line2: 'AddressLine2',
        city: 'City',
        postcode: 'PostCode'
      })
      expect(result.line1).to.be.equals('AddressLine1')
      expect(result.line2).to.be.equals('AddressLine2')
      expect(result.city).to.be.equals('City')
      expect(result.postcode).to.be.equals('PostCode')
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject address with empty first address line and postcode', () => {
      const errors = validator.validateSync(new Address('', '', '', ''))

      expect(errors.length).to.equal(2)
      expectValidationError(errors, ValidationErrors.FIRST_LINE_REQUIRED)
      expectValidationError(errors, ValidationErrors.POSTCODE_REQUIRED)
    })

    it('should reject address with blank first address line and postcode', () => {
      const errors = validator.validateSync(new Address(' ', '', '', ' '))

      expect(errors.length).to.equal(2)
      expectValidationError(errors, ValidationErrors.FIRST_LINE_REQUIRED)
      expectValidationError(errors, ValidationErrors.POSTCODE_REQUIRED)
    })

    it('should reject address with first line longer then upper limit', () => {
      const errors = validator.validateSync(new Address(_.repeat('*', 101), '', '', 'SA1'))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.FIRST_LINE_TOO_LONG.replace('$constraint1', '100'))
    })

    it('should reject address with second line longer then upper limit', () => {
      const errors = validator.validateSync(new Address('Apartment 99', _.repeat('*', 101), '', 'SA1'))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.SECOND_LINE_TOO_LONG.replace('$constraint1', '100'))
    })

    it('should reject address with city longer then upper limit', () => {
      const errors = validator.validateSync(new Address('Apartment 99', '', _.repeat('*', 61), 'SA1'))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.CITY_NOT_VALID.replace('$constraint1', '60'))
    })

    it('should reject address with postcode longer then upper limit', () => {
      const errors = validator.validateSync(new Address('Apartment 99', '', '', _.repeat('*', 9)))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.POSTCODE_NOT_VALID.replace('$constraint1', '8'))
    })

    it('should accept valid address', () => {
      const errors = validator.validateSync(new Address('Apartment 99', '', '', 'SA1'))

      expect(errors.length).to.equal(0)
    })
  })
})