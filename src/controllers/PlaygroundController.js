import axios from "axios";
import BaseController from "./_BaseController";

class PlaygroundController extends BaseController {
    constructor() {
        super('playground');
    }

    execute = async (data) => {
        var result = null;

        try {
            await axios.post(`${this.baseUrl}/execute`, data)
            .then((res) => {
                result = res.data;
            })
            
            return result;
        } catch (error) {
            return error
        }
    }
}

export default PlaygroundController;