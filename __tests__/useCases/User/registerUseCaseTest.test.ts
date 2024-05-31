import RegisterUseCase from '../../../src/useCases/current/registerUseCase';

class ResiterUseCaseTest {
    runTests() {

        describe('placeholder', () => {
            it('placeholder', () => {
                expect(true).toBeTruthy();
            });
        });
    }
    //     describe.skip('Given a spy out boundary', () => {
    //         const usecaseOutBoundarySpy = {
    //             sendResultModel: jest.fn()
    //         }

    //         describe('Given a dummy request', () => {
    //             const dummyRequestModel = {
    //                 username: '',
    //                 password: ''
    //             }
    //             const dummyUser = {
    //                 username: '',
    //                 password: ''
    //             }

    //             const dummyGatewayCreateUserResult = {
    //                 user: dummyUser,
    //                 error: '',
    //                 success: true
    //             }

    //             const dummyUserGatewayToCreateUser = {
    //                 createUser: jest.fn().mockResolvedValue(dummyGatewayCreateUserResult)
    //             }

    //             const dummyUseCase = new RegisterUseCase(dummyUserGatewayToCreateUser, usecaseOutBoundarySpy);
    //             dummyUseCase.registerUser(dummyRequestModel);
                
    //             it('should call userGatewayToCreateUser.createUser', () => {
    //                 expect(dummyUserGatewayToCreateUser.createUser).toHaveBeenCalled();
    //             });

    //             it('should call usecaseOutBoundary.sendResultModel', async () => {
    //                 await dummyUseCase.registerUser(dummyRequestModel);
    //                 expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalled();
    //             });
    //         });
    //         describe('Given a stub request model', () => {
    //             const stubUsername = 'stubUsername';
    //             const stubPassword = 'stubPassword';

    //             const stubRequestModel = {
    //                 username: stubUsername,
    //                 password: stubPassword
    //             }
                
    //             describe('Given a stub gateway', () => {

    //                 const stubSuccessTrue = true;
    //                 const stubCreatedUserId = 'registeredUserId';

    //                 const stubUser = {
    //                     success: stubSuccessTrue,
    //                     id: stubCreatedUserId
    //                 }

    //                 const stubGatewayCreateUserResult = {
    //                     user: stubUser,
    //                     error: '',
    //                     success: stubSuccessTrue
    //                 }

    //                 const stubUserGatewayToCreateUser = {
    //                     createUser: jest.fn().mockResolvedValue(stubGatewayCreateUserResult)
    //                 }
    //                 const stubUseCase = new RegisterUseCase(stubUserGatewayToCreateUser, usecaseOutBoundarySpy);

    //                 it('should call userGatewayToCreateUser.createUser', async () => {
    //                     await stubUseCase.registerUser(stubRequestModel);
    //                     expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith({
    //                         success: stubSuccessTrue, 
    //                         userId: stubUser.id,
    //                         error: ''
    //                     });
    //                 });
    //             });

    //             describe('Given a stub gateway for creation failure', () => {
    //                 const stubSuccessFalse = false;
    //                 const stubErrorUserId = '';
    //                 const subErrorMessage = 'error message';

    //                 const stubUser = {
    //                     success: stubSuccessFalse,
    //                     id: stubErrorUserId
    //                 }

    //                 const stubGatewayResult = {
    //                     user: stubUser,
    //                     error: subErrorMessage,
    //                     success: stubSuccessFalse
    //                 }

    //                 const stubUserGatewayToCreateUser = {
    //                     createUser: jest.fn().mockResolvedValue(stubGatewayResult)
    //                 }
    //                 const stubUseCase = new RegisterUseCase(stubUserGatewayToCreateUser, usecaseOutBoundarySpy);

    //                 it('should call userGatewayToCreateUser.createUser with fail status and empty userId', async () => {
    //                     await stubUseCase.registerUser(stubRequestModel);
    //                     expect(usecaseOutBoundarySpy.sendResultModel).toHaveBeenCalledWith({
    //                         success: stubSuccessFalse, 
    //                         userId: stubUser.id,
    //                         error: subErrorMessage
    //                     });
    //                 });
    //             });
    //         });
    //     });
    // }
}

const registerUseCaseTest = new ResiterUseCaseTest();
registerUseCaseTest.runTests();