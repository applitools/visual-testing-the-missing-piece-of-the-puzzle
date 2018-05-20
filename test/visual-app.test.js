'use strict'
const {describe, it, before, after} = require('mocha')
const {expect} = require('chai')
const webdriver = require('selenium-webdriver')
const {Eyes} = require('eyes.selenium')
require('chromedriver')
const {By, until, Key} = webdriver

require('chai').use(require('chai-image-assert')(__dirname))

describe('registration page', function() {
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

    await eyes.open(driver, 'Test', 'visual-app', {width: 800, height: 600})
  })
  after(async () => await eyes.close())

  async function waitFor(selector) {
    await driver.wait(until.elementLocated(By.css(selector)))
  }

  async function setText(selector, text) {
    const field = await driver.findElement(By.css(selector))

    await field.sendKeys(text)
  }

  async function click(selector) {
    const element = await driver.findElement(By.css(selector))
    await element.click()
  }

  async function getText(selector) { // eslint-disable-line
    const element = await driver.findElement(By.css(selector))

    return await element.getText()
  }

  async function checkWindow(baseImageName) {
    const screenshot = new Buffer(await driver.takeScreenshot(), 'base64')

    expect(screenshot).to.matchImage(baseImageName)
  }

  it('should show the main flow correctly', async () => {
    await registerUser()
    await publishPost()
    await logout()
    await showBlogHomePage()
  })

  async function registerUser() {
    await driver.get('http://localhost:3000/register')

    await setText('input[placeholder=Username]', 'ausername')
    await setText('input[placeholder=Password]', 'aPassword')
    await setText('input[placeholder=Email]', 'an@email.com')

    await checkWindow('registration-page')

    await click('button[type=submit]')

    await waitFor('.article-preview')
    await checkWindow('empty-user-home-page')
  }

  async function publishPost() {
    const newPost = await driver.findElement(By.partialLinkText('New Post'))
    await newPost.click()

    await waitFor('input[placeholder="Article Title"]')

    await setText('input[placeholder="Article Title"]', 'a title')
    await setText('input[placeholder="What\'s this article about?"]', 'something')
    await setText('textarea[placeholder*="Write your article"]', 'wonderful')

    await checkWindow('post-page')

    await click('button[type=button]')

    await waitFor('.article-content')
    await checkWindow('new-post')
  }

  async function logout() {
    await driver.get('http://localhost:3000/settings')

    await waitFor('button.btn-outline-danger')
    await click('button.btn-outline-danger')
  }

  async function showBlogHomePage() {
    await driver.get('http://localhost:3000/')

    await checkWindow('anonymous-home-page')

    await click('.article-preview h1')
    await waitFor('.article-page')

    await checkWindow('anonymous-blog-post-view')
  }
})
