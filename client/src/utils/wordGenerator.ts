// wordGenerator.ts

const adjectives = [
    "Red",
    "Happy",
    "Sunny",
    "Gentle",
    "Brave",
    "Calm",
    "Wise",
    "Energetic",
    "Cheerful",
    "Graceful",
    "Radiant",
    "Vibrant",
    "Lively",
    "Playful",
    "Clever",
    "Bold",
    "Daring",
    "Joyful",
    "Peaceful",
    "Tranquil",
    "Magical",
    "Enchanting",
    "Serene",
    "Whimsical",
    "Hopeful",
    "Majestic",
    "Mysterious",
    "Dynamic",
    "Harmonious",
    "Fantastic",
    "Charming",
    "Glorious",
    "Sparkling",
    "Inventive",
    "Inspiring",
    "Tenacious",
    "Exuberant",
    "Resilient",
    "Adventurous",
    "Unique",
    "Genuine",
    "Spirited",
    "Candid",
    "Curious",
    "Dazzling",
    "Effervescent",
    "Efficient",
    "Glowing",
    "Nurturing",
    "Optimistic",
    "Quirky",
    "Vivacious",
    "Zesty",
    "Zealous",
    "Unwavering",
    "Uplifting",
    "Pleasant",
    "Dreamy",
    "Exquisite",
    "Sincere",
    "Blissful",
    "Dynamic",
    "Epic",
    "Bountiful",
    "Jubilant",
    "Legendary",
    "Eternal",
    "Tenacious",
    "Thriving",
    "Voracious",
    "Wholesome",
    "Zippy",
    "Delightful",
    "Eclectic",
    "Fearless",
    "Grateful",
    "Hearty",
    "Ingenious",
    "Jovial",
    "Luminous",
    "Noble",
    "Omnipotent",
    "Pristine",
    "Quaint",
    "Ravishing",
    "Stellar",
    "Timeless",
    "Ubiquitous",
    "Vital",
    "Wholesome",
    "Xenial",
    "Youthful",
    "Zingy",
    "Zestful",
    "Astounding",
    "Dazzling",
    "Radiant",
    "Resplendent",
    "Wondrous",
    "Yielding",
    "Zephyr-like",
];

const nouns = [
    "Dragon",
    "Mountain",
    "River",
    "Whisper",
    "Harmony",
    "Star",
    "Meadow",
    "Ocean",
    "Mystery",
    "Journey",
    "Cascade",
    "Cascade",
    "Aurora",
    "Lagoon",
    "Eclipse",
    "Grove",
    "Cascade",
    "Horizon",
    "Serenity",
    "Labyrinth",
    "Spectacle",
    "Garden",
    "Wanderer",
    "Symphony",
    "Enigma",
    "Breeze",
    "Champion",
    "Infinity",
    "Pinnacle",
    "Discovery",
    "Eternity",
    "Ponder",
    "Infinity",
    "Pinnacle",
    "Discovery",
    "Eternity",
    "Ponder",
    "Spectacle",
    "Garden",
    "Wanderer",
    "Symphony",
    "Enigma",
    "Breeze",
    "Champion",
    "Infinity",
    "Pinnacle",
    "Discovery",
    "Eternity",
    "Ponder",
    "Aurora",
    "Lagoon",
    "Eclipse",
    "Grove",
    "Cascade",
    "Horizon",
    "Serenity",
    "Labyrinth",
    "Spectacle",
    "Garden",
    "Wanderer",
    "Symphony",
    "Enigma",
    "Breeze",
    "Champion",
    "Infinity",
    "Pinnacle",
    "Discovery",
    "Eternity",
    "Ponder",
    "Eclipse",
    "Grove",
    "Cascade",
    "Horizon",
    "Serenity",
    "Labyrinth",
    "Spectacle",
    "Garden",
    "Wanderer",
    "Symphony",
    "Enigma",
    "Breeze",
    "Champion",
    "Infinity",
    "Pinnacle",
    "Discovery",
    "Eternity",
    "Ponder",
    "Aurora",
    "Lagoon",
    "Eclipse",
    "Grove",
    "Cascade",
    "Horizon",
    "Serenity",
    "Labyrinth",
    "Spectacle",
    "Garden",
    "Wanderer",
    "Symphony",
    "Enigma",
];

export function generateAdjNounPair(): string {
    const adjectiveIndex = Math.floor(Math.random() * adjectives.length);
    const nounIndex = Math.floor(Math.random() * nouns.length);

    const uniqueName = `${adjectives[adjectiveIndex]} ${nouns[nounIndex]}`;
    return uniqueName;
}
