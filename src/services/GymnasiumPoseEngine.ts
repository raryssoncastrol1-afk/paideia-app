/**
 * Estrutura de Landmark da Pose humana (MediaPipe 33 keypoints)
 */
export interface PoseLandmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export type ExerciseState = 'UP' | 'DOWN';

/**
 * Calculador de ângulos anatômicos entre 3 articulações (A -> B -> C)
 * Ex: Ombro (A) -> Cotovelo (B) -> Pulso (C)
 */
export function calculateJointAngle(a: PoseLandmark, b: PoseLandmark, c: PoseLandmark): number {
  const radians =
    Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180.0) {
    angle = 360.0 - angle;
  }
  return angle;
}

/**
 * Motor de Detecção de Repetições de Calistenia para o Gymnasium
 */
export class GymnasiumPoseEngine {
  private state: ExerciseState = 'UP';
  private repCount: number = 0;
  private currentExercise: 'PUSHUPS' | 'SQUATS' | 'ABS' = 'PUSHUPS';

  constructor(exercise: 'PUSHUPS' | 'SQUATS' | 'ABS') {
    this.currentExercise = exercise;
  }

  public getReps(): number {
    return this.repCount;
  }

  public reset(): void {
    this.repCount = 0;
    this.state = 'UP';
  }

  /**
   * Processa os 33 landmarks retornados pelo MediaPipe no frame atual
   * Índices MediaPipe:
   * 11: Ombro Esq, 12: Ombro Dir
   * 13: Cotovelo Esq, 14: Cotovelo Dir
   * 15: Pulso Esq, 16: Pulso Dir
   * 23: Quadril Esq, 24: Quadril Dir
   * 25: Joelho Esq, 26: Joelho Dir
   * 27: Tornozelo Esq, 28: Tornozelo Dir
   */
  public processFrame(landmarks: PoseLandmark[]): { reps: number; state: ExerciseState; angle: number } {
    if (!landmarks || landmarks.length < 33) {
      return { reps: this.repCount, state: this.state, angle: 0 };
    }

    let angle = 0;

    switch (this.currentExercise) {
      case 'PUSHUPS': {
        // Ângulo do cotovelo esquerdo (Ombro: 11, Cotovelo: 13, Pulso: 15)
        angle = calculateJointAngle(landmarks[11], landmarks[13], landmarks[15]);
        
        // Fase de descida: cotovelo flexionado a <= 90 graus
        if (angle <= 90 && this.state === 'UP') {
          this.state = 'DOWN';
        }
        // Fase de subida completa: cotovelo estendido a >= 160 graus
        else if (angle >= 160 && this.state === 'DOWN') {
          this.state = 'UP';
          this.repCount += 1;
        }
        break;
      }

      case 'SQUATS': {
        // Ângulo do joelho esquerdo (Quadril: 23, Joelho: 25, Tornozelo: 27)
        angle = calculateJointAngle(landmarks[23], landmarks[25], landmarks[27]);

        // Fase de agachamento profundo: joelho <= 95 graus
        if (angle <= 95 && this.state === 'UP') {
          this.state = 'DOWN';
        }
        // Fase de extensão em pé: joelho >= 165 graus
        else if (angle >= 165 && this.state === 'DOWN') {
          this.state = 'UP';
          this.repCount += 1;
        }
        break;
      }

      case 'ABS': {
        // Ângulo do tronco (Ombro: 11, Quadril: 23, Joelho: 25)
        angle = calculateJointAngle(landmarks[11], landmarks[23], landmarks[25]);

        // Fase de contração abdominal: tronco <= 100 graus
        if (angle <= 100 && this.state === 'UP') {
          this.state = 'DOWN';
        }
        // Fase de extensão deitado: tronco >= 150 graus
        else if (angle >= 150 && this.state === 'DOWN') {
          this.state = 'UP';
          this.repCount += 1;
        }
        break;
      }
    }

    return { reps: this.repCount, state: this.state, angle };
  }
}
