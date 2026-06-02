class OtpModel {
    constructor(id, code, email, user_id, createdAt){
        this.id = id;
        this.code = code;
        this.email = email;
        this.user_id =user_id;
        this.createdAt = createdAt;
    }
}
module.exports = OtpModel;