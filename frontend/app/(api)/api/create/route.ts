import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        // const {title, description} = await request.json() await connectionToDB()
        // const newProblem = new Problem({title, description})
        // await newProblem.save()

        console.log(await request.json());

        return NextResponse.json({
            status: 200,
        })

    } catch (err) {
        console.log(err)
    }
}
