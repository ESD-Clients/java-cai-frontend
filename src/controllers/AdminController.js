import axios from "axios";
import BaseController from "./_BaseController";

class AdminController extends BaseController{
    constructor() {
        super('admin');
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

export default AdminController;