const { removeQuotes, padCharacter } = require('./string-utils')

test('remove quotes should remove quotes from string', () => {
  expect(removeQuotes('"\'test\'"')).toBe('test')
})

test('Pad a character should add characters before a string to fill it to a specific size', () => {
  expect(padCharacter('test', 10, '0')).toBe('000000test')
  expect(padCharacter('test12345', 10, '0')).toBe('0test12345')
  expect(padCharacter('test123456', 10, '0')).toBe('test123456')
  expect(padCharacter('test1234567', 10, '0')).toBe('test1234567')
  expect(padCharacter('', 10, '1')).toBe('1111111111')
})
