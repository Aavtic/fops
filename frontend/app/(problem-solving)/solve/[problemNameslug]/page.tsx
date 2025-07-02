import EditorPage from "@/components/EditorPage/EditorPage"

export default async function ProblemPage({params}: {params: {problemNameslug: string}}) {

    const title = "Fibonacci";
    const description = "Fibonacci series is a series of numbers in which each number is the sum of the two pervious numbers";
    // console.log(params.problemNameslug);

  return (
    <div>
    <EditorPage title={title} description={description}/>
    </div>
  );
}

