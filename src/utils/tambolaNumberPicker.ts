export interface NumberCall {
  number: number;
  timestamp: Date;
  callIndex: number;
}

export interface NumberPickerState {
  calledNumbers: number[];
  currentNumber: number | null;
  availableNumbers: number[];
  isActive: boolean;
  callHistory: NumberCall[];
}

export class TambolaNumberPicker {
  private state: NumberPickerState;
  private listeners: Array<(state: NumberPickerState) => void> = [];

  constructor() {
    this.state = this.getInitialState();
  }

  private getInitialState(): NumberPickerState {
    return {
      calledNumbers: [],
      currentNumber: null,
      availableNumbers: Array.from({ length: 90 }, (_, i) => i + 1),
      isActive: true,
      callHistory: []
    };
  }

  /**
   * Pick a random number from available numbers
   */
  pickRandomNumber(): number | null {
    if (this.state.availableNumbers.length === 0) {
      this.state.isActive = false;
      this.notifyListeners();
      return null;
    }

    // Pick random number
    const randomIndex = Math.floor(Math.random() * this.state.availableNumbers.length);
    const pickedNumber = this.state.availableNumbers[randomIndex];

    // Update state
    this.state.currentNumber = pickedNumber;
    this.state.calledNumbers.push(pickedNumber);
    this.state.availableNumbers = this.state.availableNumbers.filter(n => n !== pickedNumber);
    
    // Add to history
    const call: NumberCall = {
      number: pickedNumber,
      timestamp: new Date(),
      callIndex: this.state.calledNumbers.length
    };
    this.state.callHistory.push(call);

    // Check if game is complete
    if (this.state.availableNumbers.length === 0) {
      this.state.isActive = false;
    }

    this.notifyListeners();
    return pickedNumber;
  }

  /**
   * Get the current game state
   */
  getState(): NumberPickerState {
    return { ...this.state };
  }

  /**
   * Reset the game
   */
  reset(): void {
    this.state = this.getInitialState();
    this.notifyListeners();
  }

  /**
   * Get numbers by range for display purposes
   */
  getNumbersByRange(): { [key: string]: number[] } {
    const ranges = {
      '1-18': [],
      '19-36': [],
      '37-54': [],
      '55-72': [],
      '73-90': []
    };

    this.state.calledNumbers.forEach(num => {
      if (num <= 18) ranges['1-18'].push(num);
      else if (num <= 36) ranges['19-36'].push(num);
      else if (num <= 54) ranges['37-54'].push(num);
      else if (num <= 72) ranges['55-72'].push(num);
      else ranges['73-90'].push(num);
    });

    return ranges;
  }

  /**
   * Get recent calls (last N numbers)
   */
  getRecentCalls(count: number = 5): NumberCall[] {
    return this.state.callHistory.slice(-count).reverse();
  }

  /**
   * Check if a number has been called
   */
  isNumberCalled(number: number): boolean {
    return this.state.calledNumbers.includes(number);
  }

  /**
   * Get game statistics
   */
  getGameStats() {
    return {
      totalCalled: this.state.calledNumbers.length,
      remaining: this.state.availableNumbers.length,
      progressPercentage: (this.state.calledNumbers.length / 90) * 100,
      isComplete: !this.state.isActive && this.state.availableNumbers.length === 0,
      averageCallTime: this.calculateAverageCallTime(),
      gameStartTime: this.state.callHistory[0]?.timestamp || null,
      lastCallTime: this.state.callHistory[this.state.callHistory.length - 1]?.timestamp || null
    };
  }

  private calculateAverageCallTime(): number {
    if (this.state.callHistory.length < 2) return 0;
    
    let totalTime = 0;
    for (let i = 1; i < this.state.callHistory.length; i++) {
      const timeDiff = this.state.callHistory[i].timestamp.getTime() - 
                      this.state.callHistory[i - 1].timestamp.getTime();
      totalTime += timeDiff;
    }
    
    return totalTime / (this.state.callHistory.length - 1);
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: (state: NumberPickerState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }

  /**
   * Get number call announcement text
   */
  getNumberAnnouncement(number: number): string {
    const announcements: { [key: number]: string } = {
      1: "Kelly's Eye, Number One",
      2: "One Little Duck, Number Two", 
      3: "Cup of Tea, Number Three",
      4: "Knock at the Door, Number Four",
      5: "Man Alive, Number Five",
      6: "Tom Mix, Number Six",
      7: "Lucky Seven",
      8: "Garden Gate, Number Eight",
      9: "Doctor's Orders, Number Nine",
      10: "Prime Minister's Den, Number Ten",
      11: "Legs Eleven",
      12: "One Dozen, Number Twelve",
      13: "Unlucky for Some, Thirteen",
      14: "Valentine's Day, Fourteen",
      15: "Young and Keen, Fifteen",
      16: "Sweet Sixteen",
      17: "Dancing Queen, Seventeen", 
      18: "Coming of Age, Eighteen",
      19: "Goodbye Teens, Nineteen",
      20: "One Score, Twenty",
      21: "Royal Salute, Twenty One",
      22: "Two Little Ducks, Twenty Two",
      30: "Dirty Gerdie, Thirty",
      33: "All the Threes, Thirty Three",
      40: "Life Begins at Forty",
      44: "All the Fours, Forty Four",
      50: "Half Century, Fifty",
      55: "Snakes Alive, Fifty Five",
      60: "Three Score, Sixty",
      66: "Clickety Click, Sixty Six",
      70: "Three Score and Ten, Seventy",
      77: "Sunset Strip, Seventy Seven",
      80: "Eight and Blank, Eighty",
      88: "Two Fat Ladies, Eighty Eight",
      90: "Top of the Shop, Ninety"
    };

    return announcements[number] || `Number ${number}`;
  }
}
