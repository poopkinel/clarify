import PersonRegistersAsUserRequestModel from "../../dataModels/v1/personRegistersAsUserRequestModel";
import PersonRegistersAsUserResultModel from "../../dataModels/v1/personRegistersAsUserResultModel";

export default interface PersonRegistersAsUserRequestBoundary {
    sendPersonRegistersAsUserRequest(personRegistersAsUserRequestModel: PersonRegistersAsUserRequestModel): Promise<PersonRegistersAsUserResultModel>;
}