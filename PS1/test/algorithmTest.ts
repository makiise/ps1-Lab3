import assert from "assert";
import { AnswerDifficulty, Flashcard, BucketMap } from "../src/flashcards";
import {
  toBucketSets,
  getBucketRange,
  practice,
  update,
  getHint,
  computeProgress,
} from "../src/algorithm";

/*
 * Testing strategy for toBucketSets():
 *
 * TODO: Describe your testing strategy for toBucketSets() here.
 */


describe("toBucketSets()", () => {
  it("returns empty array when input map is empty", () => {
    const input = new Map();
    const output = toBucketSets(input);
    assert.deepStrictEqual(output, []); // This test looks fine
  });

  it("maps questions to answers correctly", () => {
    const cardA = new Flashcard("What cardinality do the real numbers have?", "Continuum", "Cardinality of Numbers", ["math"]);
    const cardB = new Flashcard("What is the equation for the electric field of a point charge using Gauss's law?", "E = (1 / 4πϵ₀) * (q / r²) * r̂", "Gauss Electric Field", ["Physics"]);

    const map = new Map<number, Set<Flashcard>>(); 
    map.set(0, new Set([cardA])); // Card A is in bucket 0
    map.set(2, new Set([cardB])); // Card B is in bucket 2

    const result = toBucketSets(map);

    //math
    assert.deepStrictEqual(result[0], new Set([cardA]));
    
    // for empty bucket
    assert.deepStrictEqual(result[1], new Set());
    //physics card
    assert.deepStrictEqual(result[2], new Set([cardB]));
  });
});



/*
 * Testing strategy for getBucketRange():
 *
 * TODO: Describe your testing strategy for getBucketRange() here.
 */
describe("getBucketRange()", () => {
  it("the range of buckets containing flashcards", () => {
    const cardA = new Flashcard("What cardinality do the real numbers have?", "Continuum", "Cardinality of Numbers", ["math"]);
    const cardB = new Flashcard("What is the equation for the electric field of a point charge using Gauss's law?", "E = (1 / 4πϵ₀) * (q / r²) * r̂", "Gauss Electric Field", ["Physics"]);

    const buckets: Set<Flashcard>[] = [
      new Set([cardA]), // Bucket 0 - cardA
      new Set(),        // empty
      new Set([cardB])  // Bucket 2 - cardb
    ];

    const result = getBucketRange(buckets);

    assert.deepStrictEqual(result, { minBucket: 0, maxBucket: 2 });
  });

  it("undefined if there is no bucket which contains flashcards", () => {
    const buckets: Set<Flashcard>[] = [
      new Set(),  
      new Set(),  
      new Set()   
    ];

    const result = getBucketRange(buckets);

    assert.strictEqual(result, undefined);
  });

  it("single bucket with flashcards", () => {
    const cardA = new Flashcard("What cardinality do the real numbers have?", "Continuum", "Cardinality of Numbers", ["math"]);

    // Only bucket 0 contains flashcards
    const buckets: Set<Flashcard>[] = [new Set([cardA]), new Set(), new Set()];

    const result = getBucketRange(buckets);

    // the range is 0:0
    assert.deepStrictEqual(result, { minBucket: 0, maxBucket: 0 });
  });
});


/*
 * Testing strategy for practice():
 *
 * TODO: Describe your testing strategy for practice() here.
 */


describe("practice()", () => {
  const mathCard = new Flashcard(
    "What cardinality do the real numbers have?",
    "Continuum",
    "Cardinality of Numbers",
    ["math"]
  );
  const physicsCard = new Flashcard(
    "What is the equation for the electric field of a point charge using Gauss's law?",
    "E = (1 / 4πϵ₀) * (q / r²) * r̂",
    "Gauss Electric Field",
    ["Physics"]
  );

  it("handles flashcards across multiple buckets", () => {
    const buckets1 = [new Set([mathCard])];
    const buckets2 = [new Set([mathCard]), new Set([physicsCard])];
    const buckets3 = [new Set([mathCard]), undefined as any, new Set([physicsCard])];

    assert.deepEqual(practice(buckets1, 0), new Set([mathCard]));
    assert.deepEqual(practice(buckets2, 0), new Set([mathCard]));
    assert.deepEqual(practice(buckets2, 1), new Set([mathCard, physicsCard]));
    assert.deepEqual(practice(buckets3, 2), new Set([mathCard, physicsCard]));
  });
});

