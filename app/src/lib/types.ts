export type ExamType = 'binnen' | 'see';

export interface Answer {
  key: 'a' | 'b' | 'c' | 'd';
  text: string;
}

export interface Question {
  id: number;
  text: string;
  answers: Answer[];
  correctAnswer: 'a';
  topic: string;
  hasImage?: boolean;
  imageDescription?: string;
  imagePath?: string;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  icon: string;
  exam: ExamType | 'both';
  questionIds: number[];
}

export interface QuestionProgress {
  questionId: number;
  exam: ExamType;
  correctCount: number;
  lastAnswered: string;
}

export interface TopicProgress {
  topicId: string;
  exam: ExamType;
  passed: boolean;
  totalQuestions: number;
  passedQuestions: number;
}

export interface UserProgress {
  questions: Record<string, QuestionProgress>;
  topics: Record<string, TopicProgress>;
  lastUpdated: string;
}

export interface TutorialSection {
  id: string;
  title: string;
  content: string;
  relatedTopics?: string[];
}
