import I = CodeceptJS.I

const I: I = actor()

const fields = {
  summariseClaimTextArea: 'textarea[id=text]'
}

const buttons = {
  saveAndContinue: 'input.button'
}

export class ClaimSummariseTheClaimPage {

  open (): void {
    I.amOnLegalAppPage('/claim/summarise-the-claim')
  }

  enterBriefDescriptionOfTheClaim (): void {
    I.fillField(fields.summariseClaimTextArea, 'I would like to test this with codeceptjs')
    I.click(buttons.saveAndContinue)
  }
}
