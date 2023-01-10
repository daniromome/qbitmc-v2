import { readFile, writeFile, mkdir } from 'node:fs/promises'

async function createEnv() {
  await mkdir('src/environments')
  await writeFile('src/environments/environment.ts', `export const environment = ${JSON.stringify(process.env)}`)
}

async function readEnv() {
  try {
    const env = await readFile('.env')
    const vars = {};
    const lines = env.toString().split('\n')
    lines.pop()
    lines.forEach(line => {
      const [key, value] = line.split('=')
      vars[key] = value
    })
    process.env = vars
    await createEnv()
  } catch (error) {
    if (error.code === 'ENOENT') await createEnv()
    else console.error(error)
  }
}

await readEnv()
