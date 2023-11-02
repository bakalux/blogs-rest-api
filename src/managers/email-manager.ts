import {createTransport} from "nodemailer";
import {EMAIL_LOGIN, EMAIL_PASSWORD} from "../settings";

class EmailManager {
    private _transporter;

    constructor() {
        this._transporter = createTransport({
            service: 'gmail',
            auth: {
                user: EMAIL_LOGIN,
                pass: EMAIL_PASSWORD
            }
        });
    }

    sendEmail = async (sender: string, receiver: string, subject: string, text: string): Promise<boolean> => {
        const info = await this._transporter.sendMail(
            {
                from: sender,
                to: receiver,
                subject,
                text,
            },
        );


        return info.rejected[0] !== receiver;
    }
}


export const emailManager = new EmailManager();
