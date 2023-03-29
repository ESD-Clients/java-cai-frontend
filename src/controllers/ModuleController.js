import axios from "axios";
import BaseController from "./_BaseController";
import { getCurrentTimestamp } from "./_Helper";

class ModuleController extends BaseController {
    constructor() {
        super('modules');
    }

    addTopic = async ({moduleId, topic}) => {

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

    updateTopic = async ({moduleId, topicId, data}) => {
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

    deleteTopic = async ({moduleId, topicId}) => {
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




    /** OLD */
    //QUIZ
    getQuizResult = async ({student, module}) => {
        var result = [];

        try {
            await axios.post(`${this.baseUrl}/quiz_result?student=${student}&module=${module}`)
            .then((res) => {
                result = res.data;
            })
            
            return result;
        } catch (error) {
            return error
        }
    }

    addQuizResult = async (item) => {
        var result = null;
        try {
            await axios.post(`${this.baseUrl}/quiz_result/add`, item).then((res) => {
                result = res.data;
            });
            return result;
        } catch (err) {
            return err;
        }
    }

    //QUESTIONS
    getQuestions = async ({type, module}) => {
        var result = [];

        try {
            await axios.post(`${this.baseUrl}/questions?module=${module}&type=${type}`)
            .then((res) => {
                result = res.data;
            })
            
            return result;
        } catch (error) {
            return error
        }
    }

    addQuestion = async (item) => {
        var result = null;

        try {
            await axios.post(`${this.baseUrl}/questions/add`, item).then((res) => {
                result = res.data;
            });

            return result;

        } catch (err) {

            return err;
        }
    }

    getModulesByNumber = async (number) => {
        var result = [];

        try {
            await axios.post(`${this.baseUrl}/index`, {
                condition: [
                    ['status', 1],
                    ['number', number]
                ]
            })
            .then((res) => {
                result = res.data;
            })
            return result;
        } catch (err) {
            return err;
        }
    }

    getApprovedModules = async () => {
        var result = [];

        try {
            await axios.post(`${this.baseUrl}/index`, {
                condition: [
                    ['status', 1],
                    ['remarks', 'approved']
                ]
            }).then((res) => {
                result = res.data;
            });
            return result;
        } catch (err) {
            return err;
        }
    }

    getUnapprovedModules = async () => {
        var result = [];

        try {
            await axios.post(`${this.baseUrl}/index`, {
                condition: [
                    ['status', 1],
                    ['remarks', '<>','approved']
                ]
            }).then((res) => {
                result = res.data;
            });
            return result;
        } catch (err) {
            return err;
        }
    }
}

export default ModuleController;