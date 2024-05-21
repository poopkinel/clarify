export default interface ChatSharer {
    getLink(): Promise<string>;
}