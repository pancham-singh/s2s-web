export interface IAttachment {
  id: string;
  url: string;
  type: 'image' | 'video' | 'audio';
}

export interface IAnswer {
  id: string;
  body: number;
  isCorrect: boolean;
  attachments: IAttachment[];
  question: IQuestion;
}

export interface IQuestion {
  id: string;
  body: string;
  points: number;
  type: 'theory' | 'practical';
  attachments: IAttachment[];
  answers: IAnswer[];
  topic: ITopic;
}

export interface ITopic {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  pointsPractical: number;
  pointsTheory: number;
  module: IModule;
}

export interface IModule {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  course: {
    id: string;
  };
}

export interface ICourse {
  id: string;
  name: string;
  category: 'domain' | 'non-domain';
  description: string;
  coverImage: string;
}

export interface IPermission {
  id: string;
  name: string;
  description: string;
}

export interface IRole {
  id: string;
  name: string;
  description: string;
  permissions: IPermission[];
}

export interface IUser {
  id: string;
  email: string;
  name: string;
  roles: IRole[];
}

export interface ITrainingCenter {
  id: string;
  name: string;
  address?: string;
  incharges?: IUser[];
  pia?: IUser;
}

export interface IBatch {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  trainingCenter: ITrainingCenter;
  course: ICourse;
  students: IUser;
  teachers: IUser;
}

export interface IInvitation {
  id: string;
  token: string;
  invitedEmail: string;
  invitedBy: IUser;
  invitedAs: 'student' | 'teacher' | 'centerIncharge';
  validTill: string;
  batch: IBatch;
  trainingCenter: ITrainingCenter;
}

export interface IAssesmentTopic {
  topic: string;
  theoryCount: number;
  practicalCount: number;
}

export interface IAssesment {
  name: string;
  topics: IAssesmentTopic[];
  batch: string;
  durationMinutes: number;
  startDate: string;
  endDate: string;
}
export interface IAssesmentAnswer {
    answerId: string;
    isCorrect: boolean;
    question: string;
    body: string;
}

