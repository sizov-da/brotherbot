const { Database } = require("arangojs");

class DatabaseInitializer {
    constructor() {
        this.db = new Database({
            url: "http://45.80.70.119:8529",
            databaseName: "brobot",
            auth: {
                username: "root",
                password: "rootpassword",
            },
        });
    }

    getDb() {
        return this.db;
    }
    /**
     * Инициализирует коллекции в базе данных.
     * Проверяет существование каждой коллекции из списка и создает её, если она отсутствует.
     * Логирует процесс создания или существования коллекций.
     *
     * @async
     * @function
     * @returns {Promise<void>} Возвращает Promise, который завершается после инициализации всех коллекций.
     */
    async initializeCollections() {
        const collections = ["tasks", "subtasks", "reports", "edges"];
        for (const name of collections) {
            try {
                const collection = this.db.collection(name);
                const exists = await collection.exists();
                if (!exists) {
                    await collection.create();
                    console.log(`Коллекция ${name} создана.`);
                } else {
                    console.log(`Коллекция ${name} уже существует.`);
                }
            } catch (error) {
                console.error(`Ошибка при создании коллекции ${name}:`, error);
            }
        }
    }
    async seedData() {
        const tasks = this.db.collection("tasks");
        const subtasks = this.db.collection("subtasks");
        const edges = this.db.collection("edges");

        try {
            // Проверка и добавление задачи
            const taskExists = await tasks.documentExists("task1");
            if (!taskExists) {
                await tasks.save({
                    _key: "task1",
                    title: "Основная задача",
                    description: "Описание задачи",
                    status: "in-progress",
                    createdAt: new Date().toISOString(),
                });
                console.log("Документ task1 добавлен в к��ллекцию tasks.");
            } else {
                console.log("Документ task1 уже существует в коллекции tasks.");
            }

            // Проверка и добавление подзадачи
            const subtaskExists = await subtasks.documentExists("subtask1");
            if (!subtaskExists) {
                await subtasks.save({
                    _key: "subtask1",
                    title: "Подзадача 1",
                    description: "Описание подзадачи",
                    status: "completed",
                    createdAt: new Date().toISOString(),
                });
                console.log("Документ subtask1 добавлен в коллекцию subtasks.");
            } else {
                console.log("Документ subtask1 уже существует в коллекции subtasks.");
            }

            // Проверка и добавление связи
            const edgeExists = await edges.documentExists("task1_subtask1");
            if (!edgeExists) {
                await edges.save({
                    _key: "task1_subtask1",
                    _from: "tasks/task1",
                    _to: "subtasks/subtask1",
                    type: "hasSubtask",
                });
                console.log("Документ task1_subtask1 добавлен в коллекцию edges.");
            } else {
                console.log("Документ task1_subtask1 уже существует в коллекции edges.");
            }

            console.log("Данные успешно добавлены.");
        } catch (error) {
            console.error("Ошибка при добавлении данных:", error);
        }
    }
    async createSubtask(subtask) {
        const tasks = this.db.collection("tasks");
        try {
            const subtaskExists = await tasks.documentExists(subtask._key);
            if (!subtaskExists) {
                await tasks.save(subtask);
                console.log(`Подзадача ${subtask._key} создана.`);
            } else {
                console.log(`Подзадача ${subtask._key} уже существует.`);
            }
        } catch (error) {
            console.error("Ошибка при создании подзадачи:", error);
        }
    }
    async initialize() {
        await this.initializeCollections();
        await this.seedData();
    }


    async createTask(task) {
        const tasks = this.db.collection("tasks");
        try {
            const taskExists = await tasks.documentExists(task._key);
            if (!taskExists) {
                await tasks.save(task);
                console.log(`Задача ${task._key} создана.`);
            } else {
                console.log(`Задача ${task._key} уже существует.`);
            }
        } catch (error) {
            console.error("Ошибка при создании задачи:", error);
        }
    }

    async addReportToTask(report) {
        const reports = this.db.collection("reports");
        try {
            await reports.save(report);
            console.log(`Отчет ${report._key} добавлен.`);
        } catch (error) {
            console.error("Ошибка при добавлении отчета:", error);
        }
    }

    async getTaskDetails(taskId) {
        const tasks = this.db.collection("tasks");
        const reports = this.db.collection("reports");
        const edges = this.db.collection("edges");

        try {
            const task = await tasks.document(taskId);
            const relatedReports = await reports.byExample({ taskId });
            const relatedEdges = await edges.byExample({ _from: `tasks/${taskId}` });

            return {
                task,
                reports: relatedReports,
                subtasks: relatedEdges.map(edge => edge._to),
            };
        } catch (error) {
            console.error("Ошибка при получении данных задачи:", error);
            return null;
        }
    }

    async deleteReport(reportId) {
        const query = `FOR report IN reports FILTER report._key == @reportId REMOVE report IN reports`;
        await this.db.query(query, { reportId });
    }
}

module.exports = new DatabaseInitializer();