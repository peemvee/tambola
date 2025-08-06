export type TambolaTicket = (number | null)[][];

export interface TicketGenerationOptions {
  numberOfTickets: number;
  ticketsPerSheet: number;
}

export class TambolaTicketGenerator {
  /**
   * Generate a single valid Tambola ticket
   * 9x3 grid with exactly 5 numbers and 4 blanks per row
   * Column rules: Col 1 (1-10), Col 2 (11-20), ..., Col 9 (81-90)
   */
  static generateSingleTicket(): TambolaTicket {
    const ticket: TambolaTicket = [
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null]
    ];

    // Column ranges
    const columnRanges = [
      [1, 10],   // Column 1: 1-10
      [11, 20],  // Column 2: 11-20
      [21, 30],  // Column 3: 21-30
      [31, 40],  // Column 4: 31-40
      [41, 50],  // Column 5: 41-50
      [51, 60],  // Column 6: 51-60
      [61, 70],  // Column 7: 61-70
      [71, 80],  // Column 8: 71-80
      [81, 90]   // Column 9: 81-90
    ];

    // For each column, generate numbers and distribute them across rows
    for (let col = 0; col < 9; col++) {
      const [min, max] = columnRanges[col];
      const availableNumbers = Array.from({ length: max - min + 1 }, (_, i) => min + i);
      
      // Shuffle the available numbers
      this.shuffleArray(availableNumbers);
      
      // Determine how many numbers to place in this column (1-3 numbers)
      const numbersToPlace = Math.min(3, Math.floor(Math.random() * 3) + 1);
      
      // Select random rows for this column
      const selectedRows = this.getRandomRows(numbersToPlace);
      
      // Place numbers in selected rows
      for (let i = 0; i < numbersToPlace; i++) {
        ticket[selectedRows[i]][col] = availableNumbers[i];
      }
    }

    // Ensure each row has exactly 5 numbers
    this.balanceTicketRows(ticket, columnRanges);
    
    // Sort numbers in each column
    this.sortColumnsInTicket(ticket);

    return ticket;
  }

  /**
   * Generate multiple tickets
   */
  static generateMultipleTickets(options: TicketGenerationOptions): TambolaTicket[] {
    const tickets: TambolaTicket[] = [];
    
    for (let i = 0; i < options.numberOfTickets; i++) {
      tickets.push(this.generateSingleTicket());
    }
    
    return tickets;
  }

  /**
   * Generate tickets organized in sheets
   */
  static generateTicketSheets(options: TicketGenerationOptions): TambolaTicket[][] {
    const allTickets = this.generateMultipleTickets(options);
    const sheets: TambolaTicket[][] = [];
    
    for (let i = 0; i < allTickets.length; i += options.ticketsPerSheet) {
      const sheet = allTickets.slice(i, i + options.ticketsPerSheet);
      sheets.push(sheet);
    }
    
    return sheets;
  }

  /**
   * Validate if a ticket follows Tambola rules
   */
  static validateTicket(ticket: TambolaTicket): boolean {
    // Check grid size
    if (ticket.length !== 3 || ticket[0].length !== 9) {
      return false;
    }

    // Check each row has exactly 5 numbers
    for (let row = 0; row < 3; row++) {
      const numbersInRow = ticket[row].filter(cell => cell !== null).length;
      if (numbersInRow !== 5) {
        return false;
      }
    }

    // Check column ranges
    const columnRanges = [
      [1, 10], [11, 20], [21, 30], [31, 40], [41, 50],
      [51, 60], [61, 70], [71, 80], [81, 90]
    ];

    for (let col = 0; col < 9; col++) {
      const [min, max] = columnRanges[col];
      for (let row = 0; row < 3; row++) {
        const value = ticket[row][col];
        if (value !== null && (value < min || value > max)) {
          return false;
        }
      }
    }

    // Check for duplicate numbers
    const allNumbers = ticket.flat().filter(n => n !== null);
    const uniqueNumbers = new Set(allNumbers);
    if (allNumbers.length !== uniqueNumbers.size) {
      return false;
    }

    return true;
  }

  // Helper methods
  private static shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  private static getRandomRows(count: number): number[] {
    const rows = [0, 1, 2];
    this.shuffleArray(rows);
    return rows.slice(0, count).sort();
  }

  private static balanceTicketRows(ticket: TambolaTicket, columnRanges: number[][]): void {
    for (let row = 0; row < 3; row++) {
      let numbersInRow = ticket[row].filter(cell => cell !== null).length;
      
      // If row has fewer than 5 numbers, add more
      while (numbersInRow < 5) {
        const emptyCols = ticket[row]
          .map((cell, index) => cell === null ? index : -1)
          .filter(index => index !== -1);
        
        if (emptyCols.length === 0) break;
        
        const randomCol = emptyCols[Math.floor(Math.random() * emptyCols.length)];
        const [min, max] = columnRanges[randomCol];
        
        // Find a number not already in the ticket
        let availableNumbers = Array.from({ length: max - min + 1 }, (_, i) => min + i);
        const usedNumbers = ticket.flat().filter(n => n !== null);
        availableNumbers = availableNumbers.filter(n => !usedNumbers.includes(n));
        
        if (availableNumbers.length > 0) {
          ticket[row][randomCol] = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
          numbersInRow++;
        } else {
          break;
        }
      }
      
      // If row has more than 5 numbers, remove some
      while (numbersInRow > 5) {
        const filledCols = ticket[row]
          .map((cell, index) => cell !== null ? index : -1)
          .filter(index => index !== -1);
        
        if (filledCols.length === 0) break;
        
        const randomCol = filledCols[Math.floor(Math.random() * filledCols.length)];
        ticket[row][randomCol] = null;
        numbersInRow--;
      }
    }
  }

  private static sortColumnsInTicket(ticket: TambolaTicket): void {
    for (let col = 0; col < 9; col++) {
      const columnNumbers = ticket.map(row => row[col]).filter(n => n !== null) as number[];
      columnNumbers.sort((a, b) => a - b);
      
      let numIndex = 0;
      for (let row = 0; row < 3; row++) {
        if (ticket[row][col] !== null) {
          ticket[row][col] = columnNumbers[numIndex++];
        }
      }
    }
  }
}
