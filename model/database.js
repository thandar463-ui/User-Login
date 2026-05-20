const { Pool} = require("pg");
let db=null;

class DB {
    #pool;
    static create () {
        if (!!db) {
            return db;
        }
        db = new DB();
        return db;
    }
    pool() {
        return this.#pool;
    }
    connect (config){
        const pool = new Pool({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database,
            port: config.port,
            onConnect: async () => {
                console.log("Database connection established",  new Date(). toString());
            },
        });
        this.#pool = pool;
    }
}
module.exports = { DB };