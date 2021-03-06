import { Party } from './party'
import { Address } from 'claims/models/address'
import { PartyType } from 'common/partyType'

export class Organisation extends Party {
  companiesHouseNumber?: string

  constructor (name?: string,
               address?: Address,
               companiesHouseNumber?: string) {
    super(PartyType.ORGANISATION.dataStoreValue, name, address)
    this.companiesHouseNumber = companiesHouseNumber
  }

  deserialize (input: any): Organisation {
    if (input) {
      Object.assign(this, new Party().deserialize(input))
      this.companiesHouseNumber = input.companiesHouseNumber
      this.type = PartyType.ORGANISATION.dataStoreValue
    }
    return this
  }
}
