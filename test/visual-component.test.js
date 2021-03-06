'use strict'
const {describe, it, before, after} = require('mocha')
const {expect} = require('chai')
const webdriver = require('selenium-webdriver')
const {Eyes} = require('eyes.selenium')
require('chromedriver')
const {By, until, Key} = webdriver

require('chai').use(require('chai-image-assert')(__dirname))

describe('visual components', function() {
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
    await driver.get('http://localhost:9009')
  })

  it('should show "no user" correctly', async () => {
    const noUser = await driver.findElement(By.linkText('no user'))
    await noUser.click()

    const screenshot = new Buffer(await driver.takeScreenshot(), 'base64')

    expect(screenshot).to.matchImage('no-user')
  })

  it('should show "with user" correctly', async () => {
    const noUser = await driver.findElement(By.linkText('with user'))
    await noUser.click()

    expect(new Buffer(await driver.takeScreenshot(), 'base64')).to.matchImage('with-user')
  })
})