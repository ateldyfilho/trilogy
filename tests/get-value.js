import Trilogy from '../dist/trilogy'

import test from 'ava'
import { remove } from 'fs-jetpack'
import { join, basename } from 'path'

const filePath = join(__dirname, `${basename(__filename, '.js')}.db`)
const db = new Trilogy(filePath)

test.before(async () => {
  await db.createTable('one', ['first', 'second'])
  await db.insert('one', {
    first: 'fee',
    second: 'blah'
  })
})

test.after.always('remove test database file', () => remove(filePath))

test('retrieves the value at a single column & row', async t => {
  let res = await db.getValue('one.second', { first: 'fee' })
  t.is(res, 'blah')
})

test('is undefined when no value at the path exists', async t => {
  let noRow = await db.getValue('one.second', { first: 'worst' })
  let noColumn = await db.getValue('one.third', { first: 'fee' })
  t.is(noRow, undefined)
  t.is(noColumn, undefined)
})
