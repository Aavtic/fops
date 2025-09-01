import EditorPage from "@/components/EditorPage/EditorPage"

export default async function ProblemPage({params}: {params: {problemNameslug: string}}) {
    const titleSlug = params.problemNameslug;
    const response = await getPageData(titleSlug)
    var title = ""
    var description = ""

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
        title = response.data.title
        description = response.data.description
    }

  return (
    <div>
    <EditorPage title={title} description={description}/>
    </div>
  );
}

async function getPageData(titleSlug: string) {
    const response = await fetch(`http://localhost:8080/api/db/get_question_details/${titleSlug}`);
    if (response.status === 200) {
        const json = await response.json()
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
