import PersonRegistersAsUserRequestModel from "../../dataModels/personRegistersAsUserRequestModel";
import PersonRegistersAsUserResultModel from "../../dataModels/personRegistersAsUserResultModel";

export default interface PersonRegistersAsUserRequestBoundary {
    sendPersonRegistersAsUserRequest(personRegistersAsUserRequestModel: PersonRegistersAsUserRequestModel): Promise<PersonRegistersAsUserResultModel>;
}