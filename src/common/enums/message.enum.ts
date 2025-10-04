export enum BadRequestMessage {
    InValidLoginData = 'اطلاعات ارسال شده برای ورود صحیح نمی باشد',
    InValidRegisterData = 'اطلاعات ارسال شده برای ثبت نام صحیح نمی باشد',
}

export enum AuthMessage {
    NotFoundAccount = 'حساب کاربری یافت نشد',
    AlreadyExistAccount = 'حساب کاربری با این مشخصات از قبل وجود داره',
    ExpiredCode = 'کد تایید منقضی شده',
    TryAgain = 'خطا لطفا دوباره تلاش کنید',
    LoginRequired = 'لطفا وارد حساب کاربری خود شوید',
    AccessDenied = 'درخواست شما توسط سرور رد شده است'
}

export enum NotFoundMessage {
    NotFound = 'موردی یافت نشد',
    NotFoundTask = 'تسک یافت نشد',
    NotFoundPost = 'مقاله یافت نشد',
    NotFoundUser = 'کاربری یافت نشد'
}

export enum ValidationMessage {

}

export enum PublicMessage {
    SentOtp = 'کد یک بار مصرف ارسال شد',
    LoggedIn = 'با موفقیت وارد حساب کاربری شدید',
    Created = 'با موفقیت ایجاد شد',
    Updated = 'با موفقیت به روز رسانی شد',
    Deleted = 'با موفقیت حذف شد',
    Inserted = 'با موفقیت درج شد'
}

export enum ConflictMessage {
    TaskTitle = 'عنوان تسک بندی قبلا ثبت شده است'
}