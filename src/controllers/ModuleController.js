import BaseController from "./_BaseController";
import { getCurrentTimestamp, getDocData } from "./_Helper";

class ModuleController extends BaseController {
  constructor() {
    super('modules');
  }

  subscribeList = (onSnapshot) => {
    return this.collectionRef
      .orderBy('moduleNo', 'asc')
      .onSnapshot(onSnapshot);
  }

  subscribeByRoom = (roomId, onSnapshot) => {
    return this.collectionRef
      .where('room', '==', roomId)
      .orderBy('moduleNo', 'asc')
      .onSnapshot(onSnapshot);
  }

  getModulesByFaculty = async (facultyId) => {
    var result = [];

    try {
      await this.collectionRef
        .where('createdBy', '==', facultyId)
        .where('type', '==', 'student')
        .orderBy('moduleNo', 'asc')
        .get()
        .then(res => {
          result = res.docs;
        })
    } catch (err) {
      console.error(err);
      result = [];
    }

    return result;
  }

  getModulesByRoom = async (roomId) => {
    var result = [];

    try {
      await this.collectionRef
        .where('room', '==', roomId)
        .where('type', '==', 'student')
        .orderBy('moduleNo', 'asc')
        .get()
        .then(res => {
          result = res.docs;
        })
    } catch (err) {
      console.error(err);
      result = [];
    }

    return result;
  }

  // getApprovedModules = async () => {
  //   var result = [];

  //   try {
  //     await this.collectionRef
  //       // .where('docStatus', '==', 1)
  //       .where('remarks', '==', 'approved')
  //       .orderBy('createdAt', 'asc')
  //       .get()
  //       .then(res => {
  //         result = res.docs;
  //       })
  //   } catch (err) {
  //     console.error(err);
  //     result = [];
  //   }

  //   return result;
  // }

  /** TOPICS */

  getTopics = async (moduleId) => {
    var result = [];

    try {
      await this.collectionRef
        .doc(moduleId)
        .collection('topics')
        .orderBy('createdAt', 'asc')
        .get()
        .then(res => {
          result = res.docs;
        })
    }
    catch (err) {
      console.error(err);
      result = [];
    }

    return result;
  }

  addTopic = async ({ moduleId, topic }) => {

    var result = false;

    try {
      await this.collectionRef
        .doc(moduleId)
        .collection('topics')
        .add({
          ...topic,
          createdAt: getCurrentTimestamp()
        })
        .then(res => {
          result = res.get();
        })

    } catch (err) {
      console.error(err);
      result = err;
    }

    return result;
  }

  updateTopic = async ({ moduleId, topicId, data }) => {
    var result = false;

    try {
      await this.collectionRef
        .doc(moduleId)
        .collection('topics')
        .doc(topicId)
        .update(data)
        .then(() => {
          result = {
            id: topicId
          };
        })

    } catch (err) {
      console.error(err);
      result = err;
    }

    return result;
  }

  deleteTopic = async ({ moduleId, topicId }) => {
    var result = false;

    try {
      await this.collectionRef
        .doc(moduleId)
        .collection('topics')
        .doc(topicId)
        .delete()
        .then(() => {
          result = true;
        })

    } catch (err) {
      console.error(err);
      result = err;
    }

    return result;
  }

  subscribeTopics = (moduleId, onSnapshot) => {
    return this.collectionRef
      .doc(moduleId)
      .collection('topics')
      .orderBy('createdAt', 'asc')
      .onSnapshot(onSnapshot);
  }

  /** QUESTIONS */
  getQuestions = async (moduleId) => {
    var result = [];

    try {
      await this.collectionRef
        .doc(moduleId)
        .collection('questions')
        .orderBy('createdAt', 'asc')
        .get()
        .then(res => {
          result = res.docs;
        })

    } catch (err) {
      console.error(err)
    }

    return result;
  }

  getQuestionsSortedByDifficulties = async (moduleId) => {
    var result = [];

    try {
      await this.collectionRef
        .doc(moduleId)
        .collection('questions')
        .orderBy('difficulty', 'asc')
        .get()
        .then(res => {
          result = res.docs;
        })

    } catch (err) {
      console.error(err)
    }

    return result;
  }

  subscribeQuestions = (moduleId, onSnapshot) => {
    return this.collectionRef
      .doc(moduleId)
      .collection('questions')
      .orderBy('createdAt', 'asc')
      .onSnapshot(onSnapshot);
  }

  addQuestion = async (moduleId, question) => {
    var result = false;

    try {
      await this.collectionRef
        .doc(moduleId)
        .collection('questions')
        .add({
          ...question,
          createdAt: getCurrentTimestamp()
        })
        .then(res => {
          result = res.get();
        })

    } catch (err) {
      console.error(err);
      result = err;
    }

    return result;
  }

  updateQuestion = async (moduleId, questionId, data) => {
    var result = false;

    try {
      await this.collectionRef
        .doc(moduleId)
        .collection('questions')
        .doc(questionId)
        .update(data)
        .then(() => {
          result = {
            id: questionId
          }
        })

    } catch (err) {
      console.error(err);
      result = err;
    }

    return result;
  }

  deleteQuestion = async (moduleId, questionId) => {
    var result = false;

    try {
      await this.collectionRef
        .doc(moduleId)
        .collection('questions')
        .doc(questionId)
        .delete()
        .then(() => {
          result = true;
        })

    } catch (err) {
      console.error(err);
      result = err;
    }

    return result;
  }

  /** QUIZ */
  submitQuizAnswer = async (moduleId, answers) => {

    var result = null;
    var data = {
      ...answers,
      submittedAt: getCurrentTimestamp()
    }

    try {

      await this.collectionRef
        .doc(moduleId)
        .collection('studentAnswers')
        .add(data)
        .then(res => {
          result = {
            ...data,
            id: res.id
          }
        })

    } catch (err) {
      console.error(err);
      result = err;
    }

    return result;
  }

  getQuizResult = async (moduleId, studentId) => {

    var result = null;

    try {

      await this.collectionRef
        .doc(moduleId)
        .collection('studentAnswers')
        .where('studentId', '==', studentId)
        .get()
        .then(res => {
          if(res.docs.length > 0) {
            result = getDocData(res.docs[0])
          }
        })

    } catch (err) {
      console.error(err);
      result = err;
    }

    return result;
  }

  updateQuizResult = async (moduleId, resultId, data) => {
    var result = false;

    try {

      await this.collectionRef
        .doc(moduleId)
        .collection('studentAnswers')
        .doc(resultId)
        .update(data)
        .then(() => {
          result = true;
        })

    } catch (err) {
      console.error(err);
      result = err;
    }

    return result;
  }

  /** HELPER */
  isModuleUnlocked = ({ student, lastId }) => {

    if (!lastId) {
      return true;
    }
    else {
      if (lastId && student.finishedModules.includes(lastId)) {
        return true;
      }
    }

    return false;
  }

  isModuleFinished = (student, moduleId) => {
    if (student.finishedModules.includes(moduleId)) {
      return true;
    }

    return false;
  }

}

export default ModuleController;