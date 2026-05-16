export const PRIORITY_LABEL = { HIGH: 'Срочно', MEDIUM: 'Средне', LOW: 'Низкий' } as const
export const DIFFICULTY_LABEL = { EASY: 'Лёгкая', MEDIUM: 'Средняя', HARD: 'Сложная' } as const
export const DURATIONS = { EASY: 'до 15 мин', MEDIUM: '15–60 мин', HARD: 'больше часа' } as const

export type Priority = 'HIGH' | 'MEDIUM' | 'LOW'
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD'
