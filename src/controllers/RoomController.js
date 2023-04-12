
import BaseController from "./_BaseController";
import { getCurrentTimestamp, getDocData } from "./_Helper";

class RoomController extends BaseController {

  constructor() {
    super('rooms');
  }

  subscribeFacultyRooms = (facultyId, onSnapshot) => {
    return this.collectionRef
      .where('createdBy', '==', facultyId)
      .onSnapshot(onSnapshot);
  }

  subscribeList = (onSnapshot) => {
    return this.collectionRef
      .orderBy('createdAt', 'asc')
      .onSnapshot(onSnapshot);
  }

  
  destroy = async (roomId) => {
    var result = false;

    try {

      var documentRef = this.collectionRef.doc(roomId);

      // Delete activities
      await documentRef
        .collection('subcollection')
        .get()
        .then( async activities => {
          activities.docs.forEach(async (activity) => {
            await this.destroyActivity(roomId, activity.id)
          });
        })

      // Delete the room
      await documentRef.delete();

      result = true;
    }
    catch (err) {
        console.error(err);
        result = err;
    }

    return result;
  }

  destroyActivity  = async (roomId, activityId) => {
    var result = false;

    try {
      var activityCollectionRef = this.collectionRef
      .doc(roomId)
      .collection('activities')
      .doc(activityId);
      
      await activityCollectionRef
        .get()
        .then(async activity => {

          //Delete student works
          await activityCollectionRef
            .collection('studentWorks')
            .get()
            .then(async studentWorks => {

              studentWorks.docs.forEach(async (work) => {
                await work.ref.delete();
              })
            })
          
          //Delete activity
          await activity.ref.delete();

          result = true;
        })

    } catch (err) {
      console.error(err)
      result = err;
    }

    return result;
  }

  /** Activity */

  subscribeActivities = (roomId, onSnapshot) => {
    return this.collectionRef
      .doc(roomId)
      .collection('activities')
      .orderBy('createdAt', 'asc')
      .onSnapshot(onSnapshot)
  }

  getActivity = async (roomId, activityId) => {

    var result = null;

    await this.collectionRef
      .doc(roomId)
      .collection('activities')
      .doc(activityId)
      .get()
      .then( res => {
        if(res.exists) {
          result = getDocData(res);
        }
      })

    return result;
  }

  createAcvitity = async (roomId, data) => {
    var result = false;

    try {
        await this.collectionRef
            .doc(roomId)
            .collection('activities')
            .add({
                ...data,
                createdAt: getCurrentTimestamp()
            })
            .then(() => {
                result = true;
            })

    } catch (err) {
        console.error(err);
        result = false;
    }

    return result;
  }

  updateActivity = async (roomId, activityId, data) => {

    var result = null;

    await this.collectionRef
      .doc(roomId)
      .collection('activities')
      .doc(activityId)
      .update(data)
      .then( async () => {
        result = await this.getActivity(activityId);
      })

    return result;
  }

  getStudentWork = async (roomId, activityId, studentId) => {
    var result = null;

    try {
      await this.collectionRef
      .doc(roomId)
      .collection('activities')
      .doc(activityId)
      .collection('studentWorks')
      .where('studentId', '==', studentId)
      .get()
      .then(res => {
        if(res.docs.length > 0) {
          result = getDocData(res.docs[0]);
        }
      })

    } catch (error) {
      console.error(error)
    }

    return result;
  }

  submitWork = async (roomId, activityId, work) => {

    var result = false;

    var data = {
      ...work,
      submittedAt: getCurrentTimestamp()
    }

    try {
      await this.collectionRef
      .doc(roomId)
      .collection('activities')
      .doc(activityId)
      .collection('studentWorks')
      .add(data)
      .then(async res => {
        result = {
          ...data,
          id: res.id,
        };
      })

    } catch (error) {
      console.error(error)
    }

    return result;
  }

  checkWork = async (roomId, activityId, workId, score) => {
    var result = false;


    try {
      await this.collectionRef
        .doc(roomId)
        .collection('activities')
        .doc(activityId)
        .collection('studentWorks')
        .doc(workId)
        .update({
          score: score
        })
        .then(() => {
          result = true
        })

    } catch (error) {
      console.error(error)
    }

    return result;
  }

  subscribeActivityWorks = (roomId, activityId, onSnapshot) => {
    return this.collectionRef
      .doc(roomId)
      .collection('activities')
      .doc(activityId)
      .collection('studentWorks')
      .onSnapshot(onSnapshot);
  }

}

export default RoomController;