import {environment} from '../../../src/environments/environment';

export const values = {
    urls: {
        loginPage: environment.clientUrl + "/login",
        dashboardPage: environment.clientUrl + "/home/adminControl/dashboard",
        signUpPage: environment.clientSignupUrl
    },
    loginPage: {
        appTitle: "SafetyBeat",
        legendWelcome: "Welcome to",
        legendAppName: 'SafetyBeat',
        legendDescription: "The only safety app that allows you to easily manage the safety of your workers, anytime, anywhere",
        loginBoxHeading: "LOGIN",
        loginBoxDescription: "You need to sign in to get access",
        loginButtonText: "Login",
        loginForgetPassText: "Forgot Password?",
        email: "k.basharat@optergy.com",
        password: "lahore123"
    },
    signUpPage: {
        appTitle: "SafetyBeat",
        emailToSignUp: "",
        signupUserInfoLink: environment.clientUrl + "/signup/bW90aUBhbWFpbHIubmV0"
    },
    dashboardPage: {
        appTitle: "SafetyBeat"
    }
}
