import { RegistrationInputModel } from "../dataModels/registrationInputModel";

export interface UserRegistrationInput {
    register(registrationModel: RegistrationInputModel): void;
}