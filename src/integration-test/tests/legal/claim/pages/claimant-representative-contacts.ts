import I = CodeceptJS.I

const I: I = actor()

const fields = {
  phoneNumber: 'input[id=phoneNumber]',
  email: 'input[id=email]',
  dxAddress: 'input[id=dxAddress]'
}

const buttons = {
  saveAndContinue: 'input.button'
}

const data = {
  phoneNumberText: '0700000000',
  emailText: 'vivred@mailinator.com',
  dxAddressText: 'DX123'
}

export class ClaimantRepresentativeContactsPage {
  open (): void {
    I.amOnLegalAppPage('/claim/representative-contacts')
  }

  enterYourOrganisationContactDetails (): void {
    I.fillField(fields.phoneNumber, data.phoneNumberText)
    I.fillField(fields.email, data.emailText)
    I.fillField(fields.dxAddress, data.dxAddressText)
    I.click(buttons.saveAndContinue)
  }

  verifyContactDetails (): void {
    I.seeInField(fields.phoneNumber, data.phoneNumberText)
    I.seeInField(fields.email, data.emailText)
    I.seeInField(fields.dxAddress, data.dxAddressText)
  }

  submitOnlyMandatoryData (): void {
    I.click(buttons.saveAndContinue)
  }
}
