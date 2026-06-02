class GetTodoApiResponseItemDto {
  constructor(id, title, description, user_id,createdAt) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.user_id = user_id,
    this.createdAt = createdAt;
  }
}
module.exports = {GetTodoApiResponseItemDto};