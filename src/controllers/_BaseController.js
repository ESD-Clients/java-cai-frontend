import axios from "axios";
import config from "../config.json";

class BaseController {
  constructor(url) {
    this.baseUrl = `${config.host}/api/${url}`;
  }

  getList = async () => {
    var result = [];

    try {
      await axios
        .get(`${this.baseUrl}/list`)
        .then((res) => {
          result = res.data;
        });

      return result;
    } catch (err) {
      return err;
    }
  };

  getActiveList = async () => {
    var result = [];

    try {
      await axios.post(`${this.baseUrl}/index`, {
        condition: [
          ['status', 1]
        ]
      })
        .then((res) => {
          result = res.data;
        })

    } catch (error) {
      result = error
    }

    return result;
  }

  get = async (id) => {
    var result = null;

    try {
      await axios.get(`${this.baseUrl}/${id}`).then((res) => {
        result = res.data;
      });

      return result;
    } catch (err) {
      return err;
    }
  };

  store = async (item) => {
    var result = null;

    try {
      await axios.post(this.baseUrl, item).then((res) => {
        result = res.data;
      });
      return result;
    } catch (err) {
      return err;
    }
  };

  update = async (id, item) => {
    var result = null;

    try {
      await axios.post(`${this.baseUrl}/${id}`, item).then((res) => {
        result = res.data;
      });
      return result;
    } catch (err) {
      return err;
    }
  };

  destroy = async (id) => {
    var result = false;

    try {
      await axios.delete(`${this.baseUrl}/${id}`).then((res) => {
        result = res.data;
      });
      return result;
    } catch (err) {
      return err;
    }
  };
}

export default BaseController;
