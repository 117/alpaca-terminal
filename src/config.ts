import path from 'path'
import fs from 'fs'
import os from 'os'

class Config {
  colors = true
  credentials = {
    key: '******',
    secret: '************',
  }
}

const CONFIG_DIR = path.join(os.homedir(), '.alpaca-terminal'),
  CONFIG_PATH = path.join(CONFIG_DIR, 'config.json')

export function read(): Config {
  let config: Config
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH).toString())
  } catch {
    write((config = new Config()))
    return config
  }
}

export function write(config: Config) {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR)
  }

  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, ' '))
}
