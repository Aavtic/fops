import { apiPost } from '@/lib/http/client'
import { TestCodeRequest } from '@/lib/requests/requests'
import { TestCodeEndpoint } from '@/lib/http/endpoints';
import { TestResults } from "./TestOperations"

export async function TestCodeAPI(code: string, problem_id: string): Promise<TestResults> {
    
    const requestPayload: TestCodeRequest = {
        problem_id: problem_id,
        code: code,
        language: "python"
    };
    
    try {
        // 2. Use 'await' to wait for the API response
        const response = await apiPost(TestCodeEndpoint, requestPayload);

        // 3. You must ensure the response data conforms to TestResults
        // This usually involves casting or validation based on your API framework.

        return response as TestResults 
        
    } catch (error) {
        console.error("Error while sending code test request: ", error);
        
        // 4. Return an Error/Fail state that matches your TestResults interface
        // This is a robust way to handle the API failure gracefully.
        return {
            status: 'Error',
            info: { /* Provide default or empty structure for TestInfo */ } 
        } as TestResults;
        
        // OR, simply re-throw the error if the caller is expected to handle it
        // throw new Error("Could not send request"); 
    }
}
