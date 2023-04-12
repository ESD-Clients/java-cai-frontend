import Admin from './AdminController';
import Faculty from './FacultyController';
import Student from './StudentController';
import Module from './ModuleController';
import Feedback from './FeedbackController';
import Playground from './PlaygroundController';
import Room from './RoomController';

export * as Helper from './_Helper';
export const AdminController = new Admin();
export const FacultyController = new Faculty();
export const StudentController = new Student();
export const ModuleController = new Module();
export const FeedbackController = new Feedback();
export const PlaygroundController = new Playground();
export const RoomController = new Room();