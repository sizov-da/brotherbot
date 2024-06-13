const {aql} = require("arangojs");

class TaskStore {
  constructor(db) {
    this.db = db;
    this.collection = this.db.collection('tasks');
  }

  // ========== task filter limit offset function  =============

  async findAllTasksForUser(userID) {
    const cursor = await this.db.query(aql`
      FOR task IN tasks
      FILTER task.userID == ${userID}
      RETURN task
    `);
    return cursor.all();
  }
  async findTasksForUser( userID, limit = 10, offset = 0) {
    console.log("#7 tasks_limit_offset", { limit, offset }); // Здесь вы можете использовать limit и offset
    const taskslist = await this.db.query(aql`
      FOR task IN tasks
          FILTER task.userID == ${userID}
          SORT task._key ASC
          LIMIT ${offset}, ${limit}
          RETURN task
    `);


    return taskslist.all();
  }
  async countTasksForUser(userID) {
    const count = await this.db.query(aql`
        RETURN LENGTH(
            FOR task IN tasks
            FILTER task.userID == ${userID}
            RETURN task
        )
    `);
    return await count.next();
  }


  async saveTask(task) {
    // Создаем новый документ в коллекции 'tasks'
    await this.collection.save(task);
  }
}
module.exports = { TaskStore };
