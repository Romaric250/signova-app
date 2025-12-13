import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// App color palette
const colors = {
  primary: '#38E078',
  primaryDark: '#2BC066',
  background: '#122117',
  surface: '#1A2E23',
  surfaceLight: '#243D2E',
  text: '#FFFFFF',
  textSecondary: '#A0B8A8',
  textMuted: '#6B8B73',
  danger: '#EF4444',
  warning: '#F59E0B',
};

// Sign data structure
interface Sign {
  id: string;
  word: string;
  category: string;
  description: string;
  instructions: string[];
  imageUrl: string;
  videoUrl?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  handShape?: string;
  movement?: string;
}

// Categories
const categories = [
  { id: 'all', name: 'All', icon: 'grid' },
  { id: 'alphabet', name: 'Alphabet', icon: 'text' },
  { id: 'numbers', name: 'Numbers', icon: 'calculator' },
  { id: 'greetings', name: 'Greetings', icon: 'hand-left' },
  { id: 'family', name: 'Family', icon: 'people' },
  { id: 'emotions', name: 'Emotions', icon: 'heart' },
  { id: 'food', name: 'Food', icon: 'fast-food' },
  { id: 'colors', name: 'Colors', icon: 'color-palette' },
  { id: 'time', name: 'Time', icon: 'time' },
  { id: 'questions', name: 'Questions', icon: 'help-circle' },
  { id: 'common', name: 'Common', icon: 'star' },
];

