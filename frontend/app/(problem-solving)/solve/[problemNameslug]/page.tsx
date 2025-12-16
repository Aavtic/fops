import EditorPage from "@/components/EditorPage/EditorPage"

import { apiFetch } from "@/lib/http/client"
import { ProblemDetailsResponse } from "@/lib/responses/responses"

export default async function ProblemPage({ params }: { params: Promise<{ problemNameslug: string }> }
) {
    const {problemNameslug} = await params;
    console.log(problemNameslug);
    const titleSlug = problemNameslug;
    const response = await getPageData(titleSlug)
    var problem_id = ""
    var title = ""
    var description = ""
    var codeTemplate = ""

    if (response.NotFound) {
        return <>
                <div className="flex items-center justify-center h-screen">
                <h1 className="text-red-600">Page Not Found</h1>
                </div>
               </>
    } else if (response.ServerError) {
        return <>
                <div className="flex items-center justify-center h-screen">
                <h1 className="text-red-600">Oops...Server Error!</h1>
                </div>
               </>
    } else {
        console.log(response.data)
        problem_id = response.data!.id
        title = response.data!.title
        description = response.data!.description
        codeTemplate = response.data!.code_template
    }

  return (
    <div>
    <EditorPage problem_id={problem_id} title={title} description={description} codeTemplate={codeTemplate}/>
    </div>
  );
}

async function getPageData(titleSlug: string) {
    const response = await apiFetch(`http://localhost:8080/api/db/get_question_details/${titleSlug}`);

    if (response.status === 200) {
        const json:ProblemDetailsResponse = await response.json()
        console.log(json)
        return {
            data: json,
            NotFound: false,
            ServerError: false
        }
    } else if (response.status === 404) {
        console.log("page is not found");
        return { data: null, ServerError: false, NotFound: true }
    } else {
        // TODO:
        // this is internal server error. create a page for that
        return { data: null, NotFound: false, ServerError : true }
    }
}
