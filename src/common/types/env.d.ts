namespace NodeJs {
    interface ProcessEnv {
        //Application
        PORT: number
        //Database
        DB_PORT: string,
        DB_NAME: string,
        DB_USERNAME: string,
        DB_PASSWORD: string,
        DB_HOST: string
        //Secret
        COOKIE_SECRET: string
        OTP_TOKEN_SECRET: string
        ACCESS_TOKEN_SECRET: string
    }
}