import conf from '../conf/conf.js'
import {Client, Account, ID} from "appwrite"
// we need to import this conf file because we have stored our env variables in this

//we are creating a class and we are creating an object
export class AuthService{
    client = new Client();
    account;
    // we are creating an constructor of the class so that when the
    // object is created a constructor will be called
    // and at this time we are creating an account
    constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
    }

    // ^ creating account
    // we will be provided an object havinf email, password and name
    // you cann add more details into it 
    // here we are destructuring the object
    async createAccount({email, password, name}){
        // this account creation method might fail so we will use try catch
        try{
            // to create a unique id we are using one of the features of 
            // appwrite ID.unique to create unique id

            // we gotta wait untile the accont is created 
            // that's why we are using await 

            // we need to pass these fields to create an account
            const userAccount = await this.account.create(ID.unique, email, password, name);
            if(userAccount){
                // call another method
                // we will login the user account once the user account
                // is created

                // since we have login method so we can pass our
                // email and pass field to login into account once the id
                // is created
                return this.login({email, password})
            }else{
                return userAccount;
            }
        }catch(error){
            throw error;
        }
    }

    // ^ login method
    async login({email, password}){
        try{
            return await this.account.createEmailSession(email, password);
        }catch(error){
            throw error;
        }
    }

    // ^ if logged in or not
    async getCurrentUser(){
        try {
            // we have a method called get() which tells us whether the
            // you're logged in or not

            return await this.account.get();
        } catch (error) {
            console.log("Appwrite service :: getCurrentUser :: error", error);
        }
        return null;
    }

    // ^ delete session or logout
    async logout(){
        try {
            // deleteSession vs deleteSession
            // delete session will logout only from the current browser
            // while deleteSessions will logout from all the browsers
            await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite service :: logout :: error", error);
        }
    }
}

const authService = new AuthService();

export default authService;