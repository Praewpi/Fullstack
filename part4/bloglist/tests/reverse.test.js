const reverse = require('../utils/for_testing').reverse //imports the function to be tested
// Since in this test case we are comparing two strings, we can use the toBe matcher.
test('reverse of a', () => {
  const result = reverse('a')

  expect(result).toBe('a')
})

test('reverse of react', () => {
  const result = reverse('react')

  expect(result).toBe('tcaer')
})

test('reverse of releveler', () => {
  const result = reverse('releveler')

  expect(result).toBe('releveler')
})

// for test break the test
// test('palindrome of react', () => {
//     const result = reverse('react')

//     expect(result).toBe('tkaer')
//   })