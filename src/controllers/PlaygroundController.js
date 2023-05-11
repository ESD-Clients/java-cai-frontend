import axios from "axios";
import BaseController from "./_BaseController";
import QueryString from "qs";

class PlaygroundController extends BaseController {
    constructor() {
        super('playground');
    }

    execute = async (codes, input) => {
        var result = null;

        try {
            let data = QueryString.stringify({
                'code': codes,
                'language': 'java',
                'input': input
              });
          
              let config = {
                method: 'post',
                url: 'https://api.codex.jaagrav.in',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: data
              };
          
              await axios(config)
                .then(function (response) {
                  result = response.data;
                })
          
        } catch (error) {
            result = {
                error
            }
        }

        return result;
    }
}

export default PlaygroundController;