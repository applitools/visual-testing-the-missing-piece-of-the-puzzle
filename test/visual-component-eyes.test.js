'use strict'
const {describe, it, before, after} = require('mocha')
const {expect} = require('chai')
const webdriver = require('selenium-webdriver')
const {Eyes} = require('eyes.selenium')
require('chromedriver')
const {By, until, Key} = webdriver

describe('visual components  (eyes)', function() {
  let driver
  before(
    async () =>
      (driver = await new webdriver.Builder()
        .forBrowser('chrome')
        .build()),
  )
  after(async () => await driver.quit())

  let eyes
  before(async () => {
    eyes = new Eyes()
    eyes.setApiKey(process.env.APPLITOOLS_API_KEY)

    await eyes.open(driver, 'Test', 'visual-testing-missing-piece', {width: 800, height: 600})

    await driver.get('http://localhost:9009')
  })
  after(async () => await eyes.close())

  it('should show "no user" correctly', async () => {
    const noUser = await driver.findElement(By.linkText('no user'))
    await noUser.click()

    await eyes.checkWindow('no-user')
  })

  it('should show "with user" correctly', async () => {
    const noUser = await driver.findElement(By.linkText('with user'))
    await noUser.click()

    await eyes.checkWindow('with-user')
  })
})