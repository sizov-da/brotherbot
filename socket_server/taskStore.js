const {aql} = require("arangojs");

class TaskStore {
  constructor(db) {
    this.db = db;
    this.collection = this.db.collection('tasks');
  }

  // ========== task filter limit offset function  =============

  // async findAllTasksForUser(userID) {
  //   const cursor = await this.db.query(aql`
  //     FOR task IN tasks
  //     FILTER task.userID == ${userID}
  //     RETURN task
  //   `);
  //   return cursor.all();
  // }
  /**
   * Получает список задач и отчетов с учетом parentTaskID.
   *
   * @param {string} userID - Идентификатор пользователя.
   * @param {string | null} parentTaskID - Идентификатор родительской задачи. Если null, выводятся только базовые дела и отчеты.
   * @param {number} [limit=10] - Максимальное количество элементов, которые нужно вернуть.
   * @param {number} [offset=0] - Смещение для пагинации.
   * @returns {Promise<Array>} - Массив задач и отчетов.
   */
  async findTasksAndReports(userID, parentTaskID = null, limit = 10, offset = 0) {
    const query = aql`
    FOR item IN UNION(
        FOR task IN tasks
          FILTER task.userID == ${userID}
          FILTER task.parentTaskID == (${parentTaskID} == null ? "base" : ${parentTaskID})
         
          RETURN MERGE(task, { type: "task" }),

        FOR report IN reports
          FILTER report.userID == ${userID}
          FILTER report.parentTaskID == (${parentTaskID} == null ? "unknown" : ${parentTaskID})
       
          RETURN MERGE(report, { type: "report" })
    )
    SORT item.sorting ASC
    LIMIT ${offset}, ${limit}
    RETURN item
    `;

    const result = await this.db.query(query);
    return result.all();
}

  async deleteTask(taskId) {
    console.log("#7 DELETE task taskId = ", taskId);
    const query = `FOR task IN tasks FILTER task._key == @taskId REMOVE task IN tasks`;
    await this.db.query(query, { taskId });
  }

  /**
   * Считает количество задач и отчетов с фильтрацией по parentTaskID.
   *
   * @param {string} userID - Идентификатор пользователя.
   * @param {string | null} parentTaskID - Идентификатор родительской задачи. Если null, фильтруются только базовые дела и отчеты.
   * @returns {Promise<number>} - Общее количество задач и отчетов.
   */
  async countTasksByParentTaskID(userID, parentTaskID = null) {

   // console.log("#8 tasks_count", { parentTaskID }); // Здесь вы можете использовать parentTaskID

    const query = aql`
        RETURN LENGTH(
            FOR item IN UNION(
                FOR task IN tasks
                    FILTER task.userID == ${userID}
                    FILTER task.parentTaskID == ( ${parentTaskID} == null ? "base" : ${parentTaskID})
                    RETURN task,
                FOR report IN reports
                    FILTER report.userID == ${userID}
                    FILTER report.parentTaskID == ( ${parentTaskID} == null ? "unknown" : ${parentTaskID})
                    RETURN report
            )
            RETURN item
        )
    `;

    const count = await this.db.query(query);
    return await count.next();
  }






  /**
   * Получает список задач и отчетов для пользователя с учетом лимита и смещения.
   *
   * @param {string} userID - Идентификатор пользователя, для которого нужно получить данные.
   * @param {number} [limit=10] - Максимальное количество элементов, которые нужно вернуть.
   * @param {number} [offset=0] - Смещение для пагинации.
   * @returns {Promise<Array>} - Массив задач и отчетов, объединенных в один список.
   */
  async findAllTasksForUser(userID, limit = 10, offset = 0) {
    console.log("#7 tasks_limit_offset", { limit, offset }); // Здесь вы можете использовать limit и offset
    const allTasksAndReports = await this.db.query(aql`
        FOR item IN UNION(
          FOR task IN tasks
            FILTER task.userID == ${userID}   
            RETURN MERGE(task, { type: "task" }),
          FOR report IN reports
            FILTER report.userID == ${userID}
            RETURN MERGE(report, { type: "report" })
        )
         SORT item.sorting ASC
         LIMIT ${offset}, ${limit}
        RETURN item
    `);


    // return taskslist.all();
    return allTasksAndReports.all();
  }



  /**
   * Считает общее количество задач и отчетов для пользователя.
   *
   * @param {string} userID - Идентификатор пользователя, для которого нужно подсчитать данные.
   * @returns {Promise<number>} - Общее количество задач и отчетов.
   */
  async countAllTasksForUser(userID) {
    // const count = await this.db.query(aql`
    //     RETURN LENGTH(
    //         FOR task IN tasks
    //         FILTER task.userID == ${userID}
    //         RETURN task
    //     )
    // `);

    const count = await this.db.query(aql`
        RETURN LENGTH(
            FOR item IN UNION(
                FOR task IN tasks
                    FILTER task.userID == ${userID}
                    RETURN task,
                FOR report IN reports
                    FILTER report.userID == ${userID}
                    RETURN report
            )
            RETURN item
        )
    `);
    return await count.next();
  }


  async saveTask(task) {
    // Создаем новый документ в коллекции 'tasks'
    await this.collection.save(task);
  }


  async updateTask(task) {
    try {
      const taskId = task._key;

      // Проверяем существование задачи
      const exists = await this.db.collection("tasks").documentExists(taskId);
      if (!exists) {
        throw new Error(`Задача с ID ${taskId} не найдена.`);
      }

      // Обновляем задачу
      await this.db.collection("tasks").update(taskId, task);
      console.log(`Задача ${taskId} успешно обновлена.`);
    } catch (error) {
      console.error("Ошибка при обновлении задачи:", error);
      throw error;
    }
  }

  async updateReport(report) {
    try {
      const reportId = report._key;

      // Проверяем существование отчета
      const exists = await this.db.collection("reports").documentExists(reportId);
      if (!exists) {
        throw new Error(`Отчет с ID ${reportId} не найден.`);
      }

      // Обновляем отчет
      await this.db.collection("reports").update(reportId, report);
      console.log(`Отчет ${reportId} успешно обновлен.`);
    } catch (error) {
      console.error("Ошибка при обновлении отчета:", error);
      throw error;
    }
  }


}
module.exports = { TaskStore };
