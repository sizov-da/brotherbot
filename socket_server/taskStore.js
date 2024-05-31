const {aql} = require("arangojs");

class TaskStore {
  constructor(db) {
    this.db = db;
    this.collection = this.db.collection('tasks');
  }

  // ========== task filter =============

  async findTasksForUser(userID) {
    const cursor = await this.db.query(aql`
      FOR task IN tasks
      FILTER task.userID == ${userID}
      RETURN task
    `);
    return cursor.all();
  }

  async saveTask(task) {
    // Создаем новый документ в коллекции 'tasks'
    await this.collection.save(task);
  }
}
module.exports = {TaskStore};
