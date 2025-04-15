/**
 * Problem Set 1: Flashcards - Algorithm Functions
 *
 * This file contains the implementations for the flashcard algorithm functions
 * as described in the problem set handout.
 *
 * Please DO NOT modify the signatures of the exported functions in this file,
 * or you risk failing the autograder.
 */

import { Flashcard, AnswerDifficulty, BucketMap } from "./flashcards";

/**
 * Converts a Map representation of learning buckets into an Array-of-Set representation.
 *
 * @param buckets Map where keys are bucket numbers and values are sets of Flashcards.
 * @returns Array of Sets, where element at index i is the set of flashcards in bucket i.
 *          Buckets with no cards will have empty sets in the array.
 * @spec.requires buckets is a valid representation of flashcard buckets.
 */
export function toBucketSets(buckets: BucketMap): Array<Set<Flashcard>> {
  const array_of_sets : Array<Set<Flashcard>> = [];
  const max = Math.max(...Array.from(buckets.keys()));


  for( let i = 0 ; i <= max; i++){
    const bucket = buckets.get(i);
    if(bucket){
      array_of_sets[i] = new Set(bucket);
    }
    else{
      array_of_sets[i] = new Set();
    }
  }
  return array_of_sets;
}

/**
 * Finds the range of buckets that contain flashcards, as a rough measure of progress.
 *
 * @param buckets Array-of-Set representation of buckets.
 * @returns object with minBucket and maxBucket properties representing the range,
 *          or undefined if no buckets contain cards.
 * @spec.requires buckets is a valid Array-of-Set representation of flashcard buckets.
 */
 export function getBucketRange(
  buckets: Array<Set<Flashcard>>
): { minBucket: number; maxBucket: number } | undefined {
  const range: number[] = [];

  for (let i = 0; i < buckets.length; i++) {
    const bucket = buckets[i];
    if (bucket && bucket.size > 0 ) {
      range.push(i);
    }
  }

  if (range.length === 0) {
    return undefined;
  }

  const minBucket = Math.min(...range);
  const maxBucket = Math.max(...range);

  return { minBucket, maxBucket };
}


/**
 * Selects cards to practice on a particular day.
 *
 * @param buckets Array-of-Set representation of buckets.
 * @param day current day number (starting from 0).
 * @returns a Set of Flashcards that should be practiced on day `day`,
 *          according to the Modified-Leitner algorithm.
 * @spec.requires buckets is a valid Array-of-Set representation of flashcard buckets.
 */
export function practice(
  buckets: Array<Set<Flashcard>>,
  day: number
): Set<Flashcard> {
  let practice_cards = new Set<Flashcard>();

  for(let i = 0; i <= day; i++){
    let bucket = buckets[i];
    if(bucket){
      bucket.forEach(card => practice_cards.add(card));

    }
  }
  return practice_cards;
}

export function update(
  buckets: BucketMap,
  card: Flashcard,
  difficulty: AnswerDifficulty
): BucketMap {
  for (let [mark, bucket] of buckets.entries()) {
    if (bucket.has(card)) {
      bucket.delete(card);

      let newmark = mark;

      switch (difficulty) {
        case AnswerDifficulty.Wrong:
          newmark = 0;
          break;
        case AnswerDifficulty.Hard:
          break;
        case AnswerDifficulty.Easy:
          newmark = Math.min(mark + 1, buckets.size - 1);
          break;
      }

      if (!buckets.has(newmark)) {
        buckets.set(newmark, new Set());
      }
      buckets.get(newmark)!.add(card);
      
      break;
    }
  }

  return buckets;
}


/**
 * Generates a hint for a flashcard.
 *
 * @param card flashcard to hint
 * @returns a hint for the front of the flashcard.
 * @spec.requires card is a valid Flashcard.
 */
export function getHint(card: Flashcard): string {
  return card.hint;
}

/**
 * Computes statistics about the user's learning progress.
 *
 * @param buckets representation of learning buckets.
 * @param history representation of user's answer history.
 * @returns statistics about learning progress.
 * @spec.requires [SPEC TO BE DEFINED]
 */
 export function computeProgress(
  buckets: Map<number, Set<Flashcard>>,
  history: Array<{
    card: Flashcard;
    difficulty: AnswerDifficulty;
    day: number;
  }>
): {
  totalCards: number;
  cardsPerBucket: Map<number, number>;
  correctRatio: number;
  mediumRatio: number;
  hardRatio: number;
} {
  let totalCards = 0;
  const cardsPerBucket = new Map<number, number>();

  for (const [bucketNumber, cardSet] of buckets.entries()) {
    const count = cardSet.size;
    cardsPerBucket.set(bucketNumber, count);
    totalCards += count;
  }

  let easy = 0;
  let hard = 0;
  let wrong = 0;

  for (const entry of history) {
    switch (entry.difficulty) {
      case AnswerDifficulty.Easy:
        easy++;
        break;
      case AnswerDifficulty.Hard:
        hard++;
        break;
      case AnswerDifficulty.Wrong:
        wrong++;
        break;
    }
  }

  const totalAttempts = easy + hard + wrong;
  const correctRatio = totalAttempts > 0 ? easy / totalAttempts : 0;
  const mediumRatio = totalAttempts > 0 ? hard / totalAttempts : 0;
  const hardRatio = totalAttempts > 0 ? wrong / totalAttempts : 0;

  return {
    totalCards,
    cardsPerBucket,
    correctRatio,
    mediumRatio,
    hardRatio,
  };
}
