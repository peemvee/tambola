import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Sparkles, Zap, Timer } from "lucide-react";

interface NumberWheelProps {
  onNumberCalled: (number: number) => void;
  calledNumbers: number[];
  isGameActive: boolean;
  onGameStateChange: (active: boolean) => void;
  onCommentaryChange?: (commentary: string, isLoading: boolean) => void;
}

const NumberWheel = ({ onNumberCalled, calledNumbers, isGameActive, onGameStateChange, onCommentaryChange }: NumberWheelProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [finalRotation, setFinalRotation] = useState(0);
  const [selectedSegment, setSelectedSegment] = useState<number | null>(null);
  const [showExplosion, setShowExplosion] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [commentary, setCommentary] = useState('Welcome to Tambola! Spin the wheel to start with AI commentary!');
  const [isLoadingCommentary, setIsLoadingCommentary] = useState(false);
  const [isAutoSpin, setIsAutoSpin] = useState(false);
  const [autoSpinCountdown, setAutoSpinCountdown] = useState(0);
  const spinTimeoutRef = useRef<NodeJS.Timeout>();
  const autoSpinIntervalRef = useRef<NodeJS.Timeout>();
  const wheelControls = useAnimation();
  const explosionControls = useAnimation();

  // Audio context for sound effects
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [speechSynth, setSpeechSynth] = useState<SpeechSynthesis | null>(null);

  // OpenAI API Key - you can set this directly here or use environment variables
  const openaiApiKey = ""; // Add your OpenAI API key here

  // Creative Tambola phrases from the HTML file
  const creativePhrasesObj = {
    1: "Kelly's Eye, number one!",
    2: "One little duck, number two!",
    3: "Cup of tea, number three!",
    4: "Knock at the door, number four!",
    5: "Man alive, number five!",
    6: "Tom Mix, number six!",
    7: "Lucky seven!",
    8: "Garden gate, number eight!",
    9: "Doctor's orders, number nine!",
    10: "Cameron's den, number ten!",
    11: "Legs eleven!",
    12: "One dozen, number twelve!",
    13: "Unlucky for some, thirteen!",
    14: "Valentine's Day, fourteen!",
    15: "Young and keen, fifteen!",
    16: "Sweet sixteen!",
    17: "Dancing queen, seventeen!",
    18: "Coming of age, eighteen!",
    19: "Goodbye teens, nineteen!",
    20: "One score, twenty!",
    21: "Royal salute, twenty-one!",
    22: "Two little ducks, twenty-two!",
    23: "Lord of the rings, twenty-three!",
    24: "Two dozen, twenty-four!",
    25: "Duck and dive, twenty-five!",
    26: "Pick and mix, twenty-six!",
    27: "Gateway to heaven, twenty-seven!",
    28: "In a state, twenty-eight!",
    29: "Rise and shine, twenty-nine!",
    30: "Dirty Gertie, thirty!",
    31: "Get up and run, thirty-one!",
    32: "Buckle my shoe, thirty-two!",
    33: "Dirty knee, thirty-three!",
    34: "Ask for more, thirty-four!",
    35: "Jump and jive, thirty-five!",
    36: "Three dozen, thirty-six!",
    37: "More than eleven, thirty-seven!",
    38: "Christmas cake, thirty-eight!",
    39: "Those famous steps, thirty-nine!",
    40: "Life begins at forty!",
    41: "Time for fun, forty-one!",
    42: "Winnie the Pooh, forty-two!",
    43: "Down on your knee, forty-three!",
    44: "Droopy drawers, forty-four!",
    45: "Halfway there, forty-five!",
    46: "Up to tricks, forty-six!",
    47: "Four and seven, forty-seven!",
    48: "Four dozen, forty-eight!",
    49: "PC, forty-nine!",
    50: "Half a century, fifty!",
    51: "Tweak of the thumb, fifty-one!",
    52: "Danny La Rue, fifty-two!",
    53: "Stuck in the tree, fifty-three!",
    54: "Clean the floor, fifty-four!",
    55: "Snakes alive, fifty-five!",
    56: "Was she worth it?, fifty-six!",
    57: "Heinz varieties, fifty-seven!",
    58: "Make them wait, fifty-eight!",
    59: "Brighton line, fifty-nine!",
    60: "Five dozen, sixty!",
    61: "Baker's bun, sixty-one!",
    62: "Tickety-boo, sixty-two!",
    63: "Tickle me, sixty-three!",
    64: "Red raw, sixty-four!",
    65: "Old age pension, sixty-five!",
    66: "Clickety click, sixty-six!",
    67: "Made in heaven, sixty-seven!",
    68: "Saving grace, sixty-eight!",
    69: "Either way up, sixty-nine!",
    70: "Three score and ten, seventy!",
    71: "Bang on the drum, seventy-one!",
    72: "Six dozen, seventy-two!",
    73: "Queen bee, seventy-three!",
    74: "Candy store, seventy-four!",
    75: "Strive and strive, seventy-five!",
    76: "Trombones, seventy-six!",
    77: "Sunset strip, seventy-seven!",
    78: "Heaven's gate, seventy-eight!",
    79: "One more time, seventy-nine!",
    80: "Eight and blank, eighty!",
    81: "Stop and run, eighty-one!",
    82: "Straight on through, eighty-two!",
    83: "Time for tea, eighty-three!",
    84: "Seven dozen, eighty-four!",
    85: "Staying alive, eighty-five!",
    86: "Between the sticks, eighty-six!",
    87: "Torquay in Devon, eighty-seven!",
    88: "Two fat ladies, eighty-eight!",
    89: "Nearly there, eighty-nine!",
    90: "Top of the shop, ninety!"
  };

  // Get creative phrase for a number
  const getCreativePhrase = (number: number): string => {
    return creativePhrasesObj[number as keyof typeof creativePhrasesObj] || `Number ${number}!`;
  };

  // Get digit format (ones, tens)
  const getDigitFormat = (number: number): string => {
    if (number < 10) return `${number}`;
    const tens = Math.floor(number / 10);
    const ones = number % 10;
    return ones === 0 ? `${tens}, ${number}` : `${tens}, ${ones}`;
  };

  // Initialize audio context and speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        setAudioContext(ctx);
        setSpeechSynth(window.speechSynthesis);
      } catch (error) {
        console.warn('Audio context not available:', error);
      }
    }
  }, []);

  // Create spinning sound effect
  const playSpinSound = () => {
    if (!audioContext) return;

    try {
      // Create a spinning/whirring sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Start with a low frequency and increase it
      oscillator.frequency.setValueAtTime(80, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 2);
      oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 4);
      
      // Fade in and out
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
      gainNode.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 3.5);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 4);
      
      oscillator.type = 'sawtooth';
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 4);
    } catch (error) {
      console.warn('Could not play spin sound:', error);
    }
  };

  // Create winning sound effect
  const playWinSound = () => {
    if (!audioContext) return;

    try {
      // Create a celebratory chord
      const frequencies = [523.25, 659.25, 783.99]; // C, E, G notes
      
      frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5);
        
        oscillator.start(audioContext.currentTime + index * 0.1);
        oscillator.stop(audioContext.currentTime + 1.5);
      });
    } catch (error) {
      console.warn('Could not play win sound:', error);
    }
  };

  // Speak the number using Web Speech API with enhanced commentary
  const speakText = (text: string, onComplete?: () => void) => {
    if (!speechSynth || isMuted) {
      // If muted or no speech synth, call onComplete immediately
      onComplete?.();
      return;
    }

    try {
      // Cancel any ongoing speech
      speechSynth.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      
      // Find a suitable voice (prefer English voices)
      const voices = speechSynth.getVoices();
      const englishVoice = voices.find(voice => 
        voice.lang.startsWith('en') && !voice.name.includes('Google')
      ) || voices[0];
      
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
      
      // Set up event listeners
      utterance.onend = () => {
        onComplete?.();
      };
      
      utterance.onerror = () => {
        onComplete?.();
      };
      
      speechSynth.speak(utterance);
    } catch (error) {
      console.warn('Could not speak text:', error);
      onComplete?.();
    }
  };

  // Generate AI commentary using OpenAI API
  const generateAICommentary = async (number: number) => {
    const creativePhrase = getCreativePhrase(number);
    const digitFormat = getDigitFormat(number);
    const basicAnnouncement = `${creativePhrase} Number ${digitFormat}, ${number}`;
    
    setIsLoadingCommentary(true);
    
    const handleCommentaryComplete = () => {
      // Start auto-spin countdown after commentary is complete
      if (isAutoSpin && availableNumbers.length > 1) {
        setTimeout(() => startAutoSpinCountdown(), 1000); // Small delay before countdown
      }
    };
    
    if (!openaiApiKey || openaiApiKey === 'your_openai_api_key_here') {
      // Fallback commentary
      const fallbackCommentary = `${basicAnnouncement} What an exciting number, ladies and gentlemen! Keep marking your tickets!`;
      setCommentary(fallbackCommentary);
      speakText(fallbackCommentary, handleCommentaryComplete);
      setIsLoadingCommentary(false);
      return;
    }
    
    try {
      // Enhanced AI Commentary with OpenAI
      const gameStage = calledNumbers.length < 15 ? 'early' : 
                       calledNumbers.length < 45 ? 'mid' : 
                       calledNumbers.length < 75 ? 'late' : 'final';
      
      const prompt = `You are an enthusiastic Tambola (Bingo) game host with a cricket commentary style! 

IMPORTANT FORMAT RULES:
1. Start with the creative tambola phrase: "${creativePhrase}"
2. Then announce: "Number ${digitFormat}, ${number}"
3. Follow with exciting cricket-style commentary
4. Keep the energy high and dramatic!

Creative phrase: ${creativePhrase}
Number to announce: Number ${digitFormat}, ${number}
Numbers called so far: ${calledNumbers.length}/90
Game stage: ${gameStage}

Create an exciting announcement starting with "${creativePhrase}! Number ${digitFormat}, ${number}!" followed by dramatic commentary!`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an enthusiastic Tambola game host. Create exciting, dramatic announcements for each number drawn with cricket commentary style.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 200,
          temperature: 1.0
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      let aiCommentary = data.choices[0].message.content.trim();
      
      // Ensure proper format
      if (!aiCommentary.toLowerCase().includes(creativePhrase.toLowerCase())) {
        aiCommentary = `${basicAnnouncement} ${aiCommentary}`;
      }
      
      setCommentary(aiCommentary);
      speakText(aiCommentary, handleCommentaryComplete);
      
    } catch (error) {
      console.error('AI Commentary error:', error);
      const fallbackCommentary = `${basicAnnouncement} What a fantastic draw! The excitement is building!`;
      setCommentary(fallbackCommentary + ' (AI temporarily unavailable)');
      speakText(fallbackCommentary, handleCommentaryComplete);
    } finally {
      setIsLoadingCommentary(false);
    }
  };

  // Generate available numbers (1-90 that haven't been called)
  const availableNumbers = useMemo(() => 
    Array.from({length: 90}, (_, i) => i + 1)
      .filter(num => !calledNumbers.includes(num)), 
    [calledNumbers]
  );

  // Resume audio context on user interaction (required by browsers)
  const resumeAudioContext = async () => {
    if (audioContext && audioContext.state === 'suspended') {
      try {
        await audioContext.resume();
      } catch (error) {
        console.warn('Could not resume audio context:', error);
      }
    }
  };

  const spinWheel = async () => {
    if (availableNumbers.length === 0 || isSpinning) return;

    // Resume audio context for sound effects
    await resumeAudioContext();

    setIsSpinning(true);
    setCurrentNumber(null);
    setSelectedSegment(null);
    setShowExplosion(false);
    
    // Play spinning sound
    playSpinSound();
    
    // Calculate the angle per segment for available numbers
    const segmentAngle = 360 / availableNumbers.length;
    
    // Pick a random target number
    const targetIndex = Math.floor(Math.random() * availableNumbers.length);
    const targetNumber = availableNumbers[targetIndex];
    
    // Calculate target angle (pointer points to top, so we need to adjust)
    const targetAngle = -(targetIndex * segmentAngle) - (segmentAngle / 2);
    
    // Add multiple rotations for drama
    const baseRotations = 8 + Math.random() * 4; // 8-12 rotations
    const totalRotation = baseRotations * 360 + targetAngle;
    
    // Start spinning animation with crazy effects
    await wheelControls.start({
      rotate: wheelRotation + totalRotation,
      transition: {
        duration: 4,
        ease: [0.25, 0.46, 0.45, 0.94],
      }
    });
    
    setFinalRotation(wheelRotation + totalRotation);
    setWheelRotation(wheelRotation + totalRotation);
    
    // Show winning number with explosion effect
    setSelectedSegment(targetNumber);
    setCurrentNumber(targetNumber);
    setShowExplosion(true);
    
    // Play win sound and generate AI commentary
    playWinSound();
    setTimeout(() => generateAICommentary(targetNumber), 500); // Slight delay for better timing
    
    // Trigger explosion animation
    await explosionControls.start({
      scale: [1, 1.5, 1],
      rotate: [0, 360],
      transition: { duration: 0.8, ease: "easeOut" }
    });
    
    setIsSpinning(false);
    onNumberCalled(targetNumber);
    
    // Reset explosion after delay
    setTimeout(() => setShowExplosion(false), 2000);
  };

  // Auto-spin countdown and trigger
  const startAutoSpinCountdown = () => {
    setAutoSpinCountdown(6);
    
    if (autoSpinIntervalRef.current) {
      clearInterval(autoSpinIntervalRef.current);
    }
    
    autoSpinIntervalRef.current = setInterval(() => {
      setAutoSpinCountdown(prev => {
        if (prev <= 1) {
          clearInterval(autoSpinIntervalRef.current!);
          // Auto-spin the wheel
          setTimeout(() => {
            if (isAutoSpin && !isSpinning && availableNumbers.length > 0) {
              spinWheel();
            }
          }, 100);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Toggle auto-spin mode
  const toggleAutoSpin = () => {
    setIsAutoSpin(!isAutoSpin);
    if (autoSpinIntervalRef.current) {
      clearInterval(autoSpinIntervalRef.current);
      setAutoSpinCountdown(0);
    }
    
    // Start countdown if turning on auto-spin and game is not currently spinning
    // and we have a current number (meaning commentary should be finished or finishing)
    if (!isAutoSpin && !isSpinning && currentNumber && !isLoadingCommentary) {
      setTimeout(() => startAutoSpinCountdown(), 2000); // Wait a bit for any ongoing speech to finish
    }
  };

  const resetGame = () => {
    if (spinTimeoutRef.current) {
      clearTimeout(spinTimeoutRef.current);
    }
    if (autoSpinIntervalRef.current) {
      clearInterval(autoSpinIntervalRef.current);
    }
    setIsSpinning(false);
    setCurrentNumber(null);
    setWheelRotation(0);
    setFinalRotation(0);
    setSelectedSegment(null);
    setShowExplosion(false);
    setAutoSpinCountdown(0);
    setIsAutoSpin(false);
    setCommentary('Game reset! Spin the wheel to start a new exciting game with AI commentary!');
    wheelControls.stop();
    explosionControls.stop();
    onGameStateChange(true);
    
    // Cancel any ongoing speech
    if (speechSynth) {
      speechSynth.cancel();
    }
  };

  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) {
        clearTimeout(spinTimeoutRef.current);
      }
      if (autoSpinIntervalRef.current) {
        clearInterval(autoSpinIntervalRef.current);
      }
      // Stop any ongoing speech
      if (speechSynth) {
        speechSynth.cancel();
      }
      // Close audio context
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
      }
    };
  }, [speechSynth, audioContext]);

  // Notify parent about commentary changes
  useEffect(() => {
    if (onCommentaryChange) {
      onCommentaryChange(commentary, isLoadingCommentary);
    }
  }, [commentary, isLoadingCommentary, onCommentaryChange]);

  // Create wheel segments with only available numbers
  const createWheelSegments = () => {
    if (availableNumbers.length === 0) return [];
    
    const segments = [];
    const segmentAngle = 360 / availableNumbers.length;
    
    // Helper function for segment colors - truly randomized
    const getSegmentColor = (num: number, index: number) => {
      const colors = [
        { start: '#ef4444', end: '#dc2626' }, // red
        { start: '#3b82f6', end: '#2563eb' }, // blue
        { start: '#10b981', end: '#059669' }, // green
        { start: '#f59e0b', end: '#d97706' }, // yellow
        { start: '#8b5cf6', end: '#7c3aed' }, // purple
        { start: '#ec4899', end: '#db2777' }, // pink
        { start: '#06b6d4', end: '#0891b2' }, // cyan
        { start: '#84cc16', end: '#65a30d' }, // lime
        { start: '#f97316', end: '#ea580c' }, // orange
        { start: '#6366f1', end: '#4f46e5' }, // indigo
        { start: '#ef4444', end: '#b91c1c' }, // red variant
        { start: '#1d4ed8', end: '#1e3a8a' }, // blue variant
      ];
      
      // Create different patterns for better color distribution
      const pattern1 = (num * 31 + index * 17) % colors.length;
      const pattern2 = (index * 7 + num * 11) % colors.length;
      const pattern3 = ((num + index) * 19) % colors.length;
      
      // Use different patterns based on index to ensure variety
      let colorIndex;
      if (index % 3 === 0) colorIndex = pattern1;
      else if (index % 3 === 1) colorIndex = pattern2;
      else colorIndex = pattern3;
      
      return colors[colorIndex];
    };
    
    // Add gradient definitions first
    const gradientDefs = (
      <defs key="gradients">
        {availableNumbers.map((number, index) => {
          const colors = getSegmentColor(number, index);
          return (
            <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.start} stopOpacity="0.9" />
              <stop offset="100%" stopColor={colors.end} stopOpacity="0.7" />
            </linearGradient>
          );
        })}
      </defs>
    );
    
    segments.push(gradientDefs);
    
    availableNumbers.forEach((number, index) => {
      const startAngle = (index * segmentAngle - 90) * (Math.PI / 180); // -90 to start from top
      const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);
      const isSelected = selectedSegment === number;
      
      // Calculate path coordinates for wheel segments
      const outerRadius = 150;
      const innerRadius = 15; // Very small inner radius for wider ring
      const centerX = 160;
      const centerY = 160;
      
      const x1Outer = centerX + outerRadius * Math.cos(startAngle);
      const y1Outer = centerY + outerRadius * Math.sin(startAngle);
      const x2Outer = centerX + outerRadius * Math.cos(endAngle);
      const y2Outer = centerY + outerRadius * Math.sin(endAngle);
      
      const x1Inner = centerX + innerRadius * Math.cos(startAngle);
      const y1Inner = centerY + innerRadius * Math.sin(startAngle);
      const x2Inner = centerX + innerRadius * Math.cos(endAngle);
      const y2Inner = centerY + innerRadius * Math.sin(endAngle);
      
      const largeArcFlag = segmentAngle > 180 ? 1 : 0;
      
      // Create ring segment path
      const pathData = [
        `M ${x1Inner} ${y1Inner}`,
        `L ${x1Outer} ${y1Outer}`,
        `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2Outer} ${y2Outer}`,
        `L ${x2Inner} ${y2Inner}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1Inner} ${y1Inner}`,
        'Z'
      ].join(' ');
      
      // Calculate text position with multiple rings for better visibility
      const totalNumbers = availableNumbers.length;
      let textRadius;
      
      if (totalNumbers > 60) {
        // Use 3 concentric rings for many numbers
        const ringIndex = index % 3;
        textRadius = [45, 75, 105][ringIndex];
      } else if (totalNumbers > 30) {
        // Use 2 concentric rings for medium numbers
        const ringIndex = index % 2;
        textRadius = [60, 95][ringIndex];
      } else {
        // Single ring for few numbers
        textRadius = (outerRadius + innerRadius) / 2;
      }
      
      const textAngle = (startAngle + endAngle) / 2;
      const textX = centerX + textRadius * Math.cos(textAngle);
      const textY = centerY + textRadius * Math.sin(textAngle);
      
      segments.push(
        <g key={number}>
          {/* Segment Background */}
          <motion.path
            d={pathData}
            fill={`url(#gradient-${index})`}
            stroke={isSelected ? "#fbbf24" : "none"}
            strokeWidth={isSelected ? "2" : "0"}
            className={`${isSelected ? 'drop-shadow-lg' : ''}`}
            animate={{
              filter: isSelected ? "brightness(1.3)" : "brightness(1)",
            }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Number Text */}
          <motion.text
            x={textX}
            y={textY}
            textAnchor="middle"
            dominantBaseline="central"
            className={`font-bold pointer-events-none select-none ${
              availableNumbers.length > 75 ? 'text-xs' : 
              availableNumbers.length > 50 ? 'text-sm' :
              availableNumbers.length > 25 ? 'text-base' : 'text-lg'
            }`}
            fill={isSelected ? "#fbbf24" : "#ffffff"}
            stroke={isSelected ? "#92400e" : "#1f2937"}
            strokeWidth="0.5"
            animate={{
              scale: isSelected ? 1.3 : 1,
              fontWeight: isSelected ? 900 : 700,
            }}
            transition={{ duration: 0.3 }}
          >
            {number}
          </motion.text>
          
          {/* Sparkle effect for selected */}
          {isSelected && showExplosion && (
            <motion.g animate={explosionControls}>
              {[...Array(6)].map((_, i) => {
                const sparkleAngle = (i * 60) * (Math.PI / 180);
                return (
                  <motion.circle
                    key={i}
                    cx={textX}
                    cy={textY}
                    r="2"
                    fill="#fbbf24"
                    animate={{
                      x: [0, Math.cos(sparkleAngle) * 25],
                      y: [0, Math.sin(sparkleAngle) * 25],
                      opacity: [1, 0],
                      scale: [1, 0],
                    }}
                    transition={{
                      duration: 0.8,
                      delay: i * 0.1,
                      ease: "easeOut"
                    }}
                  />
                );
              })}
            </motion.g>
          )}
        </g>
      );
    });
    
    return segments;
  };

  return (
    <Card className="p-4 text-center relative overflow-hidden">
      {/* Header */}
      <motion.h3 
        className="text-lg font-bold mb-4 relative z-10"
        animate={{
          color: isSpinning ? ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"] : "#000",
        }}
        transition={{
          duration: 0.5,
          repeat: isSpinning ? Infinity : 0,
        }}
      >
        🎡 Lucky Wheel
      </motion.h3>
      
      {/* Main Wheel Container */}
      <div className="relative mx-auto mb-4" style={{ width: '320px', height: '320px' }}>
        {/* Outer Ring with Glow */}
        <motion.div 
          className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-2"
          animate={{
            boxShadow: isSpinning ? [
              "0 0 20px rgba(251, 191, 36, 0.5)",
              "0 0 40px rgba(239, 68, 68, 0.7)",
              "0 0 60px rgba(16, 185, 129, 0.5)",
              "0 0 40px rgba(245, 158, 11, 0.7)",
            ] : "0 0 10px rgba(0, 0, 0, 0.2)"
          }}
          transition={{
            duration: 0.8,
            repeat: isSpinning ? Infinity : 0,
          }}
        >
          {/* Inner Wheel Container */}
          <div className="w-full h-full rounded-full bg-gray-900 relative overflow-hidden">
            {/* SVG Wheel */}
            <motion.svg
              width="100%"
              height="100%"
              viewBox="0 0 320 320"
              className="absolute inset-0"
              animate={wheelControls}
              style={{ rotate: finalRotation }}
            >
              {createWheelSegments()}
            </motion.svg>
          </div>
        </motion.div>
        
        {/* Pointer */}
        <motion.div 
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 z-30"
          animate={{
            y: isSpinning ? [0, -5, 0] : 0,
          }}
          transition={{
            duration: 0.2,
            repeat: isSpinning ? Infinity : 0,
          }}
        >
          <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[20px] border-l-transparent border-r-transparent border-b-red-600 drop-shadow-lg" />
        </motion.div>

        {/* Victory Explosion Effect */}
        <AnimatePresence>
          {showExplosion && (
            <motion.div
              className="absolute inset-0 pointer-events-none z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-4 h-4"
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    x: Math.cos((i * 30) * Math.PI / 180) * 100,
                    y: Math.sin((i * 30) * Math.PI / 180) * 100,
                  }}
                  transition={{
                    duration: 1,
                    delay: i * 0.1,
                    ease: "easeOut",
                  }}
                >
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Current Number Display */}
      <AnimatePresence mode="wait">
        {currentNumber && (
          <motion.div
            key={currentNumber}
            initial={{ scale: 0, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: -50 }}
            className="mb-4"
          >
            <motion.div 
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-full text-2xl font-black border-4 border-white shadow-2xl relative"
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: { duration: 0.5, repeat: 3 },
                scale: { duration: 0.3, repeat: 2 },
              }}
            >
              {currentNumber}
              <motion.div
                className="absolute inset-0 rounded-full bg-white"
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.6 }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="flex gap-2 justify-center relative z-10">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={spinWheel}
            disabled={isSpinning || availableNumbers.length === 0 || (isAutoSpin && autoSpinCountdown > 0)}
            size="sm"
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold px-4 py-2 shadow-lg"
          >
            {isSpinning ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Pause className="w-4 h-4" />
                </motion.div>
                SPINNING...
              </>
            ) : autoSpinCountdown > 0 ? (
              <>
                <Timer className="w-4 h-4" />
                AUTO IN {autoSpinCountdown}s
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                {isAutoSpin ? 'AUTO SPIN' : 'MANUAL SPIN'}
              </>
            )}
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={toggleAutoSpin}
            variant={isAutoSpin ? "default" : "outline"}
            size="sm"
            className={`flex items-center gap-2 border-2 font-bold px-3 ${
              isAutoSpin 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-green-500' 
                : 'border-gray-300 hover:border-green-500'
            }`}
          >
            <Zap className="w-4 h-4" />
            {isAutoSpin ? 'AUTO ON' : 'AUTO OFF'}
          </Button>
        </motion.div>
      </div>

      {/* Game Complete */}
      {availableNumbers.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mt-4 p-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-xl text-white shadow-2xl relative z-10"
        >
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 0.5, repeat: Infinity, repeatType: "reverse" },
            }}
          >
            <p className="text-xl font-black">🎊 COMPLETE! 🎊</p>
          </motion.div>
          <p className="text-sm mt-1 opacity-90">All numbers called!</p>
        </motion.div>
      )}
    </Card>
  );
};

export default NumberWheel;