/*
 * Testing strategy for update():
 *
 * TODO: Describe your testing strategy for update() here.
 */



describe("update()", () => {
  it("should update the bucket for easy difficulty", () => {
    const cardA = new Flashcard("What cardinality do the real numbers have?", "Continuum", "Cardinality of Numbers", ["math"]);

    const buckets = new Map<number, Set<Flashcard>>([
      [0, new Set([cardA])],
      [1, new Set()],
    ]);

    const updatedBuckets = update(buckets, cardA, AnswerDifficulty.Easy);

    // card ---> next bucket
    assert.strictEqual(updatedBuckets.get(0)!.has(cardA), false);
    assert.strictEqual(updatedBuckets.get(1)!.has(cardA), true);
  });

  it("card should get back to the previous bucket if answer was fwrong", () => {
    const cardB = new Flashcard("What is the equation for the electric field of a point charge using Gauss's law?", "E = (1 / 4πϵ₀) * (q / r²) * r̂", "Gauss Electric Field", ["Physics"]);

    const buckets = new Map<number, Set<Flashcard>>([
      [1, new Set([cardB])],
      [0, new Set()],
    ]);

    const updatedBuckets = update(buckets, cardB, AnswerDifficulty.Wrong);

    // --> 0
    assert.strictEqual(updatedBuckets.get(0)!.has(cardB), true);
    assert.strictEqual(updatedBuckets.get(1)!.has(cardB), false);
  });

  it("should keep the card in the same bucket if the answer was hard", () => {
    const cardC = new Flashcard("What is the formula for the gravitational force?", "F = G * (m1 * m2) / r^2", "Gravitational Force Formula", ["Physics"]);

    const buckets = new Map<number, Set<Flashcard>>([
      [1, new Set([cardC])],
      [0, new Set()],
    ]);

    const updatedBuckets = update(buckets, cardC, AnswerDifficulty.Hard);

    
    assert.strictEqual(updatedBuckets.get(1)!.has(cardC), true);
    assert.strictEqual(updatedBuckets.get(0)!.has(cardC), false);
  });
});

/*
 * Testing strategy for getHint():
 *
 * TODO: Describe your testing strategy for getHint() here.
 */
describe("getHint()", () => {
  it("returns the hint written on flashcard", () => {
    const card = new Flashcard("What is the cardinality of real numbers", "Continuum", "Cardinality of numbers", ["Math"]);
    const hint = getHint(card);

    assert.strictEqual(hint, "Cardinality of numbers", "The hint should match the flashcard's hint");
  });

  it("empty hint", () => {
    const card = new Flashcard("formula of work?", "w = fs * cos a", "", ["Physics"]);
    const hint = getHint(card);

    assert.strictEqual(hint, "", "The hint should be empty if the flashcard's hint is empty");
  });
});


/*
 * Testing strategy for computeProgress():
 *
 * TODO: Describe your testing strategy for computeProgress() here.
 */
describe("computeProgress()", () => {
  it("computes progress based on bucket distribution and answer history", () => {
    const cardA = new Flashcard("What cardinality do the real numbers have?", "Continuum", "Hint for cardinality", ["math"]);
    const cardB = new Flashcard("What is the equation for the electric field of a point charge using Gauss's law?", "E = (1 / 4πϵ₀) * (q / r²) * r̂", "Hint for Gauss", ["Physics"]);

    const buckets = new Map<number, Set<Flashcard>>([
      [0, new Set([cardA, cardB])], // Bucket 0
      [1, new Set([cardA])]          // Bucket 1
    ]);

    // history 
    const history = [
      { card: cardA, difficulty: AnswerDifficulty.Easy, day: 0 },
      { card: cardB, difficulty: AnswerDifficulty.Hard, day: 1 },
      { card: cardA, difficulty: AnswerDifficulty.Easy, day: 2 }
    ];

    const progress = computeProgress(buckets, history);

    // expected values
    const expected = {
      totalCards: 3,
      cardsPerBucket: new Map([[0, 2], [1, 1]]),
      correctRatio: 2 / 3,
      mediumRatio: 1 / 3,
      hardRatio: 0
    };

    assert.deepStrictEqual(progress, expected);
  });
});
