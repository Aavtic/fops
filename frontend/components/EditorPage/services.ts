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
        const response = await apiPost(TestCodeEndpoint, requestPayload);

        return response as TestResults 
        
    } catch (error) {
        console.error("Error while sending code test request: ", error);
        
        return {
            status: 'Error',
            info: {  } 
        } as TestResults;
    }
}
