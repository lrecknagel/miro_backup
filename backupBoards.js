require('dotenv-flow').config();

require('chromedriver');
const webdriver = require('selenium-webdriver');
const { By } = require('selenium-webdriver');
const driver = new webdriver.Builder()
  .forBrowser('chrome')
  .build();

const boardsData = require('./boards.json');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

async function backupBoards(boardInfos) {
  await driver.get("https://miro.com/de/login/")
  const emailField = await driver.findElement(By.id('email'))
  await driver.actions()
    .sendKeys(emailField, process.env.MIRO_EMAIL)
    .perform()
  const passwordField = await driver.findElement(By.id('password'))
  await driver.actions()
    .sendKeys(passwordField, process.env.MIRO_PASS)
    .perform()
  
  const submitBtn = driver.findElement(By.className('signup__submit'));
  const actions = driver.actions({async: true});
  await actions.move({origin: submitBtn}).click().perform();

  await delay(3000)

  const boardDownloads = boardInfos.map(boardInfo => driver.get(`https://miro.com/api/v1/boards/${ boardInfo.id }/?archive=true`))
  await Promise.all(boardDownloads);
}
backupBoards(boardsData)