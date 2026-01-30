// Japanese number conversion utilities

const ONES = ['', 'ichi', 'ni', 'san', 'yon', 'go', 'roku', 'nana', 'hachi', 'kyuu']

// Convert a number (1-99999) to Japanese romaji
export function numberToJapanese(n: number): string {
  if (n === 0) return 'zero'
  if (n < 0 || n > 99999) throw new Error('Number out of range (1-99999)')

  let result = ''
  let remaining = n

  // Handle 10000s (man)
  const man = Math.floor(remaining / 10000)
  if (man > 0) {
    result += (man === 1 ? '' : ONES[man]) + 'man'
    remaining %= 10000
  }

  // Handle 1000s (sen)
  const sen = Math.floor(remaining / 1000)
  if (sen > 0) {
    if (sen === 3) result += 'sanzen'
    else if (sen === 8) result += 'hassen'
    else result += (sen === 1 ? '' : ONES[sen]) + 'sen'
    remaining %= 1000
  }

  // Handle 100s (hyaku)
  const hyaku = Math.floor(remaining / 100)
  if (hyaku > 0) {
    if (hyaku === 3) result += 'sanbyaku'
    else if (hyaku === 6) result += 'roppyaku'
    else if (hyaku === 8) result += 'happyaku'
    else result += (hyaku === 1 ? '' : ONES[hyaku]) + 'hyaku'
    remaining %= 100
  }

  // Handle 10s (juu)
  const juu = Math.floor(remaining / 10)
  if (juu > 0) {
    result += (juu === 1 ? '' : ONES[juu]) + 'juu'
    remaining %= 10
  }

  // Handle 1s
  if (remaining > 0) {
    result += ONES[remaining]
  }

  return result
}

// Generate all valid Japanese representations for a number
// (to handle alternative pronunciations for 4, 7, 9)
export function getAllValidJapanese(n: number): string[] {
  if (n === 0) return ['zero']
  if (n < 0 || n > 99999) return []

  const results: string[] = []

  // Generate all combinations by recursively building the number
  function generate(remaining: number, prefix: string): void {
    if (remaining === 0) {
      if (prefix) results.push(prefix)
      return
    }

    // Handle 10000s (man)
    if (remaining >= 10000) {
      const man = Math.floor(remaining / 10000)
      const rest = remaining % 10000
      const manParts = getDigitVariants(man)
      for (const part of manParts) {
        generate(rest, prefix + (man === 1 ? '' : part) + 'man')
      }
      return
    }

    // Handle 1000s (sen)
    if (remaining >= 1000) {
      const sen = Math.floor(remaining / 1000)
      const rest = remaining % 1000
      if (sen === 3) {
        generate(rest, prefix + 'sanzen')
      } else if (sen === 8) {
        generate(rest, prefix + 'hassen')
      } else {
        const senParts = getDigitVariants(sen)
        for (const part of senParts) {
          generate(rest, prefix + (sen === 1 ? '' : part) + 'sen')
        }
      }
      return
    }

    // Handle 100s (hyaku)
    if (remaining >= 100) {
      const hyaku = Math.floor(remaining / 100)
      const rest = remaining % 100
      if (hyaku === 3) {
        generate(rest, prefix + 'sanbyaku')
      } else if (hyaku === 6) {
        generate(rest, prefix + 'roppyaku')
      } else if (hyaku === 8) {
        generate(rest, prefix + 'happyaku')
      } else {
        const hyakuParts = getDigitVariants(hyaku)
        for (const part of hyakuParts) {
          generate(rest, prefix + (hyaku === 1 ? '' : part) + 'hyaku')
        }
      }
      return
    }

    // Handle 10s (juu)
    if (remaining >= 10) {
      const juu = Math.floor(remaining / 10)
      const rest = remaining % 10
      const juuParts = getDigitVariants(juu)
      for (const part of juuParts) {
        generate(rest, prefix + (juu === 1 ? '' : part) + 'juu')
      }
      return
    }

    // Handle 1s
    const onesParts = getDigitVariants(remaining)
    for (const part of onesParts) {
      results.push(prefix + part)
    }
  }

  generate(n, '')
  return results
}

// Get all valid pronunciations for a single digit (0-9)
function getDigitVariants(digit: number): string[] {
  switch (digit) {
    case 4:
      return ['yon', 'shi']
    case 7:
      return ['nana', 'shichi']
    case 9:
      return ['kyuu', 'ku']
    default:
      return [ONES[digit] || '']
  }
}

// Generate a random number between 1 and 99999
export function generateRandomNumber(): number {
  return Math.floor(Math.random() * 99999) + 1
}

// Check if an answer is correct for a given number
export function checkNumberAnswer(
  userAnswer: string,
  correctNumber: number,
  direction: 'num-to-jp' | 'jp-to-num'
): boolean {
  const normalized = userAnswer.toLowerCase().trim().replace(/\s+/g, '')

  if (direction === 'num-to-jp') {
    // User types Japanese romaji, check against all valid forms
    const validAnswers = getAllValidJapanese(correctNumber)
    return validAnswers.some((valid) => valid === normalized)
  } else {
    // User types the number
    const parsed = parseInt(normalized, 10)
    return parsed === correctNumber
  }
}
