/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from 'class-validator'

import { expectValidationError } from './validationUtils'

import { HousingDisrepair, ValidationErrors } from 'forms/models/housingDisrepair'
import { GeneralDamages } from 'forms/models/generalDamages'
import { OtherDamages } from 'forms/models/otherDamages'
import { YesNo } from 'app/forms/models/yesNo'

describe('Housing Disrepair', () => {
  describe('deserialize', () => {
    it('should return a HousingDisrepair instance', () => {
      let deserialized = new HousingDisrepair().deserialize({})
      expect(deserialized).to.be.instanceof(HousingDisrepair)
    })

    it('should return a HousingDisrepair instance with fields set to default values when given "undefined"', () => {
      let deserialized = new HousingDisrepair().deserialize(undefined)
      expect(deserialized.housingDisrepair).to.be.undefined
      expect(deserialized.generalDamages).to.be.undefined
      expect(deserialized.otherDamages).to.be.undefined
    })

    it('should return a HousingDisrepair instance with fields set to default values when given "null"', () => {
      let deserialized = new HousingDisrepair().deserialize(null)
      expect(deserialized.housingDisrepair).to.be.undefined
      expect(deserialized.generalDamages).to.be.undefined
      expect(deserialized.otherDamages).to.be.undefined
    })

    it('should return a HousingDisrepair instance with fields set to undefined when given an empty object', () => {
      let deserialized = new HousingDisrepair().deserialize({})
      expect(deserialized.housingDisrepair).to.be.undefined
      expect(deserialized.generalDamages).to.be.undefined
      expect(deserialized.otherDamages).to.be.undefined
    })

    it('should return a HousingDisrepair instance with fields set when given an object with value', () => {
      let deserialized = new HousingDisrepair().deserialize({ housingDisrepair: YesNo.YES, generalDamages: GeneralDamages.MORE, otherDamages: OtherDamages.NONE })
      expect(deserialized.housingDisrepair).to.be.eq(YesNo.YES)
      expect(deserialized.generalDamages).to.be.eq(GeneralDamages.MORE)
      expect(deserialized.otherDamages).to.be.eq(OtherDamages.NONE)
    })
  })
  describe('validation', () => {
    const validator: Validator = new Validator()

    it('should reject housing disrepair with undefined type', () => {
      const errors = validator.validateSync(new HousingDisrepair(undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.HOUSING_DISREPAIR_REQUIRED)
    })

    it('should accept housing disrepair with recognised type', () => {
      YesNo.all().forEach(type => {
        const errors = validator.validateSync(new HousingDisrepair(type, GeneralDamages.MORE, OtherDamages.NONE))

        expect(errors.length).to.equal(0)
      })
    })

    it('should reject housing disrepair without general or other damages', () => {
      const errors = validator.validateSync(new HousingDisrepair(YesNo.YES, undefined, undefined))

      expect(errors.length).to.equal(2)
      expectValidationError(errors, ValidationErrors.GENERAL_DAMAGES_REQUIRED)
      expectValidationError(errors, ValidationErrors.OTHER_DAMAGES_REQUIRED)
    })

    it('should reject housing disrepair without general damages', () => {
      const errors = validator.validateSync(new HousingDisrepair(YesNo.YES, undefined, OtherDamages.NONE))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.GENERAL_DAMAGES_REQUIRED)
    })

    it('should reject housing disrepair without other damages', () => {
      const errors = validator.validateSync(new HousingDisrepair(YesNo.YES, GeneralDamages.LESS, undefined))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.OTHER_DAMAGES_REQUIRED)
    })

    it('should accept housing disrepair with recognised general damages', () => {
      GeneralDamages.all().forEach(type => {
        const errors = validator.validateSync(new HousingDisrepair(YesNo.YES, type, OtherDamages.NONE))

        expect(errors.length).to.equal(0)
      })
    })

    it('should accept housing disrepair with recognised other damages', () => {
      OtherDamages.all().forEach(type => {
        const errors = validator.validateSync(new HousingDisrepair(YesNo.YES, GeneralDamages.LESS, type))

        expect(errors.length).to.equal(0)
      })
    })
  })
})