// Sign language dictionary data with visual references
const signsData: Sign[] = [
  // Alphabet - All 26 letters
  {
    id: 'a1',
    word: 'A',
    category: 'alphabet',
    description: 'The letter A in sign language.',
    instructions: [
      'Make a fist with your dominant hand',
      'Keep your thumb resting against the side of your fist',
      'Palm faces outward',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/a.gif',
    handShape: 'Closed fist with thumb on side',
    movement: 'Static',
    difficulty: 'beginner',
  },
  {
    id: 'a2',
    word: 'B',
    category: 'alphabet',
    description: 'The letter B in sign language.',
    instructions: [
      'Hold your hand up with fingers straight and together',
      'Tuck your thumb across your palm',
      'Palm faces outward',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/b.gif',
    handShape: 'Flat hand, thumb tucked',
    movement: 'Static',
    difficulty: 'beginner',
  },
  {
    id: 'a3',
    word: 'C',
    category: 'alphabet',
    description: 'The letter C in sign language.',
    instructions: [
      'Curve your fingers and thumb to form a C shape',
      'Like you are holding a cup',
      'Palm faces to the side',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/c.gif',
    handShape: 'Curved C shape',
    movement: 'Static',
    difficulty: 'beginner',
  },
  {
    id: 'a4',
    word: 'D',
    category: 'alphabet',
    description: 'The letter D in sign language.',
    instructions: [
      'Point your index finger straight up',
      'Touch your thumb to your other fingers forming a circle',
      'Creates a "d" shape',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/d.gif',
    handShape: 'Index up, others form circle with thumb',
    movement: 'Static',
    difficulty: 'beginner',
  },
  {
    id: 'a5',
    word: 'E',
    category: 'alphabet',
    description: 'The letter E in sign language.',
    instructions: [
      'Curl all your fingers down',
      'Tuck your thumb under your fingers',
      'Like a relaxed fist with thumb tucked',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/e.gif',
    handShape: 'Curved fingers, thumb tucked under',
    movement: 'Static',
    difficulty: 'beginner',
  },
  {
    id: 'a6',
    word: 'F',
    category: 'alphabet',
    description: 'The letter F in sign language.',
    instructions: [
      'Touch your thumb and index finger together forming a circle',
      'Extend your other three fingers straight up',
      'Palm faces outward',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/f.gif',
    handShape: 'Thumb and index circle, 3 fingers up',
    movement: 'Static',
    difficulty: 'beginner',
  },
  {
    id: 'a7',
    word: 'G',
    category: 'alphabet',
    description: 'The letter G in sign language.',
    instructions: [
      'Point your index finger and thumb horizontally',
      'Keep them parallel, pointing to the side',
      'Other fingers are closed',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/g.gif',
    handShape: 'Index and thumb pointing sideways',
    movement: 'Static',
    difficulty: 'beginner',
  },
  {
    id: 'a8',
    word: 'H',
    category: 'alphabet',
    description: 'The letter H in sign language.',
    instructions: [
      'Extend your index and middle fingers together horizontally',
      'Point them to the side',
      'Thumb rests on other closed fingers',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/h.gif',
    handShape: 'Index and middle finger horizontal',
    movement: 'Static',
    difficulty: 'beginner',
  },
  {
    id: 'a9',
    word: 'I',
    category: 'alphabet',
    description: 'The letter I in sign language.',
    instructions: [
      'Make a fist with your hand',
      'Extend only your pinky finger straight up',
      'Palm faces outward',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/i.gif',
    handShape: 'Fist with pinky extended',
    movement: 'Static',
    difficulty: 'beginner',
  },
  {
    id: 'a10',
    word: 'J',
    category: 'alphabet',
    description: 'The letter J in sign language.',
    instructions: [
      'Start with the "I" handshape (pinky up)',
      'Draw the letter J in the air with your pinky',
      'Move down and curve to the left',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/j.gif',
    handShape: 'Fist with pinky extended',
    movement: 'Draw J shape in air',
    difficulty: 'beginner',
  },
  {
    id: 'a11',
    word: 'K',
    category: 'alphabet',
    description: 'The letter K in sign language.',
    instructions: [
      'Hold up your index and middle fingers in a V',
      'Place your thumb between them, touching middle finger',
      'Palm faces outward',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/k.gif',
    handShape: 'V shape with thumb between fingers',
    movement: 'Static',
    difficulty: 'beginner',
  },
  {
    id: 'a12',
    word: 'L',
    category: 'alphabet',
    description: 'The letter L in sign language.',
    instructions: [
      'Extend your thumb and index finger to form an L',
      'Keep other fingers closed in a fist',
      'Palm faces outward',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/l.gif',
    handShape: 'L shape with thumb and index',
    movement: 'Static',
    difficulty: 'beginner',
  },
  {
    id: 'a13',
    word: 'M',
    category: 'alphabet',
    description: 'The letter M in sign language.',
    instructions: [
      'Place your thumb under your first three fingers',
      'Fingers are closed over the thumb',
      'Shows three bumps for M',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/m.gif',
    handShape: 'Thumb under 3 fingers',
    movement: 'Static',
    difficulty: 'beginner',
  },
  {
    id: 'a14',
    word: 'N',
    category: 'alphabet',
    description: 'The letter N in sign language.',
    instructions: [
      'Place your thumb under your first two fingers',
      'Index and middle fingers over thumb',
      'Shows two bumps for N',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/n.gif',
    handShape: 'Thumb under 2 fingers',
    movement: 'Static',
    difficulty: 'beginner',
  },
  {
    id: 'a15',
    word: 'O',
    category: 'alphabet',
    description: 'The letter O in sign language.',
    instructions: [
      'Curve all your fingers to touch your thumb',
      'Form an O shape with your hand',
      'Like holding a small ball',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/o.gif',
    handShape: 'All fingers curved to meet thumb',
    movement: 'Static',
    difficulty: 'beginner',
  },
  {
    id: 'a16',
    word: 'P',
    category: 'alphabet',
    description: 'The letter P in sign language.',
    instructions: [
      'Like the K handshape but pointing down',
      'Index and middle finger point down',
      'Thumb between them',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/p.gif',
    handShape: 'K shape pointing downward',
    movement: 'Static',
    difficulty: 'beginner',
  },
  {
    id: 'a17',
    word: 'Q',
    category: 'alphabet',
    description: 'The letter Q in sign language.',
    instructions: [
      'Like the G handshape but pointing down',
      'Thumb and index finger point downward',
      'Other fingers closed',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/q.gif',
    handShape: 'G shape pointing downward',
    movement: 'Static',
    difficulty: 'beginner',
  },
  {
    id: 'a18',
    word: 'R',
    category: 'alphabet',
    description: 'The letter R in sign language.',
    instructions: [
      'Cross your index and middle fingers',
      'Other fingers closed in fist',
      'Palm faces outward',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/r.gif',
    handShape: 'Crossed index and middle fingers',
    movement: 'Static',
    difficulty: 'beginner',
  },
  {
    id: 'a19',
    word: 'S',
    category: 'alphabet',
    description: 'The letter S in sign language.',
    instructions: [
      'Make a fist with your hand',
      'Place your thumb across the front of your fingers',
      'Palm faces outward',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/s.gif',
    handShape: 'Fist with thumb across fingers',
    movement: 'Static',
    difficulty: 'beginner',
  },
  {
    id: 'a20',
    word: 'T',
    category: 'alphabet',
    description: 'The letter T in sign language.',
    instructions: [
      'Make a fist with your hand',
      'Place your thumb between index and middle fingers',
      'Thumb peeks out between fingers',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/t.gif',
    handShape: 'Fist with thumb between fingers',
    movement: 'Static',
    difficulty: 'beginner',
  },
  {
    id: 'a21',
    word: 'U',
    category: 'alphabet',
    description: 'The letter U in sign language.',
    instructions: [
      'Hold up your index and middle fingers together',
      'Fingers are straight and touching',
      'Other fingers closed, thumb holds them',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/u.gif',
    handShape: 'Index and middle fingers together, up',
    movement: 'Static',
    difficulty: 'beginner',
  },
  {
    id: 'a22',
    word: 'V',
    category: 'alphabet',
    description: 'The letter V in sign language.',
    instructions: [
      'Hold up your index and middle fingers spread apart',
      'Like a peace sign or victory sign',
      'Palm faces outward',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/v.gif',
    handShape: 'V shape, index and middle spread',
    movement: 'Static',
    difficulty: 'beginner',
  },
  {
    id: 'a23',
    word: 'W',
    category: 'alphabet',
    description: 'The letter W in sign language.',
    instructions: [
      'Hold up your index, middle, and ring fingers spread apart',
      'Thumb holds pinky down',
      'Three fingers form a W',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/w.gif',
    handShape: 'Three fingers spread (index, middle, ring)',
    movement: 'Static',
    difficulty: 'beginner',
  },
  {
    id: 'a24',
    word: 'X',
    category: 'alphabet',
    description: 'The letter X in sign language.',
    instructions: [
      'Make a fist and extend your index finger',
      'Bend your index finger into a hook shape',
      'Like a crooked finger',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/x.gif',
    handShape: 'Index finger hooked/bent',
    movement: 'Static',
    difficulty: 'beginner',
  },
  {
    id: 'a25',
    word: 'Y',
    category: 'alphabet',
    description: 'The letter Y in sign language.',
    instructions: [
      'Extend your thumb and pinky finger',
      'Keep other three fingers closed',
      'Like the "hang loose" or "shaka" sign',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/y.gif',
    handShape: 'Thumb and pinky extended (Y shape)',
    movement: 'Static',
    difficulty: 'beginner',
  },
  {
    id: 'a26',
    word: 'Z',
    category: 'alphabet',
    description: 'The letter Z in sign language.',
    instructions: [
      'Point your index finger',
      'Draw the letter Z in the air',
      'Move right, diagonal down-left, then right',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/z.gif',
    handShape: 'Index finger pointing',
    movement: 'Draw Z shape in air',
    difficulty: 'beginner',
  },
  // Numbers
  {
    id: 'n1',
    word: '1 (One)',
    category: 'numbers',
    description: 'The number 1 in sign language.',
    instructions: [
      'Hold up your index finger',
      'Keep other fingers in a fist',
      'Palm can face in or out',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/signjpegs/n/number01.jpg',
    handShape: 'Index finger extended',
    movement: 'Static',
    difficulty: 'beginner',
  },
  {
    id: 'n2',
    word: '2 (Two)',
    category: 'numbers',
    description: 'The number 2 in sign language.',
    instructions: [
      'Hold up your index and middle fingers',
      'Spread them apart slightly (like peace sign)',
      'Other fingers in a fist',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/signjpegs/n/number02.jpg',
    handShape: 'Index and middle finger extended',
    movement: 'Static',
    difficulty: 'beginner',
  },
  {
    id: 'n3',
    word: '3 (Three)',
    category: 'numbers',
    description: 'The number 3 in sign language.',
    instructions: [
      'Hold up your thumb, index, and middle fingers',
      'Keep ring and pinky fingers down',
      'Palm faces outward',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/signjpegs/n/number03.jpg',
    handShape: 'Thumb, index, middle extended',
    movement: 'Static',
    difficulty: 'beginner',
  },
  {
    id: 'n4',
    word: '4 (Four)',
    category: 'numbers',
    description: 'The number 4 in sign language.',
    instructions: [
      'Hold up four fingers (not thumb)',
      'Keep thumb tucked against palm',
      'Fingers spread slightly apart',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/signjpegs/n/number04.jpg',
    handShape: 'Four fingers up, thumb tucked',
    movement: 'Static',
    difficulty: 'beginner',
  },
  {
    id: 'n5',
    word: '5 (Five)',
    category: 'numbers',
    description: 'The number 5 in sign language.',
    instructions: [
      'Hold up all five fingers',
      'Spread fingers apart',
      'Palm faces outward',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/signjpegs/n/number05.jpg',
    handShape: 'All five fingers spread',
    movement: 'Static',
    difficulty: 'beginner',
  },
  // Greetings
  {
    id: 'g1',
    word: 'Hello',
    category: 'greetings',
    description: 'A friendly greeting to acknowledge someone.',
    instructions: [
      'Hold your hand flat near your forehead',
      'Palm facing outward (like a salute)',
      'Move your hand away from your head in a small arc',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/signjpegs/h/hello.jpg',
    handShape: 'Flat hand, palm out',
    movement: 'Away from forehead',
    difficulty: 'beginner',
  },
  {
    id: 'g2',
    word: 'Thank You',
    category: 'greetings',
    description: 'Express gratitude to someone.',
    instructions: [
      'Start with your flat hand touching your chin',
      'Fingertips touching your lips or chin',
      'Move your hand forward and down, like blowing a kiss',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/signjpegs/t/thankyou.jpg',
    handShape: 'Flat hand',
    movement: 'From chin, forward and down',
    difficulty: 'beginner',
  },
  {
    id: 'g3',
    word: 'Please',
    category: 'greetings',
    description: 'A polite way to make a request.',
    instructions: [
      'Place your flat hand on your chest',
      'Move your hand in a circular motion',
      'Rub your chest in a circle',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/signjpegs/p/please.jpg',
    handShape: 'Flat hand on chest',
    movement: 'Circular motion on chest',
    difficulty: 'beginner',
  },
  {
    id: 'g4',
    word: 'Sorry',
    category: 'greetings',
    description: 'Express apology or regret.',
    instructions: [
      'Make a fist with your hand (A handshape)',
      'Place it on your chest',
      'Rub in a circular motion',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/signjpegs/s/sorry.jpg',
    handShape: 'A handshape (fist)',
    movement: 'Circular on chest',
    difficulty: 'beginner',
  },
  {
    id: 'g5',
    word: 'Goodbye',
    category: 'greetings',
    description: 'A farewell greeting.',
    instructions: [
      'Open your hand with palm facing outward',
      'Fingers together, pointing up',
      'Wave by folding fingers down and up',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/signjpegs/g/goodbye.jpg',
    handShape: 'Open hand, palm out',
    movement: 'Waving motion',
    difficulty: 'beginner',
  },
  {
    id: 'g6',
    word: 'Nice to Meet You',
    category: 'greetings',
    description: 'A polite greeting when meeting someone.',
    instructions: [
      'Point index fingers at each other horizontally',
      'Bring them together so they meet',
      'Like two people meeting',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/signjpegs/m/meet.jpg',
    handShape: 'Index fingers pointing',
    movement: 'Fingers come together',
    difficulty: 'beginner',
  },
  // Family
  {
    id: 'f1',
    word: 'Mother / Mom',
    category: 'family',
    description: 'The sign for mother.',
    instructions: [
      'Open your hand with fingers spread (5 handshape)',
      'Touch your thumb to your chin',
      'Tap twice or hold',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/signjpegs/m/mother.jpg',
    handShape: '5 handshape (spread fingers)',
    movement: 'Thumb taps chin',
    difficulty: 'beginner',
  },
  {
    id: 'f2',
    word: 'Father / Dad',
    category: 'family',
    description: 'The sign for father.',
    instructions: [
      'Open your hand with fingers spread (5 handshape)',
      'Touch your thumb to your forehead',
      'Tap twice or hold',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/signjpegs/f/father.jpg',
    handShape: '5 handshape (spread fingers)',
    movement: 'Thumb taps forehead',
    difficulty: 'beginner',
  },
  {
    id: 'f3',
    word: 'Brother',
    category: 'family',
    description: 'The sign for brother.',
    instructions: [
      'Start with "Father" sign (thumb on forehead)',
      'Then bring both hands down',
      'Index fingers pointing, one on top of the other',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/signjpegs/b/brother.jpg',
    handShape: 'Compound sign',
    movement: 'Forehead then index fingers together',
    difficulty: 'intermediate',
  },
  {
    id: 'f4',
    word: 'Sister',
    category: 'family',
    description: 'The sign for sister.',
    instructions: [
      'Start with "Mother" sign (thumb on chin)',
      'Then bring both hands down',
      'Index fingers pointing, one on top of the other',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/signjpegs/s/sister.jpg',
    handShape: 'Compound sign',
    movement: 'Chin then index fingers together',
    difficulty: 'intermediate',
  },
  {
    id: 'f5',
    word: 'Family',
    category: 'family',
    description: 'The sign for family.',
    instructions: [
      'Make "F" handshapes with both hands',
      'Touch thumbs and index fingers together',
      'Circle hands outward until pinkies touch',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/signjpegs/f/family.jpg',
    handShape: 'F handshapes',
    movement: 'Circle outward',
    difficulty: 'intermediate',
  },
  // Emotions
  {
    id: 'e1',
    word: 'Happy',
    category: 'emotions',
    description: 'Express joy or happiness.',
    instructions: [
      'Place both flat hands on your chest',
      'Brush upward and outward repeatedly',
      'Show a happy expression on your face',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/signjpegs/h/happy.jpg',
    handShape: 'Flat hands',
    movement: 'Brush up and out on chest',
    difficulty: 'beginner',
  },
  {
    id: 'e2',
    word: 'Sad',
    category: 'emotions',
    description: 'Express sadness or sorrow.',
    instructions: [
      'Hold both open hands in front of your face',
      'Palms facing in',
      'Move them downward while showing sad expression',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/signjpegs/s/sad.jpg',
    handShape: 'Open hands, palms in',
    movement: 'Downward in front of face',
    difficulty: 'beginner',
  },
  {
    id: 'e3',
    word: 'I Love You',
    category: 'emotions',
    description: 'The universal ILY sign combining I, L, and Y.',
    instructions: [
      'Extend your thumb, index finger, and pinky',
      'Keep middle and ring fingers down',
      'Palm faces outward',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/signjpegs/i/iloveyou.jpg',
    handShape: 'ILY handshape',
    movement: 'Static or slight wave',
    difficulty: 'beginner',
  },
  {
    id: 'e4',
    word: 'Angry',
    category: 'emotions',
    description: 'Express anger or frustration.',
    instructions: [
      'Hold claw-shaped hand in front of face',
      'Pull hand away while tensing fingers',
      'Show angry facial expression',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/signjpegs/a/angry.jpg',
    handShape: 'Claw hand',
    movement: 'Pull away from face',
    difficulty: 'beginner',
  },
  // Common words
  {
    id: 'c1',
    word: 'Yes',
    category: 'common',
    description: 'Affirmation or agreement.',
    instructions: [
      'Make a fist (S handshape)',
      'Nod your fist up and down',
      'Like your hand is nodding "yes"',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/signjpegs/y/yes.jpg',
    handShape: 'S handshape (fist)',
    movement: 'Nodding motion',
    difficulty: 'beginner',
  },
  {
    id: 'c2',
    word: 'No',
    category: 'common',
    description: 'Negation or disagreement.',
    instructions: [
      'Extend your index and middle finger with thumb',
      'Snap them together to your thumb',
      'Like a quick pinching motion',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/signjpegs/n/no.jpg',
    handShape: 'Index, middle finger, thumb',
    movement: 'Snap together',
    difficulty: 'beginner',
  },
  {
    id: 'c3',
    word: 'Help',
    category: 'common',
    description: 'To assist or request assistance.',
    instructions: [
      'Make a thumbs up with one hand (A handshape)',
      'Place it on your flat palm of other hand',
      'Lift both hands up together',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/signjpegs/h/help.jpg',
    handShape: 'A on flat palm',
    movement: 'Lift upward together',
    difficulty: 'beginner',
  },
  {
    id: 'c4',
    word: 'Name',
    category: 'common',
    description: 'To ask or state a name.',
    instructions: [
      'Extend index and middle fingers on both hands',
      'Tap the fingers together (H handshapes)',
      'Middle finger of one hand taps other',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/signjpegs/n/name.jpg',
    handShape: 'H handshapes',
    movement: 'Tap fingers together',
    difficulty: 'beginner',
  },
  {
    id: 'c5',
    word: 'Water',
    category: 'food',
    description: 'The sign for water.',
    instructions: [
      'Make a "W" handshape (3 fingers up)',
      'Tap your index finger on your chin',
      'Tap 2-3 times',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/signjpegs/w/water.jpg',
    handShape: 'W handshape',
    movement: 'Tap chin',
    difficulty: 'beginner',
  },
  {
    id: 'c6',
    word: 'Eat / Food',
    category: 'food',
    description: 'The sign for eating or food.',
    instructions: [
      'Bring your flattened O hand to your mouth',
      'Fingertips touching together pointing at mouth',
      'Tap your lips several times',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/signjpegs/e/eat.jpg',
    handShape: 'Flattened O',
    movement: 'Tap to mouth',
    difficulty: 'beginner',
  },
  // Questions
  {
    id: 'q1',
    word: 'What',
    category: 'questions',
    description: 'Asking "what?"',
    instructions: [
      'Hold hands out with palms up',
      'Shake hands slightly side to side',
      'Furrow eyebrows (WH-question face)',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/signjpegs/w/what.jpg',
    handShape: 'Open palms up',
    movement: 'Shake side to side',
    difficulty: 'beginner',
  },
  {
    id: 'q2',
    word: 'Where',
    category: 'questions',
    description: 'Asking "where?"',
    instructions: [
      'Hold up index finger',
      'Shake it side to side',
      'Furrow eyebrows for question',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/signjpegs/w/where.jpg',
    handShape: 'Index finger up',
    movement: 'Shake side to side',
    difficulty: 'beginner',
  },
  {
    id: 'q3',
    word: 'Who',
    category: 'questions',
    description: 'Asking "who?"',
    instructions: [
      'Point index finger at your chin',
      'Circle it around your chin/mouth area',
      'Purse lips, furrow brows',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/signjpegs/w/who.jpg',
    handShape: 'Index finger',
    movement: 'Circle at chin',
    difficulty: 'beginner',
  },
  {
    id: 'q4',
    word: 'Why',
    category: 'questions',
    description: 'Asking "why?"',
    instructions: [
      'Touch your forehead with fingertips',
      'Pull away changing to Y handshape',
      'Wiggle Y hand slightly',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/signjpegs/w/why.jpg',
    handShape: 'Touch forehead, then Y',
    movement: 'Pull away, wiggle',
    difficulty: 'intermediate',
  },
  {
    id: 'q5',
    word: 'How',
    category: 'questions',
    description: 'Asking "how?"',
    instructions: [
      'Place backs of hands together, fingers down',
      'Roll hands forward until palms face up',
      'Fingers end up pointing forward',
    ],
    imageUrl: 'https://www.lifeprint.com/asl101/signjpegs/h/how.jpg',
    handShape: 'Backs of hands together',
    movement: 'Roll forward, palms up',
    difficulty: 'intermediate',
  },
];

export const DictionaryScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSign, setSelectedSign] = useState<Sign | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Filter signs based on search and category
  const filteredSigns = useMemo(() => {
    return signsData.filter((sign) => {
      const matchesSearch = sign.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sign.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || sign.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const toggleFavorite = (signId: string) => {
    setFavorites(prev => 
      prev.includes(signId) 
        ? prev.filter(id => id !== signId)
        : [...prev, signId]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return colors.primary;
      case 'intermediate': return colors.warning;
      case 'advanced': return colors.danger;
      default: return colors.textMuted;
    }
  };

  const renderSignCard = ({ item }: { item: Sign }) => (
    <TouchableOpacity
      className="rounded-xl mb-3 overflow-hidden"
      style={{ backgroundColor: colors.surface }}
      onPress={() => setSelectedSign(item)}
      activeOpacity={0.8}
    >
      <View className="flex-row">
        <Image
          source={{ uri: item.imageUrl }}
          className="w-20 h-20"
          style={{ backgroundColor: colors.surfaceLight }}
        />
        <View className="flex-1 p-3 justify-center">
          <View className="flex-row items-center justify-between">
            <Text style={{ color: colors.text }} className="text-base font-bold">
              {item.word}
            </Text>
            <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
              <Ionicons
                name={favorites.includes(item.id) ? 'heart' : 'heart-outline'}
                size={20}
                color={favorites.includes(item.id) ? colors.danger : colors.textMuted}
              />
            </TouchableOpacity>
          </View>
          <Text 
            style={{ color: colors.textSecondary }} 
            className="text-xs mt-0.5"
            numberOfLines={1}
          >
            {item.description}
          </Text>
          <View className="flex-row items-center mt-1.5">
            <View 
              className="px-2 py-0.5 rounded-full mr-2"
              style={{ backgroundColor: `${getDifficultyColor(item.difficulty)}20` }}
            >
              <Text 
                style={{ color: getDifficultyColor(item.difficulty) }} 
                className="text-[10px] capitalize"
              >
                {item.difficulty}
              </Text>
            </View>
            <Text style={{ color: colors.textMuted }} className="text-[10px] capitalize">
              {item.category}
            </Text>
          </View>
        </View>
        <View className="justify-center pr-3">
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      {/* Header */}
      <View className="px-4 pt-4 pb-2">
        <Text style={{ color: colors.text }} className="text-xl font-bold">
          Sign Dictionary
        </Text>
        <Text style={{ color: colors.textSecondary }} className="text-xs mt-0.5">
          ASL / GSL Sign Language
        </Text>
      </View>

      {/* Search Bar */}
      <View className="px-4 mt-2">
        <View 
          className="flex-row items-center rounded-xl px-3 py-2"
          style={{ backgroundColor: colors.surface }}
        >
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search signs..."
            placeholderTextColor={colors.textMuted}
            style={{ color: colors.text }}
            className="flex-1 ml-2 text-sm"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories */}
      <View className="mt-3 mb-1">
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {categories.map((category) => {
            const isSelected = selectedCategory === category.id;
            return (
              <TouchableOpacity
                key={category.id}
                className="mr-2 px-4 py-2.5 rounded-xl flex-row items-center"
                style={{ 
                  backgroundColor: isSelected ? colors.primary : colors.surface,
                  borderWidth: isSelected ? 0 : 1,
                  borderColor: colors.surfaceLight,
                }}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Ionicons 
                  name={category.icon as any} 
                  size={16} 
                  color={isSelected ? colors.background : colors.textSecondary} 
                />
                <Text 
                  style={{ color: isSelected ? colors.background : colors.text }}
                  className="text-sm font-medium ml-1.5"
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Results Count */}
      <View className="px-4 mt-3 mb-2">
        <Text style={{ color: colors.textMuted }} className="text-xs">
          {filteredSigns.length} signs found
        </Text>
      </View>

      {/* Signs List */}
      <FlatList
        data={filteredSigns}
        renderItem={renderSignCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center justify-center py-16">
            <Ionicons name="search" size={48} color={colors.textMuted} />
            <Text style={{ color: colors.textSecondary }} className="text-sm mt-3">
              No signs found
            </Text>
            <Text style={{ color: colors.textMuted }} className="text-xs mt-1">
              Try a different search term
            </Text>
          </View>
        }
      />

      {/* Sign Detail Modal */}
      <Modal
        visible={selectedSign !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedSign(null)}
      >
        {selectedSign && (
          <View style={{ flex: 1, backgroundColor: colors.background }}>
            <SafeAreaView style={{ flex: 1 }}>
              {/* Modal Header */}
              <View className="flex-row items-center justify-between px-4 py-3 border-b" style={{ borderColor: colors.surfaceLight }}>
                <TouchableOpacity onPress={() => setSelectedSign(null)}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={{ color: colors.text }} className="text-lg font-bold">
                  {selectedSign.word}
                </Text>
                <TouchableOpacity onPress={() => toggleFavorite(selectedSign.id)}>
                  <Ionicons
                    name={favorites.includes(selectedSign.id) ? 'heart' : 'heart-outline'}
                    size={24}
                    color={favorites.includes(selectedSign.id) ? colors.danger : colors.text}
                  />
                </TouchableOpacity>
              </View>

              <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Sign Image */}
                <View className="items-center justify-center p-4" style={{ backgroundColor: colors.surface }}>
                  <Image
                    source={{ uri: selectedSign.imageUrl }}
                    className="w-48 h-48"
                    style={{ backgroundColor: colors.surfaceLight }}
                    resizeMode="contain"
                  />
                </View>

                {/* Description */}
                <View className="px-4 mt-4">
                  <Text style={{ color: colors.textSecondary }} className="text-sm">
                    {selectedSign.description}
                  </Text>
                </View>

                {/* Difficulty & Category */}
                <View className="flex-row px-4 mt-3">
                  <View 
                    className="px-3 py-1 rounded-full mr-2"
                    style={{ backgroundColor: `${getDifficultyColor(selectedSign.difficulty)}20` }}
                  >
                    <Text style={{ color: getDifficultyColor(selectedSign.difficulty) }} className="text-xs capitalize">
                      {selectedSign.difficulty}
                    </Text>
                  </View>
                  <View className="px-3 py-1 rounded-full" style={{ backgroundColor: colors.surface }}>
                    <Text style={{ color: colors.textSecondary }} className="text-xs capitalize">
                      {selectedSign.category}
                    </Text>
                  </View>
                </View>

                {/* Hand Shape & Movement */}
                {(selectedSign.handShape || selectedSign.movement) && (
                  <View className="px-4 mt-4">
                    <View className="flex-row">
                      {selectedSign.handShape && (
                        <View className="flex-1 mr-2 p-3 rounded-xl" style={{ backgroundColor: colors.surface }}>
                          <View className="flex-row items-center mb-1">
                            <Ionicons name="hand-left" size={14} color={colors.primary} />
                            <Text style={{ color: colors.textMuted }} className="text-[10px] ml-1">HAND SHAPE</Text>
                          </View>
                          <Text style={{ color: colors.text }} className="text-xs">
                            {selectedSign.handShape}
                          </Text>
                        </View>
                      )}
                      {selectedSign.movement && (
                        <View className="flex-1 p-3 rounded-xl" style={{ backgroundColor: colors.surface }}>
                          <View className="flex-row items-center mb-1">
                            <Ionicons name="arrow-forward" size={14} color={colors.primary} />
                            <Text style={{ color: colors.textMuted }} className="text-[10px] ml-1">MOVEMENT</Text>
                          </View>
                          <Text style={{ color: colors.text }} className="text-xs">
                            {selectedSign.movement}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}

                {/* Instructions */}
                <View className="px-4 mt-4">
                  <Text style={{ color: colors.text }} className="text-base font-bold mb-3">
                    How to Sign "{selectedSign.word}"
                  </Text>
                  {selectedSign.instructions.map((instruction: string, index: number) => (
                    <View key={index} className="flex-row mb-3">
                      <View 
                        className="w-6 h-6 rounded-full items-center justify-center mr-3"
                        style={{ backgroundColor: colors.primary }}
                      >
                        <Text style={{ color: colors.background }} className="text-xs font-bold">
                          {index + 1}
                        </Text>
                      </View>
                      <Text style={{ color: colors.textSecondary }} className="flex-1 text-sm leading-5">
                        {instruction}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Practice Button */}
                <View className="px-4 mt-4">
                  <TouchableOpacity
                    className="py-3 rounded-xl items-center"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Text style={{ color: colors.background }} className="text-sm font-semibold">
                      Practice This Sign
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </SafeAreaView>
          </View>
        )}
      </Modal>
    </SafeAreaView>
  );
};

