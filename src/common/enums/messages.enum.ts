export const enum AuhtMessage {
  IncorrectMessage = "email or password is incorrect",
  LoginSuccessfull = "login successfully",
}
export const enum CreateMessage {
  AdminCreated = "admin created SuccessFully",
  CategoryCreated = "category created SuccessFully",
  blogCreated = "blog created SuccessFully",
  Register = "admin created. please wait for approvment!",
}

export const enum UpdateMessage {
  Updated = "admin updated successfuly",
  CategoryUpdated = "category updated successfuly",
}
export const enum DeleteMessage {
  AdminDelete = "Admin deleted successfully ",
  CategoryDelete = "category deleted successfully ",
}
export const enum BadRequestMessage {
  ID_IS_NOT_Valid = "The id is not valid",
}
export const enum ForbiddenMessage {
  CanNotDeleteSelf = "can not delete your self",
}

export const enum NotFoundMessage {
  AdminNotFound = "the admin not found by given id",
  CategoryNotFound = "the category not found by given id",
  BlogNotFound = "the blog not found by given id",
}

export const enum UploadMessage {
  NoFileUploaded = "no file were uploaded",
}
