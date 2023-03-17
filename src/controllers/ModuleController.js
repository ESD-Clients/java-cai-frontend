import axios from "axios";
import BaseController from "./_BaseController";

class ModuleController extends BaseController {
    constructor() {
        super('module');
    }

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