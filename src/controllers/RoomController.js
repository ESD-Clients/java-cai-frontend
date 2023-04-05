
import BaseController from "./_BaseController";

class RoomController extends BaseController {

  constructor() {
    super('rooms');
  }

  subscribeFacultyRooms = (facultyId, onSnapshot) => {
    return this.collectionRef
      .where('createdBy', '==', facultyId)
      .onSnapshot(onSnapshot);
  }
}

export default RoomController;