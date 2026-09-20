// ============================================================
// Logger — utilidad centralizada de trazabilidad para todo el
// framework. Úsala en los Page Objects (no console.log suelto)
// para poder rastrear en qué acción falló un test.
// ============================================================

export class Logger {
  private static timestamp(): string {
    return new Date().toISOString();
  }

  static info(message: string): void {
    console.log(`[INFO]  [${this.timestamp()}] ${message}`);
  }

  static warn(message: string): void {
    console.warn(`[WARN]  [${this.timestamp()}] ${message}`);
  }

  static error(message: string): void {
    console.error(`[ERROR] [${this.timestamp()}] ${message}`);
  }

  static step(stepText: string): void {
    console.log(`[STEP]  [${this.timestamp()}] ${stepText}`);
  }
}
