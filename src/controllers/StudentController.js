import axios from "axios";
import BaseController from "./_BaseController";

class StudentController extends BaseController {
    constructor() {
        super('student');
    }

    getListByProgress = async ({progress}) => {
        var result = [];

        try {
            await axios.post(`${this.baseUrl}/index`, {
                condition: [
                    ['progress', progress]
                ]
            })
            .then((res) => {
                result = res.data;
            })

        } catch (error) {
            result = []
        }

        return result;
    }

    authenticate = async ({email, password}) => {
        var result = null;

        try {
            await axios.post(`${this.baseUrl}/authenticate?email=${email}&password=${password}`,{})
            .then((res) => {
                result = res.data;
            })
        } catch (error) {
            result = error
        }

        return result;
    }
}

export default StudentController;