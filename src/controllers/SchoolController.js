import BaseController from "./_BaseController";
import { Helper } from "./_Controllers";
import { getDocData } from "./_Helper";

class SchoolController extends BaseController {
    constructor() {
        super('schools');
    }

    register = async (item) => {

      var result = null;

      try {
          item.schoolNo = Helper.padIdNo(await this.getIncrementId());
          item.docStatus = 1;
          result = await this.store(item);
      } catch (err) {
          console.error(err);
          result = err;
      }

      return result;
  }

  getSchoolByCode = async (schoolNo) => {
    var result = null;

    try {
        await this.collectionRef
                .where('schoolNo', '==', schoolNo)
                .get()
                .then(res => {
                    if(res.docs.length > 0) {
                        result = getDocData(res.docs[0]);
                    }
                })
    } catch (err) {
        console.error(err);
        result = err;
    }

    return result;
  }
}

export default SchoolController;