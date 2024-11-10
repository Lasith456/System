import { mailtrapClient,sender } from "./mailtrap.config.js";
import { VERIFICATION_EMAIL_TEMPLATE ,SUCCESSFUL_VERIFICATION_EMAIL_TEMPLATE,PASSWORD_RESET_REQUEST_TEMPLATE,PASSWORD_RESET_SUCCESS_TEMPLATE} from "./emailTemplate.js";
export const sendVerificationEmail= async(email,verificationToken,user)=>{
const reciptient=[{email}];
try {
    const response=await mailtrapClient.send({
        from:sender,
        to:reciptient,
        subject:"Verify Your Email",
        html: VERIFICATION_EMAIL_TEMPLATE.replace('{verificationCode}',verificationToken).replace('{user}', user),
        category:"Email Verification"
    })
    console.log("email sent succefully",response)
} catch (error) {
    console.error("Error sending verificatio mail",error);
    throw new Error("Error sending mail",error)
}
}
export const sendWelcomeEmail= async(email,name)=>{
    const reciptient=[{email}];
try {
    const response=await mailtrapClient.send({
        from:sender,
        to:reciptient,
        subject:"Successful Verified Your Email",
        html: SUCCESSFUL_VERIFICATION_EMAIL_TEMPLATE.replace('{user}', name),
        category:"Welcome Email Verification"
    })
    console.log("email sent succefully",response)
} catch (error) {
    console.error("Error sending welcome mail",error);
    throw new Error("Error sending welcome mail",error)
}
}

export const sendPasswordResetEmail=async(email,resetURL,user)=>{
    const recipient=[{email}];
    try {
        const response=await mailtrapClient.send({
            from:sender,
            to:recipient,
            subject:"Reset Your Password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",resetURL).replace('{user}', user),
            category: "password Reset"
        })
    } catch (error) {
        console.error('error Sending Password reset email',error)
        throw new Error('error sending password reset email ',error)
    }
}

export const sendResetSuccessEmail= async(email,user)=>{
    const recipient=[{email}];
    try {
        const response=await mailtrapClient.send({
            from:sender,
            to:recipient,
            subject:"Password Reset Successfully",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE.replace('{user}', user),
            category: "password Reset"
        })
        console.log("Password Reset Successful",response)
    } catch (error) {
        console.error('error Sending Password reset email',error)
        throw new Error('error sending password reset email ',error)
    }
}