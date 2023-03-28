// import Admin from './AdminController';
import Faculty from './FacultyController';
import Student from './StudentController';
import Module from './ModuleController';
import Message from './MessageController';
import Playground from './PlaygroundController';

export * as Helper from './_Helper';
export * as AdminController from './AdminController';
export const FacultyController = new Faculty();
export const StudentController = new Student();
export const ModuleController = new Module();
export const MessageController = new Message();
export const PlaygroundController = new Playground();