import ResponseMedia from "../response/responseMedia/ResponseMedia";
import ResponseRestrictions from "../response/responseRestrictions/ResponseRestrictions";

export default interface ChatResponseOption {
    responseMedia: ResponseMedia;
    responseRestrictions: ResponseRestrictions;
}