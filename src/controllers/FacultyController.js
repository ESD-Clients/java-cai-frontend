import axios from "axios";
import BaseController from "./_BaseController";

class FacultyController extends BaseController {
    constructor() {
        super('faculty');
    }

    authenticate = async ({email, password}) => {
        var result = null;

        try {
            await axios.post(`${this.baseUrl}/authenticate?email=${email}&password=${password}`,{})
            .then((res) => {
                result = res.data;
            })
            
            return result;
        } catch (error) {
            return error
        }
    }
}

export default FacultyController;